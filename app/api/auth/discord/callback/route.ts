import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/auth/signin?error=no_code", request.url));
  }

  const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const redirectUri = process.env.DISCORD_REDIRECT_URI;
  const botToken = process.env.DISCORD_BOT_TOKEN;
  const guildId = process.env.DISCORD_GUILD_ID;
  const roleId = process.env.DISCORD_ROLE_ID || "1302807933821915178";

  try {
    // 1. Exchange OAuth code for an access token
    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId || "",
        client_secret: clientSecret || "",
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri || "",
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error("Failed to exchange authorization code");
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // 2. Fetch authenticated user's profile to get their User ID
    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error("Failed to fetch user profile");
    }

    const userData = await userResponse.json();
    const userId = userData.id;

    // 3. Check guild membership and roles using Discord Bot API
    const memberResponse = await fetch(
      `https://discord.com/api/guilds/${guildId}/members/${userId}`,
      {
        headers: {
          Authorization: `Bot ${botToken}`,
        },
      }
    );

    if (memberResponse.status === 404) {
      // User is not in the guild/server
      return NextResponse.redirect(new URL("/auth/signin?error=not_in_guild", request.url));
    }

    if (!memberResponse.ok) {
      throw new Error("Failed to fetch guild member details");
    }

    const memberData = await memberResponse.json();
    const roles = memberData.roles as string[];

    // 4. Check if the user has the specified Whitelist role
    // REMOVED: Anyone in the Discord server can now access the dashboard
    /*
    if (!roles.includes(roleId)) {
      return NextResponse.redirect(new URL("/auth/signin?error=no_role", request.url));
    }
    */

    // 5. Fetch all server roles to find the user's highest role name
    let highestRoleName = "Whitelist";
    try {
      const rolesResponse = await fetch(`https://discord.com/api/guilds/${guildId}/roles`, {
        headers: {
          Authorization: `Bot ${botToken}`,
        },
      });
      if (rolesResponse.ok) {
        const guildRoles = await rolesResponse.json();
        const userRoles = guildRoles
          .filter((r: any) => roles.includes(r.id))
          .sort((a: any, b: any) => b.position - a.position);
        if (userRoles.length > 0) {
          highestRoleName = userRoles[0].name;
        }
      }
    } catch (e) {
      console.error("Error fetching guild roles:", e);
    }

    // Success! Redirect to dashboard with cookie
    const userCookieData = {
      id: userData.id,
      username: userData.username,
      avatar: userData.avatar,
      joinedAt: memberData.joined_at || new Date().toISOString(),
      role: highestRoleName,
    };

    const successResponse = NextResponse.redirect(new URL("/dashboard", request.url));
    successResponse.cookies.set("discord_user", JSON.stringify(userCookieData), {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      httpOnly: false,
    });
    return successResponse;
  } catch (error) {
    console.error("Discord Authentication Error:", error);
    return NextResponse.redirect(new URL("/auth/signin?error=auth_failed", request.url));
  }
}
