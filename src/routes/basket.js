export default async function (fastify) {
  // Route to display basket contents
  fastify.get("/", async (request, reply) => {
    try {
      fastify.log.info("Fetching basket contents.");

      // TODO: Fetch basket contents from Redis
      const items = []; // Replace this with Redis retrieval logic

      return reply.view("basket.ejs", {
        title: "Your Basket",
        currentPath: "/basket",
        items
      });
    } catch (error) {
      fastify.log.error("Error fetching basket contents:", error);
      request.session.set("messages", [
        { type: "danger", text: "Failed to load basket contents." }
      ]);
      return reply.redirect("/basket");
    }
  });

  // Route to add an item to the basket
  fastify.post("/add", async (request, reply) => {
    try {
      const { sku, quantity } = request.body;
      fastify.log.info(`Adding item with SKU: ${sku}, quantity: ${quantity}`);

      // TODO: Add the item to the Redis basket

      request.session.set("messages", [
        {
          type: "success",
          text: `Item with SKU: ${sku} was added to the basket.`
        }
      ]);

      return reply.redirect(request.headers.referer || "/basket");
    } catch (error) {
      fastify.log.error("Error adding item to basket:", error);
      request.session.set("messages", [
        { type: "danger", text: "Failed to add item to the basket." }
      ]);
      return reply.redirect(request.headers.referer || "/basket");
    }
  });

  // Route to remove an item from the basket
  fastify.post("/remove", async (request, reply) => {
    try {
      const { sku } = request.body;
      fastify.log.info(`Removing item with SKU: ${sku}`);

      // TODO: Remove the item from the Redis basket

      request.session.set("messages", [
        {
          type: "success",
          text: `Item with SKU: ${sku} was removed from the basket.`
        }
      ]);

      return reply.redirect(request.headers.referer || "/basket");
    } catch (error) {
      fastify.log.error("Error removing item from basket:", error);
      request.session.set("messages", [
        { type: "danger", text: "Failed to remove item from the basket." }
      ]);
      return reply.redirect(request.headers.referer || "/basket");
    }
  });

  // Route to buy all items in the basket
  fastify.post("/buy", async (request, reply) => {
    try {
      fastify.log.info("Processing basket purchase...");

      // TODO: Retrieve basket items from Redis and process purchase
      // TODO: Clear the basket after successful purchase

      request.session.set("messages", [
        {
          type: "success",
          text: "Thank you for your purchase! Your basket has been processed."
        }
      ]);

      return reply.redirect("/confirmation");
    } catch (error) {
      fastify.log.error("Error processing basket purchase:", error);
      request.session.set("messages", [
        { type: "danger", text: "Failed to process your purchase." }
      ]);
      return reply.redirect("/basket");
    }
  });

  // Route to clear the basket
  fastify.post("/clear", async (request, reply) => {
    try {
      fastify.log.info("Clearing all items from the basket.");

      // TODO: Clear all basket items from Redis

      request.session.set("messages", [
        { type: "success", text: "Your basket has been cleared." }
      ]);

      return reply.redirect(request.headers.referer || "/basket");
    } catch (error) {
      fastify.log.error("Error clearing basket:", error);
      request.session.set("messages", [
        { type: "danger", text: "Failed to clear the basket." }
      ]);
      return reply.redirect(request.headers.referer || "/basket");
    }
  });
}
