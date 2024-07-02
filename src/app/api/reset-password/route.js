// pages/api/resetPassword.js
import prisma from "@/server/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req, res) {
  try {
    const { resetToken, newPassword } = await req.json();

    // Find the team member by reset token and ensure it's not expired
    const teamMember = await prisma.teamMember.findFirst({
      where: {
        resetToken,
        resetTokenExpiresAt: {
          gte: new Date(), // Ensure token is not expired
        },
      },
    });

    // If no team member found or token expired, return error
    if (!teamMember) {
      return NextResponse.json(
        { message: "Invalid or expired reset token" },
        {
          status: 400,
        }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password for the team member
    await prisma.teamMember.update({
      where: {
        id: teamMember.id,
      },
      data: {
        password: hashedPassword,
        resetToken: null, // Clear the reset token after password reset
        resetTokenExpiresAt: null, // Clear the expiration time
      },
    });

    return NextResponse.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
