const dotenv = require("dotenv");

const envFound = dotenv.config();

if (envFound.error) {
  // This error should crash whole process
  throw new Error("@  Couldn't find .env file  @");
}

const { DB_NAME } = process.env;
const { DB_USER } = process.env;
const pass = process.env.DB_PASSWORD;

module.exports = {
  app_setting: {
    port: process.env.SERVER_PORT || 4000,
    appName: process.env.SERVER_NAME,
    env: process.env.NODE_ENV || "development",
  },
  db_setting: {
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT, 10),
    queueLimit: parseInt(process.env.DB_QUEUE_LIMIT, 10),
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    user: DB_USER,
    password: process.env.DB_PASSWORD,
    database: DB_NAME,
    connectTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT, 10),
    waitForConnections: process.env.DB_WAIT_FOR_CONNECTION || true,
    acquireTimeout: parseInt(process.env.DB_ACQUIRE_TIMEOUT),
    debug: process.env.DB_DEBUG || false,
  },
  auth: {
    jwt_secret:
      process.env.JWT_SECRET_KEY || "c++v!!!l000)()ddd()s@S(j(k(l(m()a)j)m",
    jwt_expiresin: process.env.JWT_EXPIRES_IN || "1h",
    jwt_auth_header_name: "authorization",
    jwt_auth_value_prefix: "Bearer",
    jwt_refresh_Secret:
      process.env.JWT_SECRET_KEY || "c++v!!!l000)()ddd()s@S(j(k(l(m()a)j)o",
    jwt_refresh_expiresin: process.env.JWT_REFRESH_EXPIRES_IN || "1",
    jwt_refresh_auth_header_name: "x-refresh-token",
  },
};
