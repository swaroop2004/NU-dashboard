import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const property = await prisma.property.findUnique({
            where: { id },
            include: {
                leads: true,
            },
        });

        if (!property) {
            return NextResponse.json(
                { error: "Property not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(property);
    } catch (error) {
        console.error("Error fetching property:", error);
        return NextResponse.json(
            { error: "Failed to fetch property" },
            { status: 500 }
        );
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const data = await req.json();

        // Extract allowed fields for update
        const {
            name,
            type,
            price,
            status,
            location,
            description,
            amenities,
            tokens,
            demoViews,
            siteVisits,
            possessionDate,
            reraNumber,
            builder
        } = data;

        // Validate enum values if provided
        if (type) {
            const validPropertyTypes = ['APARTMENT', 'PENTHOUSE', 'STUDIO'];
            if (!validPropertyTypes.includes(type)) {
                return NextResponse.json({
                    error: "Invalid property type",
                    details: `Valid types are: ${validPropertyTypes.join(', ')}`
                }, { status: 400 });
            }
        }

        if (status) {
            const validPropertyStatuses = ['ACTIVE', 'PRELAUNCH', 'UNDER_CONSTRUCTION', 'SOLD_OUT'];
            if (!validPropertyStatuses.includes(status)) {
                return NextResponse.json({
                    error: "Invalid property status",
                    details: `Valid statuses are: ${validPropertyStatuses.join(', ')}`
                }, { status: 400 });
            }
        }

        // Process numeric fields
        const priceFloat = price ? parseFloat(price.toString().replace(/[^0-9.]/g, '')) : undefined;
        const tokensInt = tokens !== undefined ? parseInt(tokens) : undefined;
        const demoViewsInt = demoViews !== undefined ? parseInt(demoViews) : undefined;
        const siteVisitsInt = siteVisits !== undefined ? parseInt(siteVisits) : undefined;

        // Update property
        const updatedProperty = await prisma.property.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(type && { type }),
                ...(priceFloat !== undefined && !isNaN(priceFloat) && { price: priceFloat }),
                ...(status && { status }),
                ...(location && { location }),
                ...(description !== undefined && { description }),
                ...(amenities && { amenities }),
                ...(tokensInt !== undefined && !isNaN(tokensInt) && { tokens: tokensInt }),
                ...(demoViewsInt !== undefined && !isNaN(demoViewsInt) && { demos: demoViewsInt }), // Map to 'demos' in schema
                ...(siteVisitsInt !== undefined && !isNaN(siteVisitsInt) && { visits: siteVisitsInt }), // Map to 'visits' in schema
                ...(possessionDate && { possessionDate: new Date(possessionDate) }),
                ...(reraNumber !== undefined && { reraNumber }),
                ...(builder !== undefined && { builder }),
            },
        });

        return NextResponse.json(updatedProperty);
    } catch (error) {
        console.error("Error updating property:", error);
        if (error instanceof Error && error.message.includes('Record to update not found')) {
            return NextResponse.json(
                { error: "Property not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { error: "Failed to update property" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.property.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting property:", error);
        return NextResponse.json(
            { error: "Failed to delete property" },
            { status: 500 }
        );
    }
}
