// @flow

'use strict';

import CreateError from './CreateError';

type ErrorMessageType = {
  message: string,
  createdAt: string,
  data: any
};

type ErrorLPSType = {
  locations: Array<Object>,
  path: Array<string>,
  stack: string
};

type FormatErrorType = {
  message?: string,
  createdAt?: string,
  data?: any,
  locations?: Array<Object>,
  path?: Array<string>,
  stack?: string
};

function isOriginalError(error: Object): boolean {
  try {
    const obj: Object = JSON.parse(error.message);
    if ([obj.message, obj.createdAt, obj.data].includes(undefined)) throw new Error();
  } catch (err) {
    return true;
  }

  return false;
}

export default function formatError(fields?: Array<string>): Function {
  if (fields && fields.constructor !== Array) throw new Error('Invalid param');

  return (err: Object): FormatErrorType => {
    const error: Object = isOriginalError(err) ? new CreateError(err.message || 'Internal Server Error') : err;
    const errorMessage: ErrorMessageType = JSON.parse(error.message);
    const format: FormatErrorType = {};

    if (fields) {
      for (const field: string of fields) {
        if (['locations', 'path', 'stack'].includes(field)) {
          if (error[field] !== undefined) {
            Object.assign(format, {
              [field]: error[field]
            });
          }
        } else if (errorMessage[field] !== undefined) {
          Object.assign(format, {
            [field]: errorMessage[field]
          });
        }
      }
    } else {
      const env: string = process.env.NODE_ENV || 'development';

      Object.assign(format, errorMessage);

      if (env === 'development') {
        const {path, locations, stack}: ErrorLPSType = error;

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
