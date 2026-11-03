import { NextResponse } from "next/server";
import pool from "@/lib/db";

// GET API - Fetch users
export async function GET() {
  try {
    const result = await pool.query(
      "SELECT * FROM users ORDER BY id DESC"
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Database error" },
      { status: 500 }
    );
  }
}

// POST API - Insert user
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, email } = body;

    if (!name || !email) {
      return NextResponse.json(
        { message: "Name and email are required" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO users (name, email)
       VALUES ($1, $2)
       RETURNING *`,
      [name, email]
    );

    return NextResponse.json(result.rows[0], {
      status: 201,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Unable to create user" },
      { status: 500 }
    );
  }
}