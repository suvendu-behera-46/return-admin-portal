// pages/api/login.js
import prisma from "@/server/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req, res) {
  if (req.method !== "POST") {
    return NextResponse.error("Method Not Allowed", { status: 405 });
  }

  try {
    const { email, password } = await req.json();

    // Find the team member by email
    const teamMember = await prisma.teamMember.findUnique({
      where: {
        email,
      },
    });

    // If no team member found or incorrect password, return error
    if (!teamMember || !(await bcrypt.compare(password, teamMember.password))) {
      return NextResponse.error("Invalid email or password", { status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: teamMember.id,
        userEmail: teamMember.email,
        userRole: teamMember.userRole,
      },
      JWT_SECRET,
      { expiresIn: "1h" } // Token expires in 1 hour, adjust as needed
    );

    return NextResponse.json({ token });
  } catch (error) {
    console.error(error);
    return NextResponse.error("Internal Server Error", { status: 500 });
  }
}
