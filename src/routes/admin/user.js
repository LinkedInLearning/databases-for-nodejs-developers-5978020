export default async function (fastify) {
  // GET /admin/user - Fetch and display a list of users
  fastify.get("/", async (request, reply) => {
    try {
      // Placeholder: Fetch users from the database
      const users = []; // Replace with actual database query

      return reply.view("admin/user.ejs", {
        title: "Manage Users",
        currentPath: "/admin/user",
        users
      });
    } catch (error) {
      request.log.error(error);
      request.session.set("messages", [
        { type: "danger", text: "Failed to fetch users." }
      ]);
      return reply.redirect("/admin/user");
    }
  });

  // POST /admin/user - Create or update a user
  fastify.post("/", async (request, reply) => {
    const { userId, email, password } = request.body;

    try {
      if (userId) {
        // Placeholder: Update existing user in the database
        request.session.set("messages", [
          { type: "success", text: "User updated successfully." }
        ]);
      } else {
        // Placeholder: Create a new user in the database
        request.session.set("messages", [
          { type: "success", text: "User created successfully." }
        ]);
      }
      return reply.redirect("/admin/user");
    } catch (error) {
      request.log.error(error);
      request.session.set("messages", [
        { type: "danger", text: "Failed to save user." }
      ]);
      return reply.redirect("/admin/user");
    }
  });

  // GET /admin/user/:id - Fetch a specific user for editing
  fastify.get("/:id", async (request, reply) => {
    const { id } = request.params;

    try {
      // Placeholder: Fetch user by ID from the database
      const user = null; // Replace with actual database query
      return reply.view("admin/user.ejs", {
        title: "Edit User",
        currentPath: "/admin/user",
        user,
        users: [] // Pass empty users array
      });
    } catch (error) {
      request.log.error(error);
      request.session.set("messages", [
        { type: "danger", text: "Failed to fetch user." }
      ]);
      return reply.redirect("/admin/user");
    }
  });

  // GET /admin/user/delete/:id - Delete a user
  fastify.get("/delete/:id", async (request, reply) => {
    const { id } = request.params;

    try {
      // Placeholder: Delete user from the database
      request.session.set("messages", [
        { type: "success", text: "User deleted successfully." }
      ]);
      return reply.redirect("/admin/user");
    } catch (error) {
      request.log.error(error);
      request.session.set("messages", [
        { type: "danger", text: "Failed to delete user." }
      ]);
      return reply.redirect("/admin/user");
    }
  });

  // GET /admin/user/impersonate/:id - Impersonate a user
  fastify.get("/impersonate/:id", async (request, reply) => {
    const { id } = request.params;

    try {
      // Placeholder: Impersonate user by ID
      return reply.redirect("/"); // Redirect after impersonation
    } catch (error) {
      request.log.error(error);
      request.session.set("messages", [
        { type: "danger", text: "Failed to impersonate user." }
      ]);
      return reply.redirect("/admin/user");
    }
  });
}
