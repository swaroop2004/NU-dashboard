import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    let whereClause = {};
    
    // Filter by status if provided
    if (status) {
      const statuses = status.split(',').map(s => s.toUpperCase());
      whereClause = {
        ...whereClause,
        status: {
          in: statuses
        }
      };
    }
    
    const leads = await prisma.lead.findMany({
      where: whereClause,
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

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: "Name is required and must be a non-empty string" }, { status: 400 });
    }

    if (!email || typeof email !== 'string' || email.trim().length === 0) {
      return NextResponse.json({ error: "Email is required and must be a non-empty string" }, { status: 400 });
    }

    if (!phoneNumber || typeof phoneNumber !== 'string' || phoneNumber.trim().length === 0) {
      return NextResponse.json({ error: "Phone number is required and must be a non-empty string" }, { status: 400 });
    }

    if (!source || typeof source !== 'string') {
      return NextResponse.json({ error: "Source is required and must be a string" }, { status: 400 });
    }

    if (!status || typeof status !== 'string') {
      return NextResponse.json({ error: "Status is required and must be a string" }, { status: 400 });
    }

    // Validate enum values (convert to uppercase for Prisma compatibility)
    const validSources = ['WEBSITE', 'REFERRAL', 'PROPERTY_PORTAL', 'OTHER'];
    const validStatuses = ['HOT', 'WARM', 'COLD'];
    
    // Convert source to uppercase for Prisma
    const sourceUpper = source.toUpperCase();
    const statusUpper = status.toUpperCase();
    
    if (!validSources.includes(sourceUpper)) {
      return NextResponse.json({ error: `Invalid source. Must be one of: ${validSources.join(', ')}` }, { status: 400 });
    }

    if (!validStatuses.includes(statusUpper)) {
      return NextResponse.json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` }, { status: 400 });
    }

    // Prepare data for creation
    const leadData: any = {
      name: name.trim(),
      email: email.trim(),
      phoneNumber: phoneNumber.trim(),
      companyName: companyName?.trim() || undefined,
      companySize: companySize?.trim() || undefined,
      companyIndustry: companyIndustry?.trim() || undefined,
      jobRole: jobRole?.trim() || undefined,
      source: sourceUpper as any, // Cast to handle enum type
      status: statusUpper as any, // Cast to handle enum type
      assignedToId: assignedToId || undefined,
    };

    // Handle preferences - ensure it's valid JSON or undefined
    if (preferences !== undefined && preferences !== null) {
      if (typeof preferences === 'object') {
        leadData.preferences = preferences;
      } else if (typeof preferences === 'string') {
        try {
          leadData.preferences = JSON.parse(preferences);
        } catch (e) {
          return NextResponse.json({ error: "Invalid JSON format in preferences field" }, { status: 400 });
        }
      } else {
        return NextResponse.json({ error: "Preferences must be a valid JSON object or string" }, { status: 400 });
      }
    }

    // Handle property relationships
    if (propertyIds && Array.isArray(propertyIds) && propertyIds.length > 0) {
      leadData.propertiesViewed = {
        connect: propertyIds.map((id: string) => ({ id }))
      };
    }

    console.log('Creating lead with data:', leadData);

    const newLead = await prisma.lead.create({
      data: leadData,
      include: {
        assignedTo: true,
        propertiesViewed: true,
      },
    });

    console.log('Lead created successfully:', newLead);
    return NextResponse.json(newLead);
  } catch (error) {
    console.error('Error creating lead:', error);
    
    // Handle specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json({ error: "A lead with this email or phone number already exists" }, { status: 409 });
      }
      if (error.message.includes('Invalid')) {
        return NextResponse.json({ error: "Invalid data format: " + error.message }, { status: 400 });
      }
    }
    
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
  }
}
