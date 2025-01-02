// app/api/webhooks/clerk/route.ts
import { headers } from "next/headers";
import { auth, clerkClient, WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/backend/persistence/db";
import { users } from "@/backend/persistence/schema";
import { Webhook } from "svix";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  // const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  // if (!WEBHOOK_SECRET) throw new Error("Missing CLERK_WEBHOOK_SECRET");
  const _clerkClient = await clerkClient();

  const payload = await req.json();

  console.log(JSON.stringify(payload, null, 2));

  // const headerPayload = await headers();
  // const payload = await req.json();
  // const body = JSON.stringify(payload);

  // const svix_id = headerPayload.get("svix-id");
  // const svix_timestamp = headerPayload.get("svix-timestamp");
  // const svix_signature = headerPayload.get("svix-signature");

  // if (!svix_id || !svix_timestamp || !svix_signature) {
  //   return new Response("Missing svix headers", { status: 400 });
  // }

  // const wh = new Webhook(WEBHOOK_SECRET);

  try {
    // const evt = wh.verify(body, {
    //   "svix-id": svix_id,
    //   "svix-timestamp": svix_timestamp,
    //   "svix-signature": svix_signature,
    // }) as WebhookEvent;

    switch (payload.type) {
      case "user.created":
        const createdUser = await db
          .insert(users)
          .values({
            auth_uid: payload.data.id,
            email: payload.data.email_addresses[0]?.email_address,
            firstName: payload.data.first_name,
            lastName: payload.data.last_name,
            username: payload.data.username,
            imageUrl: payload.data.image_url,
          })
          .returning({ id: users.id });

        await _clerkClient.users.updateUser(payload.data.id, {
          publicMetadata: {
            dbUserId: createdUser?.[0].id,
          },
        });
        break;

      case "user.updated":
        await db
          .update(users)
          .set({
            email: payload.data.email_addresses[0]?.email_address,
            firstName: payload.data.first_name,
            lastName: payload.data.last_name,
            username: payload.data.username,
            imageUrl: payload.data.image_url,
            lastSynced: new Date(),
          })
          .where(eq(users.auth_uid, payload.data.id));
        break;

      case "user.deleted":
        await db
          .delete(users)
          .where(eq(users.auth_uid, payload.data.id as any));
        break;
    }

    return new Response("Webhook processed", { status: 200 });
  } catch (err) {
    console.error("Error processing webhook:", err);
    return new Response("Webhook verification failed", { status: 400 });
  }
}
