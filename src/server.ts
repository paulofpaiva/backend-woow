import "dotenv/config";
import { readFileSync } from "fs";
import { join } from "path";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes/index";

const API_NAME = "API Woow Technology";
const pkg = JSON.parse(
  readFileSync(join(process.cwd(), "package.json"), "utf-8")
) as { version: string };
const API_VERSION = pkg.version;
const startupAt = new Date();
const dateStr = startupAt.toLocaleDateString("es-ES", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});
const timeStr = startupAt.toLocaleTimeString("es-ES", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

const app = express();
const port = process.env.PORT ?? 3000;

app.use(cors({ credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(routes);

app.listen(port, () => {
  console.log(`${API_NAME} v${API_VERSION}`);
  console.log(`Servidor escuchando en http://localhost:${port}`);
  console.log(`Inicio: ${dateStr}, ${timeStr}`);
});
