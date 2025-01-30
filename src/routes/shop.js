export default async function (fastify) {
  // Route to display all items with pagination
  fastify.get("/:tag?", async (request, reply) => {
    const { page = 1, limit = 10, q } = request.query; // Defaults: page 1, 10 items per page
    const { tag } = request.params;

    const query = {};
    if (tag) {
      query.tags = tag;
    }

    if (q) {
      query.$text = { $search: q };
    }

    const allItems = await fastify.Item.find(query)
      .sort({ name: 1 })
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
