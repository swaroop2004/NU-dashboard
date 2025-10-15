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
    
    // Extract only the fields that exist in the Prisma schema
    const {
      name,
      type,
      price,
      status,
      location,
      description,
      amenities,
      tokens,
    } = data;

    // Validate required fields
    if (!name || !type || !price || !status || !location) {
      console.error('Missing required fields:', { name, type, price, status, location });
      return NextResponse.json({ 
        error: "Missing required fields", 
        details: {
          name: !name ? "Property name is required" : null,
          type: !type ? "Property type is required" : null,
          price: !price ? "Price is required" : null,
          status: !status ? "Status is required" : null,
          location: !location ? "Location is required" : null,
        }.filter(Boolean)
      }, { status: 400 });
    }

    // Validate enum values
    const validPropertyTypes = ['APARTMENT', 'PENTHOUSE', 'STUDIO'];
    const validPropertyStatuses = ['ACTIVE', 'PRELAUNCH', 'UNDER_CONSTRUCTION', 'SOLD_OUT'];
    
    if (!validPropertyTypes.includes(type)) {
      return NextResponse.json({ 
        error: "Invalid property type", 
        details: `Valid types are: ${validPropertyTypes.join(', ')}` 
      }, { status: 400 });
    }
    
    if (!validPropertyStatuses.includes(status)) {
      return NextResponse.json({ 
        error: "Invalid property status", 
        details: `Valid statuses are: ${validPropertyStatuses.join(', ')}` 
      }, { status: 400 });
    }

    // Convert price string to float
    const priceFloat = parseFloat(price);
    if (isNaN(priceFloat)) {
      return NextResponse.json({ error: "Invalid price format" }, { status: 400 });
    }

    // Prepare amenities array if provided
    let amenitiesArray: string[] = [];
    if (amenities && Array.isArray(amenities)) {
      amenitiesArray = amenities;
    }

    // Prepare tokens - convert to integer if provided
    let tokensValue: number | undefined;
    if (tokens !== undefined && tokens !== null) {
      tokensValue = parseInt(tokens.toString());
      if (isNaN(tokensValue)) {
        tokensValue = undefined;
      }
    }

    // Log the data being sent to Prisma for debugging
    console.log('Creating property with data:', {
      name: name.trim(),
      type,
      price: priceFloat,
      status,
      location: location.trim(),
      description: description?.trim() || undefined,
      amenities: amenitiesArray,
      tokens: tokensValue,
    });

    // Create property with only valid schema fields
    const newProperty = await prisma.property.create({
      data: {
        name: name.trim(),
        type,
        price: priceFloat,
        status,
        location: location.trim(),
        description: description?.trim() || undefined,
        amenities: amenitiesArray,
        tokens: tokensValue,
      },
      include: { leads: true },
    });

    console.log('Property created successfully:', newProperty);
    return NextResponse.json(newProperty);
  } catch (error) {
    console.error('Error creating property:', error);
    
    // Provide more specific error messages based on error type
    if (error instanceof Error) {
      if (error.message.includes('Invalid enum value')) {
        return NextResponse.json({ 
          error: "Invalid enum value provided", 
          details: error.message 
        }, { status: 400 });
      }
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json({ 
          error: "Property with this name already exists", 
          details: error.message 
        }, { status: 409 });
      }
    }
    
    return NextResponse.json({ error: "Failed to create property" }, { status: 500 });
  }
}
