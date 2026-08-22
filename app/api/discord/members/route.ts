import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  const botToken = process.env.DISCORD_BOT_TOKEN;
  const guildId = process.env.DISCORD_GUILD_ID;

  let approvedCount = 0;
  try {
    const row = await db.get("SELECT COUNT(*) as count FROM responses WHERE form_id = 999999 AND status = 'Aprobada'");
    approvedCount = row?.count || 0;
  } catch (e) {
    console.error("Error reading approved count from DB:", e);
  }

  // Fallback defaults if env variables are not fully set up yet
  if (!botToken || !guildId) {
    return NextResponse.json({ memberCount: 154, activeCount: 68, approvedCount });
  }

  try {
    const response = await fetch(
      `https://discord.com/api/guilds/${guildId}?with_counts=true`,
      {
        headers: {
          Authorization: `Bot ${botToken}`,
        },
        next: { revalidate: 60 } // Cache counts for 60 seconds
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch guild details from Discord");
    }

    const data = await response.json();
    return NextResponse.json({
      memberCount: data.approximate_member_count || 154,
      activeCount: data.approximate_presence_count || 68,
      approvedCount,
    });
  } catch (error) {
    console.error("Error fetching Discord member counts:", error);
    return NextResponse.json({ memberCount: 154, activeCount: 68, approvedCount });
  }
}
