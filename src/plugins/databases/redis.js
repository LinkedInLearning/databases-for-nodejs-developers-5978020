import fp from "fastify-plugin";
import Redis from "ioredis";

async function redisPlugin(fastify, config) {
  let redisStatus = "disconnected";

  // TODO: Connect to Redis and update the status
  try {
    const redis = new Redis(config.host, config.port);
    redisStatus = "connected";
    fastify.log.info("Connected to Redis");
    fastify.decorate("redis", redis);
  } catch (err) {
    fastify.log.error("Failed to connect to Redis");
    throw err;
  }

  fastify.decorate("redisStatus", () => redisStatus);

  // Graceful shutdown
  fastify.addHook("onClose", async (fastifyInstance, done) => {
    redisStatus = "disconnected";
    // TODO: Close Redis connection
    await fastify.redis.quit();
    done();
  });
}

export default fp(redisPlugin, { name: "redis-plugin" });
