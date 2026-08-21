import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const forms = db.prepare("SELECT * FROM forms ORDER BY id DESC").all();
    const parsedForms = forms.map((f: any) => ({
      ...f,
      questions: JSON.parse(f.questions),
    }));
    return NextResponse.json(parsedForms);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title, description, questions } = await req.json();
    if (!title || !questions) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const stmt = db.prepare("INSERT INTO forms (title, description, questions) VALUES (?, ?, ?)");
    const info = stmt.run(title, description || "", JSON.stringify(questions));
    return NextResponse.json({ id: info.lastInsertRowid, title, description, questions });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, title, description, questions } = await req.json();
    if (!id || !title || !questions) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    db.prepare("UPDATE forms SET title = ?, description = ?, questions = ? WHERE id = ?")
      .run(title, description || "", JSON.stringify(questions), id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    db.prepare("DELETE FROM forms WHERE id = ?").run(id);
    db.prepare("DELETE FROM responses WHERE form_id = ?").run(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
