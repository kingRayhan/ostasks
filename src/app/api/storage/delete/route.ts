import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { z } from "zod";
import { s3Client } from "../s3-client.config";

// Dto
const uploadRequestSchema = z.object({
  keys: z.array(z.string()).min(1, "file key is required"),
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

    dto.data.keys.forEach(async (key) => {
      const putObjectCommand = new DeleteObjectCommand({
        Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
        Key: key,
      });
      await s3Client.send(putObjectCommand);
    });

    return NextResponse.json({
      success: true,
      key: dto.data.keys,
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
