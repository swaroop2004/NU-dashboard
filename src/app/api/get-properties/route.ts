import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// ✅ GET /api/properties
// Returns all properties (optionally filtered by status or type)
export async function GET(req: Request) {
  try {
    // Check API Key
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

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status"); // e.g. ACTIVE, SOLD_OUT
    const type = searchParams.get("type");     // e.g. APARTMENT, STUDIO

    // Build dynamic filter object
    const filters: any = {};
    if (status) filters.status = status;
    if (type) filters.type = type;

    // Fetch all properties (with optional filters)
    const properties = await prisma.property.findMany({
      where: filters,
      include: {
        leads: {
          select: {
            id: true,
            name: true,
            email: true,
            status: true,
            assignedTo: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(properties, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching properties:", error);
    return NextResponse.json(
      { error: "Failed to fetch properties", details: error.message },
      { status: 500 }
    );
  }
}
