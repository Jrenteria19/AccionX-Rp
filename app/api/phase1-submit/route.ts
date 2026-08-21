import { NextResponse } from "next/server";
import db from "@/lib/db";

// Static questions database helper with all options for formatting complete responses
const phase1QuestionsList = [
  {
    id: 1,
    question: "¿Qué significan las siglas IC (In Character)?",
    options: {
      A: "Fuera del personaje, todo lo relacionado con el jugador real.",
      B: "Dentro del personaje, todas las acciones y diálogos del personaje en el juego.",
      C: "Información confidencial del servidor.",
      D: "Acciones ilegales que realiza una banda."
    }
  },
  {
    id: 2,
    question: "¿Qué significan las siglas OOC (Out Of Character)?",
    options: {
      A: "Dentro del personaje.",
      B: "Organización Oficial Criminal.",
      C: "Fuera del personaje, todo lo que pertenece a la vida real del jugador.",
      D: "Operación Oficial de la Policía."
    }
  },
  {
    id: 3,
    question: "¿Qué es el Metagaming (MG)?",
    options: {
      A: "El uso de información obtenida fuera del personaje (OOC) para beneficio dentro del personaje (IC).",
      B: "Hacer cosas imposibles que no podrías realizar en la vida real.",
      C: "Matar a otro jugador sin ningún motivo de rol.",
      D: "Utilizar el chat de voz para comunicarte con tus amigos de juego."
    }
  },
  {
    id: 4,
    question: "¿Qué es el Powergaming (PG)?",
    options: {
      A: "Insultar a los administradores en el foro.",
      B: "Realizar acciones que sobrepasan los límites de la física o la lógica humana, o forzar el rol a tu favor sin dar opción al otro.",
      C: "Tener un nivel alto o muchos vehículos en el servidor.",
      D: "Organizar un tiroteo masivo contra la policía."
    }
  },
  {
    id: 5,
    question: "¿Qué es el Deathmatch (DM)?",
    options: {
      A: "Participar en una carrera de coches.",
      B: "Agredir o asesinar a otro personaje sin una justificación de rol previa o válida.",
      C: "Morir debido a un accidente de tráfico.",
      D: "El proceso de resurrección del personaje en el hospital."
    }
  },
  {
    id: 6,
    question: "¿Qué es el Revenge Kill (RK)?",
    options: {
      A: "Matar a alguien para defender a un miembro de tu banda.",
      B: "Vengarte de la policía después de una persecución exitosa.",
      C: "Regresar al lugar de tu muerte para asesinar al jugador que te mató, olvidando que tu personaje no recuerda quién lo mató.",
      D: "Robar el coche de la persona que te agredió previamente."
    }
  },
  {
    id: 7,
    question: "¿Qué diferencia hay entre PK (Player Kill) y CK (Character Kill)?",
    options: {
      A: "PK es la muerte temporal y pérdida de memoria reciente; CK es la muerte definitiva del personaje y borrado del mismo.",
      B: "PK es cuando te mata la policía; CK es cuando te matan los paramédicos.",
      C: "PK es el borrado definitivo; CK es la pérdida de memoria.",
      D: "No existe ninguna diferencia, significan lo mismo en el juego."
    }
  },
  {
    id: 8,
    question: "Si cambias tu nombre de usuario en el servidor de MTA, ¿qué debes hacer en Discord?",
    options: {
      A: "Nada, son plataformas diferentes.",
      B: "Actualizar tu apodo en Discord para que coincida exactamente con el de MTA.",
      C: "Crear una nueva cuenta de Discord.",
      D: "Pedirle a un administrador que juegue por ti."
    }
  },
  {
    id: 9,
    question: "¿Cuál es la sanción por aprovecharse de un bug o glitch del servidor para beneficio propio?",
    options: {
      A: "Una advertencia verbal.",
      B: "Multa de dinero del juego.",
      C: "Expulsión permanente del servidor.",
      D: "No hay sanción si el bug no es grave."
    }
  },
  {
    id: 10,
    question: "¿Qué resolución de pantalla está prohibido utilizar según las reglas?",
    options: {
      A: "Resoluciones panorámicas (16:9).",
      B: "Resoluciones de alta definición (4K).",
      C: "Resoluciones estiradas (4:3 o 5:4) para obtener ventaja en el disparo.",
      D: "Cualquier resolución menor a 720p."
    }
  },
  {
    id: 11,
    question: "¿Qué es el Car Jacking (CJ)?",
    options: {
      A: "Reparar un coche con herramientas.",
      B: "Robar un vehículo sacando al conductor sin ningún tipo de rol o animación previa.",
      C: "Chocar intencionadamente un coche contra otro.",
      D: "Tunear los coches en el taller oficial."
    }
  },
  {
    id: 12,
    question: "¿Qué es el Vehicle Deathmatch (VDM)?",
    options: {
      A: "Hacer carreras ilegales en zonas públicas.",
      B: "Atropellar o usar un vehículo como arma para dañar o matar a otros jugadores sin justificación de rol.",
      C: "Destruir tu propio coche para cobrar el seguro.",
      D: "Chocar contra una patrulla policial durante una persecución."
    }
  },
  {
    id: 13,
    question: "¿Qué es el Bunny Hopping (BH)?",
    options: {
      A: "Saltar repetidamente mientras corres para avanzar más rápido, lo cual está prohibido.",
      B: "Escapar de la policía nadando por los canales.",
      C: "Saltar con una bicicleta BMX por encima de las casas.",
      D: "Entrar a una propiedad privada sin permiso."
    }
  },
  {
    id: 14,
    question: "¿Qué es la Valoración de Vida (NRE)?",
    options: {
      A: "Tener siempre tu salud al 100% usando botiquines.",
      B: "Comportarte de manera coherente valorando la vida de tu personaje frente a amenazas extremas (armas, caídas, secuestros).",
      C: "Evitar ir a hospitales para no gastar dinero.",
      D: "Hacer deportes extremos en el juego constantemente."
    }
  },
  {
    id: 15,
    question: "Si te apuntan con 3 armas de fuego y estás desarmado, ¿cuál es la acción correcta?",
    options: {
      A: "Sacar tu arma rápidamente y dispararles a todos.",
      B: "Correr en zig-zag para evitar las balas.",
      C: "Rendir al personaje, levantar las manos e interpretar el miedo correspondiente valorando tu vida.",
      D: "Desconectarse del juego inmediatamente para evitar que te roben."
    }
  },
  {
    id: 16,
    question: "¿Qué se debe hacer si eres testigo de una infracción de normas por parte de otro jugador?",
    options: {
      A: "Romper tú también las reglas para vengarte.",
      B: "Seguir el rol en el momento y, una vez finalizado, abrir un reporte con tus pruebas gráficas.",
      C: "Insultar al jugador por el chat OOC y negarte a rolear.",
      D: "Spamear comandos de ayuda para llamar la atención del staff."
    }
  },
  {
    id: 17,
    question: "¿Cuál es el máximo de integrantes permitidos en un asalto/robo común a civiles?",
    options: {
      A: "No hay límite, pueden ir todos los que quieran.",
      B: "Máximo 4 delincuentes.",
      C: "Máximo 2 delincuentes por víctima.",
      D: "Solo se permite robar en solitario."
    }
  },
  {
    id: 18,
    question: "¿Se permite conducir un vehículo deportivo a máxima velocidad por zonas montañosas o desiertos de arena sin caminos?",
    options: {
      A: "Sí, si el coche tiene tracción en las cuatro ruedas.",
      B: "Sí, es GTA San Andreas y se puede hacer.",
      C: "No, se considera PG (Powergaming) ya que un deportivo no está diseñado ni tiene la altura para ese entorno.",
      D: "Solo si te está persiguiendo la policía."
    }
  },
  {
    id: 19,
    question: "¿Qué es el Character Kill Administrativo (CK Policial/Faccionario)?",
    options: {
      A: "Un baneo de tu cuenta de Discord.",
      B: "El despido y muerte definitiva de tu personaje dentro de una facción de gobierno o policía al cometer delitos graves o corrupción.",
      C: "Cuando el servidor se cae por problemas técnicos.",
      D: "Cuando un administrador te cambia el nombre de forma aleatoria."
    }
  },
  {
    id: 20,
    question: "¿Qué es el No Rol de Entorno (NRE)?",
    options: {
      A: "Ignorar que el juego está ambientado en una ciudad activa con civiles, cámaras, testigos y tráfico constante, actuando como si estuvieras solo.",
      B: "No tener mapas descargados en el MTA.",
      C: "No hablar con los NPC del juego.",
      D: "No utilizar vehículos para moverte."
    }
  },
  {
    id: 21,
    question: "¿Se puede cometer un atraco o secuestro en la puerta de la comisaría principal de policía?",
    options: {
      A: "Sí, si no hay patrullas cerca.",
      B: "No, las zonas gubernamentales y policiales son Zonas Seguras debido a la presencia masiva implícita de fuerzas del orden (NRE).",
      C: "Sí, siempre que se use silenciador.",
      D: "Solo si el botín es de alto valor."
    }
  },
  {
    id: 22,
    question: "¿Qué canal se utiliza para hablar de cosas fuera del juego (OOC)?",
    options: {
      A: "El chat general sin comandos.",
      B: "El canal de voz de proximidad.",
      C: "El chat OOC local (/b) o el comando correspondiente.",
      D: "El comando de entorno (/me)."
    }
  },
  {
    id: 23,
    question: "¿Para qué sirve el comando /me?",
    options: {
      A: "Para mandar un mensaje privado a otro usuario.",
      B: "Para describir acciones físicas, gestos o movimientos de tu personaje que no se ven visualmente.",
      C: "Para reportar a un hacker al staff.",
      D: "Para gritar muy fuerte dentro del juego."
    }
  },
  {
    id: 24,
    question: "¿Para qué sirve el comando /do?",
    options: {
      A: "Para describir el entorno, objetos, el estado físico de tu personaje o hacer preguntas lógicas sobre la situación a otros.",
      B: "Para cometer delitos de manera automática.",
      C: "Para hablar por la radio de la policía.",
      D: "Para iniciar el motor de tu coche."
    }
  },
  {
    id: 25,
    question: "Si chocas tu coche a 150 km/h contra un muro de hormigón, ¿qué debes hacer?",
    options: {
      A: "Dar marcha atrás y seguir conduciendo de inmediato.",
      B: "Bajar del vehículo y correr antes de que explote.",
      C: "Detener el vehículo y rolear el choque y las heridas mediante /me y /do antes de realizar cualquier otra acción.",
      D: "Desconectarse del juego para que el coche no sufra daños."
    }
  },
  {
    id: 26,
    question: "¿Qué es el Spam en el chat?",
    options: {
      A: "Escribir palabras en inglés dentro de la radio.",
      B: "Repetir el mismo mensaje o línea de texto de forma constante, entorpeciendo la lectura del chat.",
      C: "Hablar de temas políticos de tu país.",
      D: "Tener mala ortografía al escribir."
    }
  },
  {
    id: 27,
    question: "¿Qué es el Toxic Behavior (Conducta Tóxica)?",
    options: {
      A: "Hacer roles de envenenamiento o drogas.",
      B: "Faltar al respeto, insultar, acosar o menospreciar a otros miembros de la comunidad tanto IC como OOC.",
      C: "Usar skins de pandilleros.",
      D: "Cometer muchos delitos seguidos."
    }
  },
  {
    id: 28,
    question: "¿Qué es el Car Flipping (volcar el coche)?",
    options: {
      A: "Reparar un coche con el capó abierto.",
      B: "Volcar tu coche de lado o boca abajo y seguir conduciendo mediante comandos de administración o abusando de la física del juego sin rolear el accidente.",
      C: "Pintar el coche de dos colores diferentes.",
      D: "Vender el coche a un desguace."
    }
  },
  {
    id: 29,
    question: "¿Qué es el Player Kill Total (PKT)?",
    options: {
      A: "La muerte definitiva del personaje.",
      B: "Una pérdida completa de memoria sobre una facción o grupo de personas, obligándote a desvincularte por completo de ellos.",
      C: "Cuando te matan todos los jugadores de un grupo.",
      D: "Cuando mueres por falta de comida o agua."
    }
  },
  {
    id: 30,
    question: "Si dejas de jugar por unos meses y abandonas el Discord oficial de ACCIÓN X RP, ¿qué sucede con tu Whitelist?",
    options: {
      A: "Se mantiene intacta y puedes entrar cuando quieras.",
      B: "Debes volver a hacer el proceso de Whitelist desde cero (incluyendo historia y entrevista).",
      C: "Tu cuenta es eliminada y baneada permanentemente.",
      D: "Se te cobra una multa en dinero del juego."
    }
  }
];

function formatAnswersForEmbedRange(answers: Record<number, string>, startIdx: number, endIdx: number) {
  let text = "";
  for (const q of phase1QuestionsList) {
    if (q.id >= startIdx && q.id <= endIdx) {
      const ansKey = (answers[q.id] || "A") as "A" | "B" | "C" | "D";
      const fullAnswerText = q.options[ansKey] || "No respondida";
      text += `**${q.id}.** ${q.question.substring(0, 45)}...\n↳ *Respuesta:* **${ansKey} - ${fullAnswerText}**\n\n`;
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

    const submittedAt = new Date().toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric"
    }) + " " + new Date().toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit"
    });

    // 1. Insertar la respuesta de la Fase 1 en la base de datos (SQLite)
    const stmt = db.prepare(`
      INSERT INTO responses (form_id, user_id, username, avatar, answers, status, submitted_at)
      VALUES (?, ?, ?, ?, ?, 'Pendiente', ?)
    `);

    const info = stmt.run(
      999999, // Especial form_id para Whitelist Fase 1
      userId,
      username,
      avatar || "",
      JSON.stringify(answers),
      submittedAt
    );

    const responseId = info.lastInsertRowid;

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
            description: "Un nuevo usuario ha enviado sus respuestas para la Whitelist Fase 1.",
            color: 16514852, // #FBBF24 (Yellow/Amber)
            thumbnail: {
              url: avatarUrl
            },
            fields: [
              { name: "👤 Usuario de Discord", value: `<@${userId}> (${username})`, inline: true },
              { name: "📅 Fecha de Envío", value: submittedAt, inline: true },
              { name: "📝 Respuestas (Preguntas 1-5)", value: formatAnswersForEmbedRange(answers, 1, 5), inline: false },
              { name: "📝 Respuestas (Preguntas 6-10)", value: formatAnswersForEmbedRange(answers, 6, 10), inline: false },
              { name: "📝 Respuestas (Preguntas 11-15)", value: formatAnswersForEmbedRange(answers, 11, 15), inline: false },
              { name: "📝 Respuestas (Preguntas 16-20)", value: formatAnswersForEmbedRange(answers, 16, 20), inline: false },
              { name: "📝 Respuestas (Preguntas 21-25)", value: formatAnswersForEmbedRange(answers, 21, 25), inline: false },
              { name: "📝 Respuestas (Preguntas 26-30)", value: formatAnswersForEmbedRange(answers, 26, 30), inline: false }
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
