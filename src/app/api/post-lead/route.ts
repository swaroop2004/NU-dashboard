import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// -----------------------
// CREATE LEAD (POST)
// -----------------------
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Check Auth (Session or API Key)
    const apiKey = req.headers.get("x-api-key");
    const validApiKey = process.env.API_KEY;
    const isApiRequest = apiKey && validApiKey && apiKey === validApiKey;

    if (!isApiRequest) {
      const session = await auth.api.getSession({
        headers: await headers()
      });
      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const {
      name,
      email,
      city,
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
      propertiesViewed,
    } = body;

    if (!name) {
      return NextResponse.json({ error: "Lead name is required" }, { status: 400 });
    }

    // Validate assigned user
    let validAssignedUser = null;
    if (assignedToId) {
      validAssignedUser = await prisma.user.findUnique({
        where: { id: assignedToId },
      });

      if (!validAssignedUser) {
        return NextResponse.json(
          { error: "Assigned user not found" },
          { status: 400 }
        );
      }
    }

    // Create lead
    const newLead = await prisma.lead.create({
      data: {
        name,
        email,
        city,
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
          ? { connect: propertiesViewed.map((id: string) => ({ id })) }
          : undefined,
      },
      include: {
        assignedTo: true,
        propertiesViewed: true,
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

// -----------------------
// UPDATE LEAD (PUT / PATCH)
// -----------------------
export async function PUT(req: Request) {
  return handleUpdate(req, true); // full replace
}

export async function PATCH(req: Request) {
  return handleUpdate(req, false); // partial update
}

// -----------------------
// SHARED UPDATE HANDLER
// -----------------------
async function handleUpdate(req: Request, isFullReplace: boolean) {
  try {
    const url = new URL(req.url);
    const leadId = url.searchParams.get("id");

    if (!leadId) {
      return NextResponse.json({ error: "Lead ID is required" }, { status: 400 });
    }

    const existingLead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!existingLead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    const body = await req.json();

    // If PUT → overwrite all fields, require name
    if (isFullReplace && !body.name) {
      return NextResponse.json(
        { error: "Name is required for full update (PUT)" },
        { status: 400 }
      );
    }

    const {
      name,
      email,
      city,
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
      propertiesViewed,
    } = body;

    // Validate assigned user
    let validAssignedUser = null;
    if (assignedToId) {
      validAssignedUser = await prisma.user.findUnique({
        where: { id: assignedToId },
      });

      if (!validAssignedUser) {
        return NextResponse.json(
          { error: "Assigned user not found" },
          { status: 400 }
        );
      }
    }

    const updateData: any = isFullReplace
      ? {
        name,
        email,
        city,
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
          ? { set: propertiesViewed.map((id: string) => ({ id })) }
          : undefined,
      }
      : {
        ...(name && { name }),
        ...(email && { email }),
        ...(city && { city }),
        ...(phoneNumber && { phoneNumber }),
        ...(companyName && { companyName }),
        ...(companySize && { companySize }),
        ...(companyIndustry && { companyIndustry }),
        ...(jobRole && { jobRole }),
        ...(preferences && { preferences }),
        ...(source && { source }),
        ...(status && { status }),
        ...(visitStatus && { visitStatus }),
        ...(assignedToId && validAssignedUser && { assignedToId: validAssignedUser.id }),
        ...(propertiesViewed && {
          propertiesViewed: { set: propertiesViewed.map((id: string) => ({ id })) },
        }),
      };

    const updatedLead = await prisma.lead.update({
      where: { id: leadId },
      data: updateData,
      include: {
        assignedTo: true,
        propertiesViewed: true,
      },
    });

    return NextResponse.json(updatedLead, { status: 200 });
  } catch (error: any) {
    console.error("Error updating lead:", error);
    return NextResponse.json(
      { error: "Failed to update lead", details: error.message },
      { status: 500 }
    );
  }
}
