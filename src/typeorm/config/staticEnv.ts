import fs from "fs";
import path from "path";
import { logger } from "../../logger/logger";
import getDefaultOrmConfig from "./ormConfig";

async function getStaticEnv(): Promise<string> {
  const config = `const config = ${JSON.stringify(getDefaultOrmConfig())}; export default config;`;
  const filePath = path.join(__dirname, "tempTypeOrmEnv.ts");
  try {
    fs.writeFileSync(filePath, config, { encoding: "utf-8" });
  } catch (err: any) {
    logger.error(err.message);
  }
  return "Static Env Configured";
}

// tslint:disable-next-line
getStaticEnv().then(console.log).catch(console.log);
