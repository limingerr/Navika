import { NextResponse } from "next/server";
import { createClient } from "@/src/lib/supabase/server";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(request) {
  const supabase = await createClient();
  const { data: authData } = supabase ? await supabase.auth.getUser() : { data: null };
  const user = authData?.user;
  if (!user) return NextResponse.json({ error: "Sesi mahasiswa diperlukan." }, { status: 401 });

  const { subscriptionId } = await request.json().catch(() => ({}));
  if (!UUID_REGEX.test(subscriptionId || "")) return NextResponse.json({ error: "ID langganan tidak valid." }, { status: 400 });

  const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
  const apiKey = process.env.ONESIGNAL_REST_API_KEY;
  if (!appId || !apiKey) return NextResponse.json({ error: "OneSignal belum dikonfigurasi di server." }, { status: 503 });

  try {
    const response = await fetch(`https://api.onesignal.com/apps/${encodeURIComponent(appId)}/subscriptions/${encodeURIComponent(subscriptionId)}/user/identity`, {
      headers: { Authorization: `Key ${apiKey}` },
      cache: "no-store",
    });
    if (response.status === 404) return NextResponse.json({ registered: false });
    if (!response.ok) return NextResponse.json({ error: `Pemeriksaan OneSignal gagal (HTTP ${response.status}).` }, { status: 502 });
    const data = await response.json();
    const externalId = data?.identity?.external_id;
    const registered = externalId === user.id || externalId === user.email;
    return NextResponse.json({ registered });
  } catch {
    return NextResponse.json({ error: "OneSignal tidak dapat dihubungi." }, { status: 502 });
  }
}
