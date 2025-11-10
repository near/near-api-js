import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ErrorMessagesJson = require('./error_messages.json');

export const ErrorMessages: { [error: string]: string } = ErrorMessagesJson;
