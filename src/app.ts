import express, { Application, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import compression from 'compression';

// Your imports
import router from './app/routes';
import env from './app/config/env';
import sendResponse from './app/utils/sendResponse';
import { globalErrorHandler, notFound } from './app/middleware';
import { setupSwagger } from './app/docs/swagger';

const app: Application = express();

// 1. SECURITY & PERFORMANCE MIDDLEWARE
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));

// General rate limiting
const generalRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000,
    message: 'Too many requests, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

// 2. CORS SETUP
const allowedOrigins = env.allowedOrigins.length
    ? env.allowedOrigins
    : ['https://quick-hire-console.vercel.app', 'http://localhost:3000'];

const corsOptions = {
    origin: allowedOrigins,
    credentials: true,
};

// 3. GENERAL MIDDLEWARE
app.use(generalRateLimit);
app.use(cors(corsOptions));

// Explicitly handle preflight OPTIONS requests
app.options('*', cors(corsOptions));

// 4. BODY PARSERS
app.use(express.json({
    limit: '200mb',
    verify: (req: Request, res: Response, buf: Buffer) => {
        (req as Request & { rawBody?: string }).rawBody = buf.toString();
    }
}));
app.use(express.urlencoded({ extended: true, limit: '200mb' }));
app.use(cookieParser());

// 5. STATIC FILES
app.use(express.static('public'));

// 6. ROUTES
app.use('/api', router);

// Swagger / OpenAPI docs
setupSwagger(app);

// 7. HEALTH CHECK
app.get('/health', (req: Request, res: Response) => {
    const client = req.headers['user-agent']?.toLowerCase();
    const getClientMessage = (clientType: string) =>
        `Welcome to QuickHire ${env.NODE_ENV === 'development' ? 'Development' : 'Production'} API! call from ${clientType}`;

    const responseData = {
        version: env.version,
        environment: env.NODE_ENV,
        apiPath: req.originalUrl,
    };

    if (client?.includes('postman') || client?.includes('mobile') || client?.includes('mozilla')) {
        return sendResponse(req, res, {
            statusCode: 200,
            success: true,
            message: getClientMessage(client),
            data: responseData,
        });
    }

    return sendResponse(req, res, {
        statusCode: 200,
        success: true,
        message: 'Welcome to QuickHire API!',
        data: responseData,
    });
});

// 8. ERROR HANDLERS (Must be last)
app.use(globalErrorHandler);
app.use(notFound);

export default app;