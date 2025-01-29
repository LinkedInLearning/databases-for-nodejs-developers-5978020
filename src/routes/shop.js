export default async function (fastify) {
  // Route to display all items with pagination
  fastify.get("/:tag?", async (request, reply) => {
    const { page = 1, limit = 10 } = request.query; // Defaults: page 1, 10 items per page
    const { tag } = request.params;

    const query = tag ? { tags: tag } : {};

    const allItems = await fastify.Item.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    const tags = await fastify.Item.distinct("tags");

    const totalPages = Math.ceil(
      (await fastify.Item.countDocuments(query)) / limit
    );

    // Render the shop view with paginated items and tags
    return reply.view("shop.ejs", {
      title: "Shop",
      currentPath: "/shop",
      items: allItems,
      tags,
      currentPage: parseInt(page, 10),
      totalPages,
      currentTag: tag || null
    });
  });
}
