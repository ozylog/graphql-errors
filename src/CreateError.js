// @flow

'use strict';

export default class CreateError extends Error {
  type: string;
  message: string;
  createdAt: Date;
  constructor(type: string, message: string) {
    super();

    this.type = type;
    this.message = message;
    this.createdAt = new Date();
  }
}
