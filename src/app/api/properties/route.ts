import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const properties = await prisma.property.findMany({
      include: {
        leads: true, // show which leads viewed/interacted with property
      },
    });
    return NextResponse.json(properties);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch properties" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const {
      name,
      type,
      price,
      status,
      location,
      description,
      amenities,
      tokens,
      leadIds,
    } = data;

    const newProperty = await prisma.property.create({
      data: {
        name,
        type,
        price,
        status,
        location,
        description,
        amenities,
        tokens,
        leads: leadIds
          ? { connect: leadIds.map((id: string) => ({ id })) }
          : undefined,
      },
      include: { leads: true },
    });

    return NextResponse.json(newProperty);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create property" }, { status: 500 });
  }
}
