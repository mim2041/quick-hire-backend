// main.ts
import { Server } from 'http';
import app from './app';
import env from './app/config/env';
import { connectDB, disconnectDB } from './app/manager/database';


let server: Server;

async function main() {
    try {
        await connectDB(); // Connect to MongoDB

        server = app.listen(env.port, () => {
            console.log(`🚀 QuickHire API is running on port ${env.port}`);
        });
    } catch (err) {
        console.error('❌ Server failed to start:', err);
    }
}

main();

// Graceful Shutdown Handlers
const gracefulShutdown = async () => {
    console.log('🛑 Shutting down...');
    await disconnectDB();
    if (server) {
        server.close(() => {
            console.log('💤 Server closed');
            process.exit(0);
        });
    } else {
        process.exit(0);
    }
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
process.on('unhandledRejection', (err) => {
    console.error('❗ Unhandled Rejection:', err);
    gracefulShutdown();
});
process.on('uncaughtException', (err) => {
    console.error('❗ Uncaught Exception:', err);
    gracefulShutdown();
});