import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(req: Request) {
  try {
    const apiKey = req.headers.get("x-api-key");
    const validApiKey = process.env.API_KEY;
    const isApiRequest = apiKey && validApiKey && apiKey === validApiKey;

    let userEmail: string | undefined;

    if (isApiRequest) {
      const { searchParams } = new URL(req.url);
      userEmail = searchParams.get("email") || undefined;

      // If no email provided via API Key, return ALL users
      if (!userEmail) {
        const allUsers = await prisma.user.findMany({
          include: {
            leadsAssigned: true,
          },
        });
        return NextResponse.json(allUsers);
      }
    } else {
      const session = await auth.api.getSession({
        headers: await headers()
      });

      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      userEmail = session.user.email;
    }

    const user = await prisma.user.findUnique({
      where: {
        email: userEmail,
      },
      include: {
        leadsAssigned: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}
