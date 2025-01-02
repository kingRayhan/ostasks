// app/api/webhooks/clerk/route.ts
import { headers } from "next/headers";
import { auth, clerkClient, WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/backend/persistence/db";
import { users } from "@/backend/persistence/schema";
import { Webhook } from "svix";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) throw new Error("Missing CLERK_WEBHOOK_SECRET");
  const _clerkClient = await clerkClient();

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  try {
    const evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;

    switch (evt.type) {
      case "user.created":
        const createdUser = await db
          .insert(users)
          .values({
            auth_uid: evt.data.id,
            email: evt.data.email_addresses[0]?.email_address,
            firstName: evt.data.first_name,
            lastName: evt.data.last_name,
            username: evt.data.username,
            imageUrl: evt.data.image_url,
          })
          .returning({ id: users.id });

        await _clerkClient.users.updateUser(evt.data.id, {
          publicMetadata: {
            dbUserId: createdUser?.[0].id,
          },
        });
        break;

      case "user.updated":
        await db
          .update(users)
          .set({
            email: evt.data.email_addresses[0]?.email_address,
            firstName: evt.data.first_name,
            lastName: evt.data.last_name,
            username: evt.data.username,
            imageUrl: evt.data.image_url,
            lastSynced: new Date(),
          })
          .where(eq(users.auth_uid, evt.data.id));
        break;

      case "user.deleted":
        await db.delete(users).where(eq(users.auth_uid, evt.data.id as any));
        break;
    }

    return new Response("Webhook processed", { status: 200 });
  } catch (err) {
    console.error("Error processing webhook:", err);
    return new Response("Webhook verification failed", { status: 400 });
  }
}
