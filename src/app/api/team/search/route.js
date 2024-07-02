// Import necessary modules and dependencies
import prisma from "@/server/prisma";
import { NextResponse } from "next/server";

// Define the search API endpoint handler function
export async function POST(req, res) {
  try {
    // Retrieve search criteria from query parameters
    const { firstName, lastName, email, userRole } = await req.json();

    // Construct filter object based on provided search criteria
    const filter = {
      ...(firstName && { firstName: { contains: firstName } }),
      ...(lastName && { lastName: { contains: lastName } }),
      ...(email && { email: { contains: email } }),
      ...(userRole && { userRole: { contains: userRole } }),
    };

    // Fetch team members matching the filter criteria
    const teamMembers = await prisma.TeamMember.findMany({
      where: filter,
      include: {
        merchant: true,
      },
    });

    // Return the filtered list of team members
    return NextResponse.json(teamMembers);
  } catch (error) {
    console.error(error);
    // Return error response if an error occurs
    return NextResponse.json(
      { error: "Error searching team members", success: false },
      { status: 500 }
    );
  }
}
