import convict from 'convict';
import validator from 'convict-format-with-validator';

export type RestSchema = {
  PORT: number;
  SALT: string;
  DB_HOST: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_PORT: string;
  DB_NAME: string;
  UPLOAD_FILE_DIRECTORY: string;
};

convict.addFormats(validator);

export const restSchema = convict<RestSchema>({
  PORT: {
    doc: 'Port to bind.',
    format: 'port',
    default: 3000,
    env: 'PORT',
  },
  SALT: {
    doc: 'Salt for password hash',
    format: String,
    default: null,
    env: 'SALT',
  },
  DB_HOST: {
    doc: 'IP address of the database server (MongoDB)',
    format: 'ipaddress',
    env: 'DB_HOST',
    default: '127.0.0.1',
  },
  DB_USER: {
    doc: 'Username to connect to the database (MongoDB)',
    format: String,
    env: 'DB_USER',
    default: null,
  },
  DB_PASSWORD: {
    doc: 'Database password (MongoDB)',
    format: String,
    env: 'DB_PASSWORD',
    default: null,
  },
  DB_PORT: {
    doc: 'Database port (MongoDB)',
    format: String,
    env: 'DB_PORT',
    default: '27017',
  },
  DB_NAME: {
    doc: 'Database name (MongoDB)',
    format: String,
    env: 'DB_NAME',
    default: null,
  },
  UPLOAD_FILE_DIRECTORY: {
    doc: 'Upload file directory',
    format: String,
    env: 'UPLOAD_FILE_DIRECTORY',
    default: null,
  },
});
