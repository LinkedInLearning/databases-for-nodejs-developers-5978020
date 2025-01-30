export default async function (fastify) {
  // Route to display and manage items
  fastify.get("/", async (request, reply) => {
    const items = await fastify.Item.find({});

    return reply.view("admin/item.ejs", {
      title: "Manage Items",
      currentPath: "/admin/item",
      items
    });
  });

  // Route to create or edit an item
  fastify.post("/", async (request, reply) => {
    const { itemId, sku, name, price } = request.body;

    // Placeholder logic to create or update an item
    if (itemId) {
      fastify.log.info(`Updating item ${itemId}:`, { sku, name, price });
    } else {
      fastify.log.info(`Creating new item:`, { sku, name, price });
    }

    return reply.redirect("/admin/item");
  });

  // Route to delete an item
  fastify.get("/delete/:id", async (request, reply) => {
    const { id } = request.params;

    // Placeholder logic to delete an item
    fastify.log.info(`Deleting item with id: ${id}`);

    return reply.redirect("/admin/item");
  });

  // Route to fetch a single item for editing
  fastify.get("/:id", async (request, reply) => {
    const { id } = request.params;

    const item = await fastify.Item.findById(id);

    return reply.view("admin/item.ejs", {
      title: "Edit Item",
      currentPath: "/admin/item",
      items: [], // Pass empty items array for simplicity
      item
    });
  });
}
