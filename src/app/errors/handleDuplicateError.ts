/* eslint-disable @typescript-eslint/no-explicit-any */

import { TErrorSources, TGenericErrorResponse } from '../interfaces/error';

const handleDuplicateError = (err: any): TGenericErrorResponse => {
    // Extract value within double quotes using regex
    const match = err.message.match(/"([^"]*)"/);
    const duplicateKey = Object.keys(err.keyValue)[0];

    // The extracted value will be in the first capturing group
    const extractedMessage = match && match[1];

    const errorSources: TErrorSources = [
        {
            path: duplicateKey,
            message: `${extractedMessage} is already exists`,
        },
    ];

    const statusCode = 409;

    return {
        statusCode,
        message: 'Mongoose Duplicate Error',
        errorSources,
    };
};

export default handleDuplicateError;
