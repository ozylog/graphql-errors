// @flow

'use strict';

export default class CreateError extends Error {
  constructor(message: string, data: any = null) {
    super(JSON.stringify({
      message,
      data,
      createdAt: new Date()
    }));
  }
}
