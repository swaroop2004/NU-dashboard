import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/post-lead
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      name,
      email,
      phoneNumber,
      companyName,
      companySize,
      companyIndustry,
      jobRole,
      preferences,
      source,
      status,
      visitStatus,
      assignedToId,
      propertiesViewed, // array of property IDs (optional
    } = body;

    // ✅ Basic validation
    if (!name) {
      return NextResponse.json({ error: "Lead name is required" }, { status: 400 });
    }

    // ✅ If assignedToId is provided, verify it exists
    let validAssignedUser = null;
    if (assignedToId) {
      validAssignedUser = await prisma.userProfile.findUnique({
        where: { id: assignedToId },
      });

      if (!validAssignedUser) {
        return NextResponse.json(
          { error: "Assigned user not found" },
          { status: 400 }
        );
      }
    }

    // ✅ Create the Lead
    const newLead = await prisma.lead.create({
      data: {
        name,
        email,
        phoneNumber,
        companyName,
        companySize,
        companyIndustry,
        jobRole,
        preferences,
        source,
        status,
        visitStatus,
        assignedToId: validAssignedUser ? validAssignedUser.id : null,
        propertiesViewed: propertiesViewed
          ? {
              connect: propertiesViewed.map((id: string) => ({ id })),
            }
          : undefined,
      },
      include: {
        assignedTo: true, // optional — return assigned user info
        propertiesViewed: true, // optional — return linked properties
      },
    });

    return NextResponse.json(newLead, { status: 201 });
  } catch (error: any) {
    console.error("Error creating lead:", error);
    return NextResponse.json(
      { error: "Failed to create lead", details: error.message },
      { status: 500 }
    );
  }
}
