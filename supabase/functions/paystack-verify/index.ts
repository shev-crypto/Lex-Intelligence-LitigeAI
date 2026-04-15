import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { reference } = await req.json();
    if (!reference || typeof reference !== "string") {
      return new Response(JSON.stringify({ error: "reference required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Idempotency + ownership check: verify payment belongs to user and isn't already processed
    const { data: existingPayment } = await adminClient
      .from("payments")
      .select("id, status, user_id")
      .eq("paystack_reference", reference)
      .single();

    if (!existingPayment) {
      return new Response(JSON.stringify({ error: "Payment record not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (existingPayment.user_id !== user.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (existingPayment.status === "success") {
      return new Response(
        JSON.stringify({ verified: true, message: "Already verified" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify with Paystack
    const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: {
        Authorization: `Bearer ${Deno.env.get("PAYSTACK_SECRET_KEY")}`,
      },
    });

    const verifyData = await verifyRes.json();

    if (verifyData.status && verifyData.data.status === "success") {
      const meta = verifyData.data.metadata;

      // Update payment status (with user_id filter)
      await adminClient
        .from("payments")
        .update({
          status: "success",
          paystack_transaction_id: String(verifyData.data.id),
        })
        .eq("paystack_reference", reference)
        .eq("user_id", user.id);

      // Create/update subscription
      const now = new Date();
      const periodEnd = new Date(now);
      if (meta.billing_cycle === "annual") {
        periodEnd.setFullYear(periodEnd.getFullYear() + 1);
      } else {
        periodEnd.setMonth(periodEnd.getMonth() + 1);
      }

      const { data: existingSub } = await adminClient
        .from("subscriptions")
        .select("id")
        .eq("user_id", user.id)
        .in("status", ["trialing", "active", "past_due"])
        .limit(1);

      if (existingSub && existingSub.length > 0) {
        await adminClient
          .from("subscriptions")
          .update({
            plan_id: meta.plan_id,
            status: "active",
            billing_cycle: meta.billing_cycle,
            current_period_start: now.toISOString(),
            current_period_end: periodEnd.toISOString(),
            payment_gateway: "paystack",
            paystack_customer_code: verifyData.data.customer?.customer_code || null,
          })
          .eq("id", existingSub[0].id);
      } else {
        await adminClient.from("subscriptions").insert({
          user_id: user.id,
          plan_id: meta.plan_id,
          status: "active",
          billing_cycle: meta.billing_cycle,
          current_period_start: now.toISOString(),
          current_period_end: periodEnd.toISOString(),
          payment_gateway: "paystack",
          paystack_customer_code: verifyData.data.customer?.customer_code || null,
        });
      }

      return new Response(
        JSON.stringify({ verified: true, plan: meta.plan_slug }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      await adminClient
        .from("payments")
        .update({ status: "failed" })
        .eq("paystack_reference", reference)
        .eq("user_id", user.id);

      return new Response(
        JSON.stringify({ verified: false, reason: verifyData.data?.gateway_response || "Payment failed" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
