// pages/api/sendPasswordResetLink.js
import prisma from "@/server/prisma";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const BASE_URL = process.env.BASE_URL; // Base URL of your application

export async function POST(req, res) {
  try {
    console.log(SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, BASE_URL);
    const { email } = await req.json();

    // Find the team member by email
    const teamMember = await prisma.teamMember.findUnique({
      where: {
        email,
      },
    });

    // If no team member found, return error
    if (!teamMember) {
      return NextResponse.json(
        { message: "No user found with this email" },
        {
          status: 404,
        }
      );
    }

    // Generate unique token for password reset
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Token expires in 1 hour, adjust as needed

    // Update the team member record with the reset token and expiration time
    await prisma.teamMember.update({
      where: {
        id: teamMember.id,
      },
      data: {
        resetToken: token,
        resetTokenExpiresAt: expiresAt,
      },
    });

    // Create password reset URL
    const resetLink = `${BASE_URL}/reset-password?token=${token}`;

    // Create SMTP transporter
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: false, // Use SSL
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
    console.log(transporter);
    // Send password reset email
    await transporter.sendMail({
      from: "no-reply@yoctotta.com",
      to: email,
      subject: "Password Reset Request",
      text: `You have requested to reset your password. Click on the following link to reset your password: ${resetLink}`,
      html: `<p>You have requested to reset your password. Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    });

    return NextResponse.json(
      {
        message: "Password reset link sent to your email",
        resetLink,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: error,
      },
      { status: 200 }
    );
  }
}
