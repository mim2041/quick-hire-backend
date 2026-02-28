// main.ts
import { Server } from 'http';
import app from './app';
import env from './app/config/env';
import { connectDB, disconnectDB } from './app/manager/database';
import { logger } from './app/manager/logger';


let server: Server;

async function main() {
    try {
        await connectDB(); // Connect to MongoDB

        server = app.listen(env.port, () => {
            logger.info(`🚀 QuickHire API is running on port ${env.port}`);
        });
    } catch (err) {
        logger.error(`❌ Server failed to start: ${(err as Error).message}`);
    }
}

main();

// Graceful Shutdown Handlers
const gracefulShutdown = async () => {
    logger.info('🛑 Shutting down...');
    await disconnectDB();
    if (server) {
        server.close(() => {
            logger.info('💤 Server closed');
            process.exit(0);
        });
    } else {
        process.exit(0);
    }
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
process.on('unhandledRejection', (err) => {
    logger.error(`❗ Unhandled Rejection: ${(err as Error).message}`);
    gracefulShutdown();
});
process.on('uncaughtException', (err) => {
    logger.error(`❗ Uncaught Exception: ${(err as Error).message}`);
    gracefulShutdown();
});