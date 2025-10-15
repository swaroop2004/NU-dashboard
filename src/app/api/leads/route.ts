import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      include: {
        assignedTo: true,          // sales rep
        propertiesViewed: true,    // related properties
      },
    });
    return NextResponse.json(leads);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
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
      assignedToId,
      propertyIds,
    } = data;

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
        assignedToId,
        propertiesViewed: propertyIds
          ? { connect: propertyIds.map((id: string) => ({ id })) }
          : undefined,
      },
      include: {
        assignedTo: true,
        propertiesViewed: true,
      },
    });

    return NextResponse.json(newLead);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
  }
}
