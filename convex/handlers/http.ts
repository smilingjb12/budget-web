import { internal } from "../_generated/api";
import { ActionCtx } from "../_generated/server";

export const clerkRouteHandler = async (ctx: ActionCtx, req: Request) => {
  console.log("Processing clerk webhook");
  const payloadString = await req.text();
  const headerPayload = req.headers;

  try {
    const result = await ctx.runAction(internal.clerk.webhook, {
      payload: payloadString,
      headers: {
        "svix-id": headerPayload.get("svix-id"),
        "svix-timestamp": headerPayload.get("svix-timestamp"),
        "svix-signature": headerPayload.get("svix-signature"),
      },
    });

    switch (result.type) {
      case "user.created":
        console.log("Processing user.created event:", result.data);
        await ctx.runMutation(internal.users.createSignedInUser, {
          userId: result.data.id,
          email: result.data.email_addresses[0].email_address,
        });
    }

    return new Response(null, { status: 200 });
  } catch (error) {
    console.error("Clerk webhook error", error);
    return new Response(`Webhook Error: ${error}`, {
      status: 400,
    });
  }
};
