import {
  Connection,
  ConnectionManager,
  ConnectionOptions,
  createConnection,
  getConnectionManager,
} from "typeorm";

import { logger } from "../../logger/logger";
import getDefaultOrmConfig from "./ormConfig";

/**
 * Class - Manage database connections
 */

export class Database {
  private connectionManager: ConnectionManager;
  private config: any;

  constructor(config?: ConnectionOptions) {
    this.connectionManager = getConnectionManager();
    this.config = config;
  }

  public async getConnection(name: string): Promise<Connection> {
    const CONNECTION_NAME: string = name;
    let connection: Connection;
    const hasConnection = this.connectionManager.has(CONNECTION_NAME);
    if (hasConnection) {
      connection = this.connectionManager.get(CONNECTION_NAME);
      if (!connection.isConnected) {
        connection = await connection.connect();
      }
      logger.info("Connection found");
    } else {
      const ormConfig = getDefaultOrmConfig();
      connection = await createConnection(this.config || ormConfig);
      logger.info("New DB connection made");
    }
    return connection;
  }
}
