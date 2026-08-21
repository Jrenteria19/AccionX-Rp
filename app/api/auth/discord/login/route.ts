import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
  const redirectUri = encodeURIComponent(process.env.DISCORD_REDIRECT_URI || "");

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      { error: "Discord Client ID or Redirect URI not configured in environment" },
      { status: 500 }
    );
  }

  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify%20guilds`;
  return NextResponse.redirect(discordAuthUrl);
}
