import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    let rows;
    if (userId) {
      rows = db.prepare("SELECT * FROM notifications WHERE user_id = ? ORDER BY id DESC").all(userId);
    } else {
      rows = db.prepare("SELECT * FROM notifications ORDER BY id DESC").all();
    }

    return NextResponse.json(rows);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id, userId } = await req.json();
    if (id) {
      // Eliminar notificación individual
      db.prepare("DELETE FROM notifications WHERE id = ?").run(id);
    } else if (userId) {
      // Eliminar todas las notificaciones del usuario
      db.prepare("DELETE FROM notifications WHERE user_id = ?").run(userId);
    } else {
      return NextResponse.json({ error: "Missing id or userId" }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
