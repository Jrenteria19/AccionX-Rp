import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const forms = await db.all("SELECT * FROM forms ORDER BY id DESC");
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
    const info = await db.run(
      "INSERT INTO forms (title, description, questions) VALUES (?, ?, ?)",
      [title, description || "", JSON.stringify(questions)]
    );
    return NextResponse.json({ id: Number(info.lastInsertRowid), title, description, questions });
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
    await db.run(
      "UPDATE forms SET title = ?, description = ?, questions = ? WHERE id = ?",
      [title, description || "", JSON.stringify(questions), id]
    );
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    await db.run("DELETE FROM forms WHERE id = ?", [id]);
    await db.run("DELETE FROM responses WHERE form_id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
