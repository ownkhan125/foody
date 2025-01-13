



import { connectDB } from "@/connectDB/connectDB";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
    cloud_name: 'drgqzs3ws',
    api_key: '526934557442663',
    api_secret: 'z49xdx4zddC60lL_dwUt9AVuMsw'
});

export async function POST(req) {
    try {
        await connectDB();
        const body = await req.json();
        const { image } = body;
        if (!image) {
            return NextResponse.json({ error: "No image provided" }, { status: 400 });
        }

        const maxSize = 5 * 1024 * 1024; // 5MB limit
        if (Buffer.byteLength(image, 'base64') > maxSize) {
            return NextResponse.json('heavyImage', { status: 400 });
        }

        const uploadResponse = await cloudinary.uploader.upload(image, {
            folder: "nextjs_project",
        });
        return NextResponse.json(uploadResponse.secure_url, { status: 200 });
    } catch (error) {
        console.error("Upload Error:", error);
        return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
    }
}