import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { z } from "zod";
import { s3Client } from "../s3-client.config";

// Dto
const uploadRequestSchema = z.object({
  key: z.string().min(1, "file key is required"),
  contentType: z.string().min(1, "Content type is required"),
});
// type UploadRequest = z.infer<typeof uploadRequestSchema>;

// API Route
export async function POST(req: Request) {
  try {
    const dto = uploadRequestSchema.safeParse(await req.json());

    if (!dto.success) {
      return new Response(JSON.stringify(dto.error), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    console.log({
      dto,
    });

    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: `${dto.data.key}`,
    });

    // Generate signed URL
    const signedUrl = await getSignedUrl(s3Client, putObjectCommand, {
      expiresIn: 3600,
    });

    return NextResponse.json({
      success: true,
      uploadUrl: signedUrl,
      key: dto.data.key,
    });
  } catch (error) {
    console.log(JSON.stringify(error));
    return new Response(JSON.stringify(error), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
