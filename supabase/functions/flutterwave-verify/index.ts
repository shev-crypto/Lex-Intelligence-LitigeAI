import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

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

    const { transaction_id, tx_ref } = await req.json();
    if (!transaction_id) {
      return new Response(JSON.stringify({ error: "transaction_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify with Flutterwave
    const verifyRes = await fetch(
      `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
      {
        headers: {
          Authorization: `Bearer ${Deno.env.get("FLUTTERWAVE_SECRET_KEY")}`,
        },
      }
    );

    const verifyData = await verifyRes.json();

    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    if (verifyData.status === "success" && verifyData.data.status === "successful") {
      const meta = verifyData.data.meta;

      // Update payment
      await adminClient
        .from("payments")
        .update({
          status: "success",
          flutterwave_transaction_id: String(transaction_id),
        })
        .eq("flutterwave_reference", tx_ref);

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
            payment_gateway: "flutterwave",
            flutterwave_customer_id: String(verifyData.data.customer?.id || ""),
            flutterwave_tx_ref: tx_ref,
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
          payment_gateway: "flutterwave",
          flutterwave_customer_id: String(verifyData.data.customer?.id || ""),
          flutterwave_tx_ref: tx_ref,
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
        .eq("flutterwave_reference", tx_ref);

      return new Response(
        JSON.stringify({ verified: false, reason: "Payment verification failed" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
