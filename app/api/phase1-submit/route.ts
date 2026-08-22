import { NextResponse } from "next/server";
import db from "@/lib/db";

// Static questions database helper with all open-ended questions
const phase1QuestionsList = [
  { id: 1, question: "NOMBRE (REAL)" },
  { id: 2, question: "EDAD (REAL)" },
  { id: 3, question: "¿Qué es el OOC y para qué se utiliza?" },
  { id: 4, question: "Si eres miembro de una organización y secuestran a tu compañero, ¿puedes secuestrar a un compañero de la otra organización para igualar la situación? Antes de hacer cualquier acto o rol delictivo, ¿qué es lo primero que tienes que hacer?" },
  { id: 5, question: "Supongamos que una ganga te da el pare con el fin de robarte, a lo que 2 de los sujetos del coche de la ganga disparan a pincharte, te pinchan y provocan que te accidentes, después del accidente te dicen que te bajes pero tú omites lo que te piden y pasado 2 segundos te abaten dentro del vehículo. ¿Estaría bien lo sucedido? ¿Sí o no y por qué?" },
  { id: 6, question: "¿A qué le llamarías un mal uso del OOC?" },
  { id: 7, question: "¿Cuál sería la manera correcta en que deben actuar los delincuentes si quieren secuestrar a un policía para un robo?" },
  { id: 8, question: "Durante una persecución policial llegas a un garaje sin salida y decides desconectarte del server para evitar ser capturado. ¿Qué normativa se está violando?" },
  { id: 9, question: "Decides robar un vehículo frente a una estación de policía. ¿Qué normativa estás violando?" },
  { id: 10, question: "Si hago una animación y mi amigo que está al lado me pregunta cómo hago eso, ¿qué procedes a hacer?" },
  { id: 11, question: "¿Qué es el IC? Dame un buen ejemplo de cómo podemos usarlo correctamente" },
  { id: 12, question: "¿Qué es una Invasión de Rol?" },
  { id: 13, question: "¿Qué debes hacer si tu coche choca muy fuerte contra un muro dentro del juego?" },
  { id: 14, question: "¿Está permitido hablar de temas de la vida real por el micrófono de tu personaje?" },
  { id: 15, question: "Si alguien te apunta con una pistola, ¿puedes salir corriendo o debes valorar tu vida?" },
  { id: 16, question: "¿Qué debes hacer si ves a otro jugador haciendo trampas o rompiendo las reglas?" },
  { id: 17, question: "¿Para qué sirve el comando /me? Dame un ejemplo bien simple." },
  { id: 18, question: "¿Para qué sirve el comando /do? Dame un ejemplo bien simple." },
  { id: 19, question: "¿Puedes golpear o disparar a alguien sin tener un motivo o historia de rol?" },
  { id: 20, question: "Si estás jugando y tienes que irte de tu computadora urgente, ¿qué es lo correcto?" },
  { id: 21, question: "¿Puedes usar en el juego información que viste en un directo de Streamer?" },
  { id: 22, question: "¿Qué debes hacer si un oficial de policía te pide que te detengas y levantes las manos?" },
  { id: 23, question: "Si te roban todas tus cosas dentro del juego, ¿está permitido insultar al ladrón fuera de rol?" },
  { id: 24, question: "¿Por qué debemos tratar a todos los jugadores con respeto y educación en la comunidad?" },
  { id: 25, question: "¿Qué significa el entorno de la ciudad y por qué debemos respetarlo?" },
  { id: 26, question: "¿Se permite molestar o hacer ruidos molestos por el chat de voz del juego?" },
  { id: 27, question: "¿Qué debes hacer si tu personaje se cae de una altura y se lastima una pierna?" },
  { id: 28, question: "Si tienes una discusión con otro jugador, ¿dónde debes resolverla de forma madura?" },
  { id: 29, question: "¿Qué debes hacer si encuentras un truco o bug que te da dinero gratis en el servidor?" },
  { id: 30, question: "Si tu personaje sufre una muerte definitiva (CK), ¿qué debes hacer con su nombre e historia?" }
];

function formatAnswersForEmbedRange(answers: Record<number, string>, startIdx: number, endIdx: number) {
  let text = "";
  for (const q of phase1QuestionsList) {
    if (q.id >= startIdx && q.id <= endIdx) {
      const userAns = answers[q.id] || "No respondida";
      text += `**${q.id}. ${q.question}**\n↳ *Respuesta:* ${userAns}\n\n`;
    }
  }
  return text || "Sin respuestas";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, username, avatar, answers } = body;

    if (!userId || !username || !answers) {
      return NextResponse.json({ error: "Missing required submission fields" }, { status: 400 });
    }

    // Check if user already has an approved or pending Phase 1 submission
    const existing = await db.get(
      "SELECT id FROM responses WHERE user_id = ? AND form_id = 999999 AND (status = 'Aprobada' OR status = 'Pendiente')",
      [userId]
    );
    if (existing) {
      return NextResponse.json({ error: "Ya tienes una solicitud de Whitelist Fase 1 pendiente o aprobada." }, { status: 400 });
    }

    // Verify user has the required Discord role
    const guildId = process.env.DISCORD_GUILD_ID;
    const botToken = process.env.DISCORD_BOT_TOKEN;
    if (botToken && guildId) {
      try {
        const memberRes = await fetch(`https://discord.com/api/v10/guilds/${guildId}/members/${userId}`, {
          headers: {
            "Authorization": `Bot ${botToken}`
          }
        });
        if (memberRes.ok) {
          const memberData = await memberRes.json();
          const roles = memberData.roles as string[];
          if (!roles.includes("1302807933821915178")) {
            return NextResponse.json({ error: "No tienes el rol de Discord requerido para iniciar la Whitelist." }, { status: 403 });
          }
        } else {
          console.error("Failed to fetch member details from Discord API status:", memberRes.status);
        }
      } catch (e) {
        console.error("Error verifying member roles on backend:", e);
      }
    }

    const submittedAt = new Date().toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric"
    }) + " " + new Date().toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit"
    });

    // 1. Insertar la respuesta de la Fase 1 en la base de datos (SQLite)
    const info = await db.run(`
      INSERT INTO responses (form_id, user_id, username, avatar, answers, status, submitted_at)
      VALUES (?, ?, ?, ?, ?, 'Pendiente', ?)
    `, [
      999999, // Especial form_id para Whitelist Fase 1
      userId,
      username,
      avatar || "",
      JSON.stringify(answers),
      submittedAt
    ]);

    const responseId = Number(info.lastInsertRowid);

    // 2. Enviar el formulario a Discord (Embed amarillo "Pendiente" con botones)
    const token = process.env.DISCORD_BOT_TOKEN;
    const channelId = "1394521796769878077"; // Canal especificado por el usuario

    if (token) {
      const avatarUrl = avatar 
        ? `https://cdn.discordapp.com/avatars/${userId}/${avatar}.png`
        : "https://cdn.discordapp.com/embed/avatars/0.png";

      const embedPayload = {
        embeds: [
          {
            title: "📋 SOLICITUD DE WHITELIST - FASE 1",
            description: "Un nuevo usuario ha enviado sus respuestas para la Whitelist.",
            color: 16514852, // #FBBF24 (Yellow/Amber)
            thumbnail: {
              url: avatarUrl
            },
            fields: [
              { name: "👤 Usuario de Discord", value: `<@${userId}> (${username})`, inline: true },
              { name: "📅 Fecha de Envío", value: submittedAt, inline: true },
              { name: "📝 Respuestas (Preguntas 1-3)", value: formatAnswersForEmbedRange(answers, 1, 3), inline: false },
              { name: "📝 Respuestas (Preguntas 4-6)", value: formatAnswersForEmbedRange(answers, 4, 6), inline: false },
              { name: "📝 Respuestas (Preguntas 7-9)", value: formatAnswersForEmbedRange(answers, 7, 9), inline: false },
              { name: "📝 Respuestas (Preguntas 10-12)", value: formatAnswersForEmbedRange(answers, 10, 12), inline: false },
              { name: "📝 Respuestas (Preguntas 13-15)", value: formatAnswersForEmbedRange(answers, 13, 15), inline: false },
              { name: "📝 Respuestas (Preguntas 16-18)", value: formatAnswersForEmbedRange(answers, 16, 18), inline: false },
              { name: "📝 Respuestas (Preguntas 19-21)", value: formatAnswersForEmbedRange(answers, 19, 21), inline: false },
              { name: "📝 Respuestas (Preguntas 22-24)", value: formatAnswersForEmbedRange(answers, 22, 24), inline: false },
              { name: "📝 Respuestas (Preguntas 25-27)", value: formatAnswersForEmbedRange(answers, 25, 27), inline: false },
              { name: "📝 Respuestas (Preguntas 28-30)", value: formatAnswersForEmbedRange(answers, 28, 30), inline: false }
            ],
            footer: {
              text: `ACCIÓN X RP • ID de Solicitud: #${responseId}`
            }
          }
        ],
        components: [
          {
            type: 1, // Action Row
            components: [
              {
                type: 2, // Button
                style: 3, // SUCCESS (Green)
                label: "Aceptar Solicitud",
                custom_id: `phase1_accept_${responseId}`
              },
              {
                type: 2, // Button
                style: 4, // DANGER (Red)
                label: "Rechazar Solicitud",
                custom_id: `phase1_reject_${responseId}`
              }
            ]
          }
        ]
      };

      const discordRes = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
        method: "POST",
        headers: {
          "Authorization": `Bot ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(embedPayload),
      });

      if (!discordRes.ok) {
        const errorText = await discordRes.text();
        console.error("Failed to post message to Discord channel:", errorText);
        return NextResponse.json({ error: `Failed to post to Discord: ${errorText}` }, { status: 500 });
      }
    } else {
      console.error("DISCORD_BOT_TOKEN not configured");
      return NextResponse.json({ error: "DISCORD_BOT_TOKEN not configured" }, { status: 500 });
    }

    return NextResponse.json({ success: true, responseId });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
