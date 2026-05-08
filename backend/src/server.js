import app from "./app.js";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";

const start = async () => {
  try {
    await connectDB();

    app.listen(env.port, () => {
      console.log(
        `Server started on port ${env.port}`
      );
    });
  } catch (error) {
    console.log(
      "Error while starting server"
    );

    console.error(error);
  }
};

start();

process.on(
  "unhandledRejection",
  (error) => {
    console.error(error);
  }
);

process.on(
  "uncaughtException",
  (error) => {
    console.error(error);

    process.exit(1);
  }
);
