import fp from "fastify-plugin";
import fastifyCookie from "@fastify/cookie";
import fastifySession from "@fastify/session";
import { RedisStore } from "connect-redis";

async function sessionPlugin(fastify, config) {
  const secret = config.secret;

  if (!secret) {
    throw new Error(
      "SESSION_SECRET environment variable is required for secure sessions."
    );
  }

  fastify.register(fastifyCookie);

  const redisStore = new RedisStore({
    client: fastify.redis,
    prefix: "myshop:"
  });

  // Register fastify-secure-session
  fastify.register(fastifySession, {
    store: redisStore,
    secret,
    cookie: {
      path: "/",
      httpOnly: true,
      secure: false,
      maxAge: 3600 * 1000 // 1-hour session expiration
    },
    saveUnitialized: false,
    resave: false
  });

  // Decorate to clear session
  fastify.decorate("clearSession", (req) => {
    req.session.set("user", null);
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
