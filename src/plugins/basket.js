import fp from "fastify-plugin";

async function basketPlugin(fastify) {
  fastify.addHook("preHandler", async (req, reply) => {
    const user = req.session.get("user");
    if (!user) return null;
    const key = `mybasket:user:${user.id}:items`;

    const basketItems = await fastify.redis.hgetall(key);
    const basketCount = Object.values(basketItems).reduce(
      (total, quantity) => total + parseInt(quantity, 10),
      0
    );

    reply.locals = {
      ...(reply.locals || {}),
      basketCount
    };
  });
}

export default fp(basketPlugin, { name: "basket-plugin" });
