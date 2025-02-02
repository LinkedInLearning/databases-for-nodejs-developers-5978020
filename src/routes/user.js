export default async function (fastify) {
  // GET /login - Render the login form
  fastify.get("/login", async (req, reply) => {
    try {
      if (req.session.get("user")) {
        // Redirect if already logged in
        return reply.redirect("/");
      }

      return reply.view("login", {
        currentPath: "/user/login",
        messages: req.session.get("messages") || []
      });
    } catch (error) {
      req.session.set("messages", [
        { type: "danger", text: "Failed to load login page." }
      ]);
      req.log.error("Error rendering login page:", error);
      return reply.redirect("/");
    }
  });

  // POST /login - Handle login logic with validation
  fastify.post(
    "/login",
    {
      schema: {
        body: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 6 }
          },
          additionalProperties: false // Prevent unexpected properties
        }
      },
      attachValidation: true // Attach validation errors
    },
    async (req, reply) => {
      try {
        if (req.validationError) {
          req.session.set("messages", [
            { type: "danger", text: "Invalid email or password format." }
          ]);
          return reply.redirect("/user/login");
        }

        const { email, password } = req.body;

        // TODO: Replace with real database authentication logic
        if (email === "test@example.com" && password === "password123") {
          req.session.set("user", { email }); // Save user data in session
          req.session.set("messages", [
            { type: "success", text: "Successfully logged in." }
          ]);
          return reply.redirect("/");
        }

        req.session.set("messages", [
          { type: "danger", text: "Invalid email or password." }
        ]);
        return reply.redirect("/user/login");
      } catch (error) {
        req.session.set("messages", [
          { type: "danger", text: "Login failed due to an error." }
        ]);
        req.log.error("Error handling login:", error);
        return reply.redirect("/user/login");
      }
    }
  );

  // GET /logout - Clear the session and redirect to the login page
  fastify.get("/logout", async (req, reply) => {
    try {
      req.session.delete(); // Clear the session
      req.session.set("messages", [
        { type: "success", text: "You have been logged out." }
      ]);
      return reply.redirect("/user/login");
    } catch (error) {
      req.session.set("messages", [
        { type: "danger", text: "Failed to log out." }
      ]);
      req.log.error("Error logging out:", error);
      return reply.redirect("/");
    }
  });
}
