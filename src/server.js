// Import the Fastify framework
import Fastify from "fastify";
import { config } from "./config/index.js";

import mongoosePlugin from "./plugins/databases/mongoose.js";
import sequelizePlugin from "./plugins/databases/sequelize.js";
import redisPlugin from "./plugins/databases/redis.js";
import staticPlugin from "./plugins/static.js";
import viewPlugin from "./plugins/views.js";
import routesPlugin from "./plugins/routes.js";
import defaultsPlugin from "./plugins/defaults.js";
import sessionPlugin from "./plugins/session.js";
import formBody from "@fastify/formbody";

// Create a Fastify instance with logging enabled
const fastify = Fastify({ logger: true, disableRequestLogging: true });

// Register the formbody plugin to handle HTML forms
fastify.register(formBody);

// Register a plugin for serving static files like stylesheets and images
fastify.register(staticPlugin);

// Register the defaults plugin
fastify.register(defaultsPlugin);

// Register MogoDB/Mongoose plugin
fastify.register(mongoosePlugin, config.mongodb);

// Register MySQL/Sequelize plugin
fastify.register(sequelizePlugin, config.mysql);

// Register Redis plugin
fastify.register(redisPlugin, config.redis);

// Register the session plugin AFTER Redis is available
fastify.register(sessionPlugin, config.session);

// Register the view plugin
fastify.register(viewPlugin);

// Register the routes plugin
fastify.register(routesPlugin);

// Start the server
const start = async () => {
  try {
    const port = config.server.port;
    // Start listening on the defined port
    fastify.listen({ port });
    fastify.log.info(`Server running at http://localhost:${port}/`);
  } catch (err) {
    // Log errors if the server fails to start
    fastify.log.error(err);
    process.exit(1); // Exit the process with a failure code
  }
};

// Call the start function to boot up the server
start();
