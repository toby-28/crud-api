import cluster from "cluster";
import os from "os";
import http from "http";
import { fork } from "child_process";
import dotenv from "dotenv";

dotenv.config();

const PORT = Number(process.env.PORT) || 4000;
const numCPUs = os.availableParallelism
  ? os.availableParallelism() - 1
  : os.cpus().length - 1;

if (cluster.isPrimary) {
  const workers: number[] = [];
  for (let i = 0; i < numCPUs; i++) {
    workers.push(PORT + i + 1);
    fork("./dist/app.js", [], {
      env: { PORT: (PORT + i + 1).toString() },
    });
  }

  let current = 0;
  http
    .createServer((req, res) => {
      const targetPort = workers[current];
      console.log(`Forwarding request to port ${targetPort}`);
      const proxyReq = http.request(
        {
          hostname: "localhost",
          port: targetPort,
          path: req.url,
          method: req.method,
          headers: req.headers,
        },
        (proxyRes) => {
          res.writeHead(proxyRes.statusCode || 500, proxyRes.headers);
          proxyRes.pipe(res, { end: true });
        }
      );

      req.pipe(proxyReq, { end: true });
      current = (current + 1) % workers.length;
    })
    .listen(PORT, () => {
      console.log(`Load balancer listening on port ${PORT}`);
    });
}
