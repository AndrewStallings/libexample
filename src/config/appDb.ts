import "server-only";

import { drizzle } from "drizzle-orm/node-mssql";
import { createAuditLogRepository, type AuditLogRepository } from "our-lib";

const getRequiredEnv = (name: string, fallbackValue: string) => {
  return process.env[name] ?? fallbackValue;
};

const createAppConnectionString = () => {
  const server = getRequiredEnv("APP_DB_SERVER", "localhost");
  const database = getRequiredEnv("APP_DB_DATABASE", "LibraryExample");
  const user = getRequiredEnv("APP_DB_USER", "library_user");
  const password = getRequiredEnv("APP_DB_PASSWORD", "library_password");
  const port = getRequiredEnv("APP_DB_PORT", "1433");
  const encrypt = getRequiredEnv("APP_DB_ENCRYPT", "false");
  const trustServerCertificate = getRequiredEnv("APP_DB_TRUST_SERVER_CERTIFICATE", "true");

  return `Server=${server},${port};Database=${database};User Id=${user};Password=${password};Encrypt=${encrypt};TrustServerCertificate=${trustServerCertificate};`;
};

type AppDb = {
  auditLogs: AuditLogRepository;
};

let appDb: AppDb | undefined;

export const getAppDb = () => {
  appDb ??= {
    auditLogs: createAuditLogRepository(
      drizzle({
        connection: createAppConnectionString(),
      }),
    ),
  };

  return appDb;
};
