export default async function (fastify) {
  // Route to display basket contents
  fastify.get("/", async (request, reply) => {
    fastify.requireLogin(request, reply);

    try {
      const basketKey = `basket:${request.session.user.id}`;
      const basket = await fastify.redis.hgetall(basketKey);

      const items = Object.entries(basket).map(([sku, quantity]) => ({
        sku,
        quantity: parseInt(quantity, 10)
      }));

      return reply.view("basket.ejs", {
        title: "Your Basket",
        currentPath: "/basket",
        items
      });
    } catch (error) {
      fastify.log.error("Error fetching basket contents:", error);
      return reply.redirect("/basket");
    }
  });

  // Route to add an item to the basket
  fastify.post("/add", async (request, reply) => {
    fastify.requireLogin(request, reply);

    try {
      const { sku, quantity } = request.body;
      const basketKey = `basket:${request.session.user.id}`;
      await fastify.redis.hincrby(basketKey, sku, parseInt(quantity, 10));

      request.session.set("messages", [
        {
          type: "success",
          text: `Item with SKU: ${sku} was added to the basket.`
        }
      ]);

      return reply.redirect(request.headers.referer || "/basket");
    } catch (error) {
      fastify.log.error("Error adding item to basket:", error);
      return reply.redirect("/basket");
    }
  });

  // Route to remove an item from the basket
  fastify.post("/remove", async (request, reply) => {
    fastify.requireLogin(request, reply);

    try {
      const { sku } = request.body;
      const basketKey = `basket:${request.session.user.id}`;
      await fastify.redis.hdel(basketKey, sku);

      request.session.set("messages", [
        {
          type: "success",
          text: `Item with SKU: ${sku} was removed from the basket.`
        }
      ]);

      return reply.redirect(request.headers.referer || "/basket");
    } catch (error) {
      fastify.log.error("Error removing item from basket:", error);
      return reply.redirect("/basket");
    }
  });

  // Route to clear the basket
  fastify.post("/clear", async (request, reply) => {
    fastify.requireLogin(request, reply);

    try {
      const basketKey = `basket:${request.session.user.id}`;
      await fastify.redis.del(basketKey);

      request.session.set("messages", [
        { type: "success", text: "Your basket has been cleared." }
      ]);

      return reply.redirect(request.headers.referer || "/basket");
    } catch (error) {
      fastify.log.error("Error clearing basket:", error);
      return reply.redirect("/basket");
    }
  });
}
