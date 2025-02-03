function requireLogin(req, reply) {
  if (!req.session.get("user")) {
    req.session.set("messages", [
      { type: "warning", text: "Please log in first." }
    ]);
    reply.redirect("/user/login");
    return false; // Prevent further execution
  }
  return true; // Allow execution to continue
}

export default async function (fastify) {
  // Route to display basket contents
  fastify.get("/", async (req, reply) => {
    try {
      if (!requireLogin(req, reply)) return; // Stop execution if user is not logged in

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
      req.session.set("messages", [
        { type: "danger", text: "Failed to load basket contents." }
      ]);
      return reply.redirect("/basket");
    }
  });

  // Route to add an item to the basket
  fastify.post("/add", async (req, reply) => {
    try {
      if (!requireLogin(req, reply)) return;

      const { sku, quantity } = req.body;
      fastify.log.info(`Adding item with SKU: ${sku}, quantity: ${quantity}`);

      // TODO: Add the item to the Redis basket

      req.session.set("messages", [
        {
          type: "success",
          text: `Item with SKU: ${sku} was added to the basket.`
        }
      ]);
      return reply.redirect(req.headers.referer || "/basket");
    } catch (error) {
      fastify.log.error("Error adding item to basket:", error);
      req.session.set("messages", [
        { type: "danger", text: "Failed to add item to the basket." }
      ]);
      return reply.redirect("/basket");
    }
  });

  // Route to remove an item from the basket
  fastify.post("/remove", async (req, reply) => {
    try {
      if (!requireLogin(req, reply)) return;

      const { sku } = req.body;
      fastify.log.info(`Removing item with SKU: ${sku}`);

      // TODO: Remove the item from the Redis basket

      req.session.set("messages", [
        {
          type: "success",
          text: `Item with SKU: ${sku} was removed from the basket.`
        }
      ]);
      return reply.redirect(req.headers.referer || "/basket");
    } catch (error) {
      fastify.log.error("Error removing item from basket:", error);
      req.session.set("messages", [
        { type: "danger", text: "Failed to remove item from the basket." }
      ]);
      return reply.redirect("/basket");
    }
  });

  // Route to buy all items in the basket
  fastify.post("/buy", async (req, reply) => {
    try {
      if (!requireLogin(req, reply)) return;

      fastify.log.info("Processing basket purchase...");
      // TODO: Retrieve basket items from Redis and process purchase
      // TODO: Clear the basket after successful purchase

      req.session.set("messages", [
        {
          type: "success",
          text: "Thank you for your purchase! Your basket has been processed."
        }
      ]);
      return reply.redirect("/");
    } catch (error) {
      fastify.log.error("Error processing basket purchase:", error);
      req.session.set("messages", [
        { type: "danger", text: "Failed to process your purchase." }
      ]);
      return reply.redirect("/basket");
    }
  });

  // Route to clear the basket
  fastify.post("/clear", async (req, reply) => {
    try {
      if (!requireLogin(req, reply)) return;

      fastify.log.info("Clearing all items from the basket.");
      // TODO: Clear all basket items from Redis

      req.session.set("messages", [
        { type: "success", text: "Your basket has been cleared." }
      ]);
      return reply.redirect(req.headers.referer || "/basket");
    } catch (error) {
      fastify.log.error("Error clearing basket:", error);
      req.session.set("messages", [
        { type: "danger", text: "Failed to clear the basket." }
      ]);
      return reply.redirect("/basket");
    }
  });
}
