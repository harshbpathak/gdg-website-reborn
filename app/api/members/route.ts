import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { CommunityMember } from "@/app/types/member";

const DATA_FILE = path.join(process.cwd(), "app", "data", "members.json");

function readMembers(): CommunityMember[] {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeMembers(members: CommunityMember[]): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(members, null, 2), "utf-8");
}

// GET /api/members — returns { count: number }
export async function GET() {
  const members = readMembers();
  return NextResponse.json({ count: members.length });
}

// POST /api/members — adds a new member, returns { success: true, count: number }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, linkedin, github } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    const newMember: CommunityMember = {
      id: crypto.randomUUID(),
      name: name.trim(),
      linkedin: linkedin?.trim() || undefined,
      github: github?.trim() || undefined,
      joinedAt: new Date().toISOString(),
    };

    const members = readMembers();
    members.push(newMember);
    writeMembers(members);

    return NextResponse.json({ success: true, count: members.length });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
