// Type ORM util to query data directly from database. Till the time we update the stuff to typescript.

import { getConnection, getManager } from "typeorm";

// Make raw query
/**
 * @param query
 * @param params
 */
export const makRawQuery = async (
  query: string,
  params: any = undefined,
): Promise<any> => {
  const entityManager = getManager();
  return entityManager.query(query, params);
};

/**
 * generate a new transaction query runner via typeorm
 * @returns transaction query runner instance
 */
export const getTransactionQueryRunner = async () => {
  const connection = getConnection();
  const queryRunner = connection.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  return queryRunner;
};
