import { NextResponse } from "next/server";
import crypto from "crypto";
import db from "@/lib/db";
import fs from "fs";
import path from "path";

// Direct Message helper
async function sendDM(userId: string, embed: any) {
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token) return;

  try {
    // Create DM channel
    const dmChanRes = await fetch("https://discord.com/api/v10/users/@me/channels", {
      method: "POST",
      headers: {
        "Authorization": `Bot ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ recipient_id: userId })
    });

    if (!dmChanRes.ok) {
      console.error("Failed to create DM channel:", await dmChanRes.text());
      return;
    }

    const dmChannel = await dmChanRes.json();
    
    // Post embed to DM channel
    const dmMsgRes = await fetch(`https://discord.com/api/v10/channels/${dmChannel.id}/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Bot ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ embeds: [embed] })
    });

    if (!dmMsgRes.ok) {
      console.error("Failed to send DM message:", await dmMsgRes.text());
    }
  } catch (err) {
    console.error("Error sending DM:", err);
  }
}

// Modify member roles helper
async function updateMemberRoles(userId: string, roleToRemove: string, roleToAdd: string) {
  const token = process.env.DISCORD_BOT_TOKEN;
  const guildId = process.env.DISCORD_GUILD_ID;
  if (!token || !guildId) {
    console.error("Missing Bot Token or Guild ID for updating roles.");
    return;
  }

  try {
    // Add role
    const addRes = await fetch(`https://discord.com/api/v10/guilds/${guildId}/members/${userId}/roles/${roleToAdd}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bot ${token}`
      }
    });

    if (!addRes.ok) {
      console.error(`Failed to add role ${roleToAdd} to user ${userId}:`, await addRes.text());
    }

    // Remove role
    const removeRes = await fetch(`https://discord.com/api/v10/guilds/${guildId}/members/${userId}/roles/${roleToRemove}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bot ${token}`
      }
    });

    if (!removeRes.ok) {
      console.error(`Failed to remove role ${roleToRemove} from user ${userId}:`, await removeRes.text());
    }
  } catch (err) {
    console.error("Error updating guild member roles:", err);
  }
}

// Native cryptography signature verification (Ed25519 raw import via DER prefixing)
function verifySignature(signature: string, timestamp: string, body: string, publicKey: string) {
  try {
    const key = crypto.createPublicKey({
      key: Buffer.concat([
        Buffer.from("302a300506032b6570032100", "hex"),
        Buffer.from(publicKey, "hex")
      ]),
      format: "der",
      type: "spki"
    });
    return crypto.verify(
      undefined,
      Buffer.from(timestamp + body),
      key,
      Buffer.from(signature, "hex")
    );
  } catch (e) {
    console.error("Error verifying signature:", e);
    return false;
  }
}

function logDebug(message: string, data?: any) {
  try {
    const logPath = path.resolve(process.cwd(), "interactions_debug.log");
    const logLine = `[${new Date().toISOString()}] ${message} ${data ? JSON.stringify(data) : ""}\n`;
    fs.appendFileSync(logPath, logLine);
  } catch (e) {
    console.error("Failed to write debug log:", e);
  }
}

export async function POST(req: Request) {
  logDebug("Incoming webhook request received");
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-signature-ed25519") || "";
    const timestamp = req.headers.get("x-signature-timestamp") || "";
    const publicKey = process.env.DISCORD_PUBLIC_KEY || "";

    if (publicKey) {
      const isValid = verifySignature(signature, timestamp, rawBody, publicKey);
      if (!isValid) {
        return new NextResponse("Invalid request signature", { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody);

    // Type 1: PING
    if (payload.type === 1) {
      return NextResponse.json({ type: 1 });
    }

    // Type 3: MESSAGE_COMPONENT
    if (payload.type === 3) {
      const customId = payload.data.custom_id || "";

      if (customId.startsWith("phase1_accept_")) {
        const responseId = customId.split("_").pop();

        // Verify status first
        const response = await db.get("SELECT * FROM responses WHERE id = ?", [responseId]);
        if (!response) {
          return NextResponse.json({
            type: 4,
            data: { content: "❌ Error: No se encontró la solicitud en la base de datos.", flags: 64 }
          });
        }

        if (response.status !== "Pendiente") {
          return NextResponse.json({
            type: 4,
            data: { content: `⚠️ Esta solicitud ya fue resuelta como **${response.status}**.`, flags: 64 }
          });
        }

        // Return Modal on Discord to write accept reason and Phase 2 instructions
        return NextResponse.json({
          type: 9, // MODAL
          data: {
            title: "Aceptar Whitelist",
            custom_id: `phase1_accept_modal_${responseId}`,
            components: [
              {
                type: 1,
                components: [
                  {
                    type: 4,
                    custom_id: "accept_reason",
                    label: "Motivo de la aceptación",
                    style: 1, // SHORT
                    min_length: 5,
                    max_length: 100,
                    placeholder: "Ej: Excelente normativa y redacción de respuestas...",
                    required: true
                  }
                ]
              },
              {
                type: 1,
                components: [
                  {
                    type: 4,
                    custom_id: "next_instructions",
                    label: "Pautas para la Fase 2 (Entrevista)",
                    style: 2, // PARAGRAPH
                    min_length: 10,
                    max_length: 300,
                    placeholder: "Ej: Entra al canal de voz Sala de Espera para tu entrevista oral...",
                    required: true
                  }
                ]
              }
            ]
          }
        });
      }

      if (customId.startsWith("phase1_reject_")) {
        const responseId = customId.split("_").pop();

        // Verify status first
        const response = await db.get("SELECT * FROM responses WHERE id = ?", [responseId]);
        if (!response) {
          return NextResponse.json({
            type: 4,
            data: { content: "❌ Error: No se encontró la solicitud en la base de datos.", flags: 64 }
          });
        }

        if (response.status !== "Pendiente") {
          return NextResponse.json({
            type: 4,
            data: { content: `⚠️ Esta solicitud ya fue resuelta como **${response.status}**.`, flags: 64 }
          });
        }

        // Return Modal on Discord to write reason and allowed daily attempts
        return NextResponse.json({
          type: 9, // MODAL
          data: {
            title: "Rechazar Whitelist",
            custom_id: `phase1_reject_modal_${responseId}`,
            components: [
              {
                type: 1,
                components: [
                  {
                    type: 4,
                    custom_id: "reject_reason",
                    label: "Motivo del rechazo",
                    style: 2, // PARAGRAPH
                    min_length: 5,
                    max_length: 250,
                    placeholder: "Ej: Conceptos erróneos sobre PG o MG...",
                    required: true
                  }
                ]
              },
              {
                type: 1,
                components: [
                  {
                    type: 4,
                    custom_id: "attempts_limit",
                    label: "Intentos diarios permitidos para hoy",
                    style: 1, // SHORT
                    min_length: 1,
                    max_length: 2,
                    value: "2",
                    required: true
                  }
                ]
              }
            ]
          }
        });
      }
    }

    // Type 5: MODAL_SUBMIT
    if (payload.type === 5) {
      const customId = payload.data.custom_id || "";
      const member = payload.member;
      const staffUser = member ? member.user : null;
      const staffTag = staffUser ? `@${staffUser.username}` : "Staff";

      if (customId.startsWith("phase1_accept_modal_")) {
        const responseId = customId.split("_").pop();
        const acceptReason = payload.data.components[0].components[0].value || "Excelente desempeño";
        const nextInstructions = payload.data.components[1].components[0].value || "Sigue con la Fase 2.";

        const response = await db.get("SELECT * FROM responses WHERE id = ?", [responseId]);
        if (!response) {
          return NextResponse.json({
            type: 4,
            data: { content: "❌ Error: No se encontró la solicitud en la base de datos.", flags: 64 }
          });
        }

        // Update response status to approved
        await db.run("UPDATE responses SET status = 'Aprobada' WHERE id = ?", [responseId]);

        // Create notification
        const notificationMsg = `¡Felicidades! Tu solicitud de Whitelist ha sido Aprobada por ${staffTag}. Motivo: ${acceptReason}. Siguientes pasos (Fase 2): ${nextInstructions}`;
        await db.run("INSERT INTO notifications (user_id, message, created_at) VALUES (?, ?, ?)", [
          response.user_id,
          notificationMsg,
          new Date().toLocaleString()
        ]);

        // Update roles in Discord (ejecutar en segundo plano)
        updateMemberRoles(response.user_id, "1302807933821915178", "1302808314626707517")
          .catch(e => console.error("Error updating member roles in background:", e));

        // Send premium embedded direct message (ejecutar en segundo plano)
        const dmEmbed = {
          title: "✨ WHITELIST APROBADA - ACCIÓN X RP ✨",
          description: `¡Felicidades <@${response.user_id}>! Has aprobado exitosamente el cuestionario de normativas de la Whitelist.`,
          color: 1096185, // #10B981 (Emerald Green)
          fields: [
            { name: "🏆 Estado", value: "APROBADA", inline: true },
            { name: "👤 Revisor/Staff", value: staffTag, inline: true },
            { name: "💬 Motivo de Aprobación", value: acceptReason, inline: false },
            { name: "⚡ Siguientes Pasos (Fase 2 - Entrevista Oral)", value: nextInstructions, inline: false }
          ],
          footer: {
            text: "ACCIÓN X RP • Plataforma de Whitelist"
          }
        };
        sendDM(response.user_id, dmEmbed)
          .catch(e => console.error("Error sending DM in background:", e));

        // Update source embed message in Discord
        const sourceEmbed = payload.message.embeds[0];
        const updatedEmbeds = [
          {
            ...sourceEmbed,
            color: 1096185, // #10B981 (Green)
            fields: [
              ...sourceEmbed.fields,
              { name: "✅ Resultado", value: `Aprobada por ${staffTag}`, inline: false },
              { name: "💬 Motivo", value: acceptReason, inline: false }
            ]
          }
        ];

        return NextResponse.json({
          type: 7, // UPDATE_MESSAGE
          data: {
            embeds: updatedEmbeds,
            components: [] // Removes the action buttons
          }
        });
      }

      if (customId.startsWith("phase1_reject_modal_")) {
        const responseId = customId.split("_").pop();
        const rejectReason = payload.data.components[0].components[0].value || "No especificado";
        const attemptsLimitInput = payload.data.components[1].components[0].value || "2";
        const dailyLimitVal = parseInt(attemptsLimitInput) || 2;

        const response = await db.get("SELECT * FROM responses WHERE id = ?", [responseId]);
        if (!response) {
          return NextResponse.json({
            type: 4,
            data: { content: "❌ Error: No se encontró la solicitud en la base de datos.", flags: 64 }
          });
        }

        // Update response status to rejected
        await db.run("UPDATE responses SET status = 'Rechazada' WHERE id = ?", [responseId]);

        // Update user custom daily attempts limit
        await db.run(`
          INSERT INTO phase1_progress (user_id, daily_attempts_limit)
          VALUES (?, ?)
          ON CONFLICT(user_id) DO UPDATE SET daily_attempts_limit = excluded.daily_attempts_limit
        `, [response.user_id, dailyLimitVal]);

        // Create notification for the user
        const notificationMsg = `Tu solicitud de Whitelist ha sido Rechazada por ${staffTag}. Motivo: ${rejectReason}. Intentos diarios permitidos restablecidos a: ${dailyLimitVal}.`;
        await db.run("INSERT INTO notifications (user_id, message, created_at) VALUES (?, ?, ?)", [
          response.user_id,
          notificationMsg,
          new Date().toLocaleString()
        ]);

        // Send premium embedded direct message (ejecutar en segundo plano)
        const dmEmbed = {
          title: "❌ WHITELIST RECHAZADA - ACCIÓN X RP ❌",
          description: `Hola <@${response.user_id}>, lamento informarte que tu solicitud de Whitelist ha sido rechazada tras la revisión de tus respuestas.`,
          color: 15668036, // #EF4444 (Crimson Red)
          fields: [
            { name: "🚫 Estado", value: "RECHAZADA", inline: true },
            { name: "👤 Revisor/Staff", value: staffTag, inline: true },
            { name: "📝 Motivo del Rechazo", value: rejectReason, inline: false },
            { name: "⚙️ Intentos Permitidos por Día", value: `${dailyLimitVal} intentos`, inline: false },
            { name: "💡 Recomendación", value: "Te sugerimos revisar las normativas del servidor en el dashboard antes de volver a realizar el cuestionario.", inline: false }
          ],
          footer: {
            text: "ACCIÓN X RP • Plataforma de Whitelist"
          }
        };
        sendDM(response.user_id, dmEmbed)
          .catch(e => console.error("Error sending DM in background:", e));

        // Update source embed message in Discord
        const sourceEmbed = payload.message.embeds[0];
        const updatedEmbeds = [
          {
            ...sourceEmbed,
            color: 15668036, // #EF4444 (Red)
            fields: [
              ...sourceEmbed.fields,
              { name: "❌ Resultado", value: `Rechazada por ${staffTag}`, inline: false },
              { name: "📝 Motivo", value: rejectReason, inline: false },
              { name: "⚙️ Limite de Intentos Diarios", value: `${dailyLimitVal}`, inline: true }
            ]
          }
        ];

        return NextResponse.json({
          type: 7, // UPDATE_MESSAGE
          data: {
            embeds: updatedEmbeds,
            components: [] // Removes the action buttons
          }
        });
      }
    }

    return new NextResponse("Unhandled request type", { status: 400 });
  } catch (err: any) {
    logDebug("CRITICAL WEBHOOK ERROR:", { name: err.name, message: err.message, stack: err.stack });
    console.error("CRITICAL ERROR in discord-interactions webhook:", err);
    return new NextResponse(`Internal Server Error: ${err.message}`, { status: 500 });
  }
}
