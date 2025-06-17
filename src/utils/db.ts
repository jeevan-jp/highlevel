import { getConnection, QueryRunner } from "typeorm";

export const getTransactiondueryRunner = async (): Promise<QueryRunner> => {
  const connection = getConnection();
  const queryRunner = connection.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  return queryRunner;
};
