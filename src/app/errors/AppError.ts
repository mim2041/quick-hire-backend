class AppError extends Error {
    public statusCode: number;
    public additionalData?: Record<string, unknown> | string | number | null;

    constructor(statusCode: number, message: string, additionalData?: Record<string, unknown> | string | number | null, stack = '') {
        super(message);
        this.statusCode = statusCode;
        this.additionalData = additionalData;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default AppError;