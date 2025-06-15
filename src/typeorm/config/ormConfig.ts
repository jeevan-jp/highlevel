import dotenv from "dotenv";
import path from "path";
import { ConnectionOptions } from "typeorm";

dotenv.config({ path: path.join(__dirname, "../../../.env") });

/**
 * function to return default different variations of ORM config
 */
function getDefaultOrmConfig(): ConnectionOptions {
  const config: ConnectionOptions = {
    host: process.env.DB_HOST,
    type: "mysql",
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
      rejectUnauthorized: false,
    },
    legacySpatialSupport: false,
    synchronize: false,
    logging: false,
    entities: [
      path.join(__dirname, "../entities/**/*.ts"),
      path.join(__dirname, "../entities/**/*.js"),
    ],
    migrations: [path.join(__dirname, "../migrations/**/*.ts")],
    subscribers: [
      path.join(__dirname, "../subscribers/**/*.ts"),
      path.join(__dirname, "../subscribers/**/*.js"),
    ],
    cli: {
      entitiesDir: "src/typeorm/entities",
      migrationsDir: "src/typeorm/migrations",
      subscribersDir: "src/typeorm/subscribers",
    },
    extra: {
      connectionLimit: 20,
    },
  };

  return config;
}

export default getDefaultOrmConfig;
