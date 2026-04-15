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

    const { plan_slug, billing_cycle } = await req.json();
    if (!plan_slug || !billing_cycle) {
      return new Response(JSON.stringify({ error: "plan_slug and billing_cycle required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: plan } = await adminClient
      .from("plans")
      .select("*")
      .eq("slug", plan_slug)
      .eq("is_active", true)
      .single();

    if (!plan) {
      return new Response(JSON.stringify({ error: "Plan not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const amount = billing_cycle === "annual" ? plan.annual_price : plan.monthly_price;
    const tx_ref = `fw_${user.id.slice(0, 8)}_${Date.now()}`;

    // Store pending payment
    await adminClient.from("payments").insert({
      user_id: user.id,
      amount,
      currency: "NGN",
      status: "pending",
      flutterwave_reference: tx_ref,
      payment_gateway: "flutterwave",
      description: `${plan.name} plan - ${billing_cycle}`,
    });

    // Return config for Flutterwave inline JS
    return new Response(
      JSON.stringify({
        tx_ref,
        amount,
        currency: "NGN",
        public_key: "FLWPUBK_TEST-cfcf9ba466ce8c8b1fe8e404aec54c2f-X",
        customer: {
          email: user.email,
          name: user.user_metadata?.full_name || user.email,
        },
        meta: {
          user_id: user.id,
          plan_id: plan.id,
          plan_slug,
          billing_cycle,
        },
        customizations: {
          title: "LitigeAI",
          description: `${plan.name} Plan - ${billing_cycle === "annual" ? "Annual" : "Monthly"}`,
          logo: "https://litigeai.lovable.app/placeholder.svg",
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
