import prisma from "@/server/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

const saltRounds = 10; // Number of salt rounds for bcrypt hashing

export async function GET(req, res) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const parsedOffset = parseInt(searchParams.get("offset")) || 0; // Default to 0 if not provided
    const parsedLimit = parseInt(searchParams.get("limit")) || 10; // Default to limit 10 if not provided

    const teamMembers = await prisma.teamMember.findMany({
      include: {
        shop: true, // Include associated Shop details
      },
      skip: parsedOffset,
      take: parsedLimit,
    });
    console.log(teamMembers);
    return NextResponse.json(teamMembers);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error getting members", success: false },
      { status: 500 }
    );
  }
}

export async function POST(req, res) {
  try {
    const reqBody = await req.json();
    const {
      firstName,
      lastName,
      email,
      userRole,
      shopID,
      password,
      shopUserID,
    } = reqBody;

    if (!shopID) {
      return NextResponse.json(
        {
          error: "Shop ID is required",
          success: false,
        },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Check if the provided shopID exists
    const shopExists = await prisma.shop.findUnique({
      where: {
        id: shopID,
      },
    });

    if (!shopExists) {
      return NextResponse.json(
        {
          error: "Shop with the provided ID does not exist",
          success: false,
        },
        { status: 404 }
      );
    }

    // Create a new TeamMember record and associate it with the specified Shop
    const newTeamMember = await prisma.teamMember.create({
      data: {
        firstName,
        lastName,
        email,
        userRole,
        password: hashedPassword, // Store the hashed password
        shopUserID,
        shop: {
          connect: { id: shopID }, // Connect to the specified Shop
        },
      },
    });

    return NextResponse.json(newTeamMember, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error creating team member", success: false },
      { status: 500 }
    );
  }
}

export async function PUT(req, res) {
  try {
    const reqBody = await req.json();
    const { id, userRole } = reqBody;

    // Update the userRole of the specified TeamMember
    const updatedTeamMember = await prisma.teamMember.update({
      where: {
        id,
      },
      data: {
        userRole,
      },
    });

    return NextResponse.json(updatedTeamMember);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error updating team member", success: false },
      { status: 500 }
    );
  }
}
