import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { clerkRouteHandler } from "./handlers/http";

const http = httpRouter();

http.route({
  path: "/clerk",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    return await clerkRouteHandler(ctx, req);
  }),
});

export default http;
