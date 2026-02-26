import { checkDatabaseConnection } from "../db/index.js";

const API_NAME = "backend-woow";
const API_VERSION = "1.0.0";

export interface HealthStatus {
  status: "ok" | "degraded";
  message: string;
  api: {
    name: string;
    version: string;
  };
  database: "ok" | "down";
  timestamp: string;
}

export async function getHealthStatus(): Promise<HealthStatus> {
  const dbOk = await checkDatabaseConnection();
  const status: HealthStatus["status"] = dbOk ? "ok" : "degraded";
  const message = dbOk
    ? "Servicio en funcionamiento"
    : "Servicio en funcionamiento con base de datos no disponible";

  return {
    status,
    message,
    api: {
      name: API_NAME,
      version: API_VERSION,
    },
    database: dbOk ? "ok" : "down",
    timestamp: new Date().toISOString(),
  };
}
