import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { createServerClient } from "@supabase/ssr";

// Cloudinary SDK automatically reads CLOUDINARY_URL if set
// No need to manually configure if CLOUDINARY_URL is present

export async function POST(request: NextRequest) {
  try {
    // Check Cloudinary configuration
    // Support both CLOUDINARY_URL and individual env vars
    const hasCloudinaryUrl = !!process.env.CLOUDINARY_URL;
    const hasIndividualVars = !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
    
    if (!hasCloudinaryUrl && !hasIndividualVars) {
      console.error("Cloudinary configuration missing");
      return NextResponse.json(
        { error: "Cloudinary configuration is missing. Please set CLOUDINARY_URL or individual CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables." },
        { status: 500 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: "Supabase configuration is missing" },
        { status: 500 }
      );
    }

    // Check if user is admin - use cookies from request
    try {
      const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            // Cannot set cookies in API route response like this
            // But we don't need to set them here
          },
          remove(name: string, options: any) {
            // Cannot remove cookies in API route response like this
          },
        },
      });

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error("User not authenticated:", authError);
        return NextResponse.json(
          { error: "Unauthorized - Admin access required. Please log in." },
          { status: 401 }
        );
      }
    } catch (authError: any) {
      console.error("Auth check error:", authError);
      return NextResponse.json(
        { error: "Authentication error: " + (authError.message || "Unknown error") },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Convert File to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Convert buffer to base64
    const base64 = buffer.toString("base64");
    const dataURI = `data:${file.type};base64,${base64}`;

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        dataURI,
        {
          folder: "ecommerce",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
    });

    const uploadResult = result as any;

    if (!uploadResult?.secure_url) {
      throw new Error("Cloudinary did not return a URL");
    }

    return NextResponse.json({
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    });
  } catch (error: any) {
    console.error("Error uploading to Cloudinary:", error);
    const errorMessage = error.message || error.error?.message || "Failed to upload image";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
