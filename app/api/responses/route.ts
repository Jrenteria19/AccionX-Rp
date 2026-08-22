import { NextResponse } from "next/server";
import db from "@/lib/db";

// Helper function to send Discord DM
async function sendDiscordDM(userId: string, message: string) {
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token) {
    console.error("DISCORD_BOT_TOKEN not configured");
    return;
  }
  try {
    const dmRes = await fetch("https://discord.com/api/v10/users/@me/channels", {
      method: "POST",
      headers: {
        "Authorization": `Bot ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ recipient_id: userId }),
    });
    if (!dmRes.ok) {
      console.error("Failed to create DM channel:", await dmRes.text());
      return;
    }
    const dmChannel = await dmRes.json();
    const channelId = dmChannel.id;

    const msgRes = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Bot ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: message }),
    });
    if (!msgRes.ok) {
      console.error("Failed to send DM message:", await msgRes.text());
    }
  } catch (err) {
    console.error("Error sending Discord DM:", err);
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const formId = searchParams.get("formId");
    
    let rows;
    if (formId) {
      rows = await db.all("SELECT * FROM responses WHERE form_id = ? ORDER BY id DESC", [formId]);
    } else {
      rows = await db.all("SELECT * FROM responses ORDER BY id DESC");
    }

    const parsedRows = rows.map((r: any) => ({
      ...r,
      answers: JSON.parse(r.answers),
    }));

    return NextResponse.json(parsedRows);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { formId, userId, username, avatar, answers } = await req.json();
    if (!formId || !userId || !username || !answers) {
      return NextResponse.json({ error: "Missing required submission fields" }, { status: 400 });
    }

    const submittedAt = new Date().toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });

    const info = await db.run(`
      INSERT INTO responses (form_id, user_id, username, avatar, answers, status, submitted_at)
      VALUES (?, ?, ?, ?, ?, 'Pendiente', ?)
    `, [
      formId,
      userId,
      username,
      avatar || "",
      JSON.stringify(answers),
      submittedAt
    ]);

    return NextResponse.json({ id: Number(info.lastInsertRowid), status: "Pendiente" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { responseId, status, message } = await req.json();
    if (!responseId || !status) {
      return NextResponse.json({ error: "Missing responseId or status" }, { status: 400 });
    }

    // 1. Get user details from the response
    const responseRow: any = await db.get("SELECT * FROM responses WHERE id = ?", [responseId]);
    if (!responseRow) {
      return NextResponse.json({ error: "Response not found" }, { status: 404 });
    }

    const formRow: any = await db.get("SELECT * FROM forms WHERE id = ?", [responseRow.form_id]);
    const formTitle = formRow ? formRow.title : "Formulario";

    // 2. Update response status
    await db.run("UPDATE responses SET status = ? WHERE id = ?", [status, responseId]);

    // 3. Create a Dashboard notification
    const notificationMsg = `Tu solicitud para "${formTitle}" ha sido ${status === "Aprobada" ? "APROBADA" : "RECHAZADA"}.`;
    const createdAt = new Date().toLocaleString("es-ES");
    await db.run("INSERT INTO notifications (user_id, message, created_at) VALUES (?, ?, ?)", [
      responseRow.user_id,
      notificationMsg,
      createdAt
    ]);

    // 4. Send Discord DM
    const discordDMMessage = `**ACCIÓN X RP** \n¡Hola ${responseRow.username}!\nTu solicitud para el formulario **${formTitle}** ha sido **${status.toUpperCase()}**.\n${
      message ? `Detalles del revisor: _"${message}"_` : ""
    }\n¡Gracias por formar parte de nuestra comunidad!`;

    await sendDiscordDM(responseRow.user_id, discordDMMessage);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
