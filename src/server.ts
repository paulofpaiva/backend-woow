import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes/index";

const app = express();
const port = process.env.PORT ?? 3000;

app.use(cors({ credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(routes);

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
