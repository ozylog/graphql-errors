// @flow

'use strict';

type ErrorType = {
  type?: string,
  message?: any,
  createdAt?: Date,
  locations?: Array<Object>,
  path?: Array<string>,
  stack?: string
};

export default function formatError(fields?: Array<string>): ErrorType {
  if (fields && fields.constructor !== Array) throw new Error('Invalid param');

  return (error: Object): ErrorType => {
    const env: string = process.env.NODE_ENV || 'development';
    const format: ErrorType = {};

    if (fields) {
      for (const field: string of fields) {
        if (error[field] !== undefined) {
          Object.assign(format, {
            [field]: error[field]
          });
        }
      }
    } else {
      const {type, message, createdAt}: ErrorType = error;

      Object.assign(format, {
        type,
        message,
        createdAt
      });

      if (env === 'development') {
        const {path, locations, stack}: ErrorType = error;

        Object.assign(format, {
          path,
          locations,
          stack
        });
      }
    }

    return format;
  };
}
