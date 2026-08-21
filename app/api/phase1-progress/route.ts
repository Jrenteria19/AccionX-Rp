import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "Missing userId parameter" }, { status: 400 });
    }

    const row: any = db.prepare("SELECT * FROM phase1_progress WHERE user_id = ?").get(userId);
    if (!row) {
      return NextResponse.json({
        user_id: userId,
        is_completed: false,
        is_started: false,
        is_active: false,
        current_question_idx: 0,
        answers: {},
        started_at: "",
        abandoned_apps: [],
        is_phase2_completed: false
      });
    }

    return NextResponse.json({
      user_id: row.user_id,
      is_completed: row.is_completed === 1,
      is_started: row.is_started === 1,
      is_active: row.is_active === 1,
      current_question_idx: row.current_question_idx,
      answers: JSON.parse(row.answers || "{}"),
      started_at: row.started_at || "",
      abandoned_apps: JSON.parse(row.abandoned_apps || "[]"),
      is_phase2_completed: row.is_phase2_completed === 1
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      userId,
      isCompleted,
      isStarted,
      isActive,
      currentQuestionIdx,
      answers,
      startedAt,
      abandonedApps,
      isPhase2Completed
    } = body;

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const stmt = db.prepare(`
      INSERT INTO phase1_progress (user_id, is_completed, is_started, is_active, current_question_idx, answers, started_at, abandoned_apps, is_phase2_completed)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id) DO UPDATE SET
        is_completed=excluded.is_completed,
        is_started=excluded.is_started,
        is_active=excluded.is_active,
        current_question_idx=excluded.current_question_idx,
        answers=excluded.answers,
        started_at=excluded.started_at,
        abandoned_apps=excluded.abandoned_apps,
        is_phase2_completed=excluded.is_phase2_completed
    `);

    stmt.run(
      userId,
      isCompleted ? 1 : 0,
      isStarted ? 1 : 0,
      isActive ? 1 : 0,
      currentQuestionIdx || 0,
      JSON.stringify(answers || {}),
      startedAt || "",
      JSON.stringify(abandonedApps || []),
      isPhase2Completed ? 1 : 0
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
