import fp from "fastify-plugin";
import fastifySecureSession from "@fastify/secure-session";

async function sessionPlugin(fastify, config) {
  const secret = config.secret;

  if (!secret) {
    throw new Error(
      "SESSION_SECRET environment variable is required for secure sessions."
    );
  }

  // Register fastify-secure-session
  fastify.register(fastifySecureSession, {
    key: Buffer.from(secret, "base64"),
    cookie: {
      path: "/",
      httpOnly: true,
      secure: false,
      maxAge: 3600 // 1-hour session expiration
    }
  });

  // Decorate to clear session
  fastify.decorate("clearSession", (req) => {
    req.session.delete();
  });

  // PreHandler: Attach session messages to locals
  fastify.addHook("preHandler", async (req, reply) => {
    reply.locals = {
      ...(reply.locals || {}),
      currentUser: req.session.get("user") || null,
      messages: req.session.get("messages") || []
    };
  });

  // Decorate reply.view to clear messages **after** rendering
  fastify.addHook("onRequest", async (req, reply) => {
    const originalView = reply.view;
    reply.view = function (template, data) {
      const result = originalView.call(this, template, data);
      req.session.set("messages", []); // Clear messages after rendering
      return result;
    };
  });
}

export default fp(sessionPlugin, { name: "session-plugin" });
