import http from "http";
import dotenv from "dotenv";
import { handleRequest } from "./routes/users.js";

dotenv.config();
const PORT = Number(process.env.PORT) || 4000;

export const app = http.createServer(handleRequest);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
