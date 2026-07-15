import { createApp } from "./app";
import { connectDatabase } from "./config/database";
import { env } from "./config/env";

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();

    const app = createApp();
    const port = env.PORT;

    app.listen(port, () => {
      console.log(`Server running on port ${port} in ${env.NODE_ENV} mode`);
      console.log(`Health check: http://localhost:${port}/api/health`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
