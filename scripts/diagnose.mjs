import "dotenv/config";
import net from "node:net";
import mysql from "mysql2/promise";

const port = Number(process.env.PORT || 3000);
const databaseUrl = process.env.DATABASE_URL;

console.log("=== Jornada do Aprender: diagnóstico ===");
console.log(`Porta configurada: ${port}`);
console.log(`DATABASE_URL: ${databaseUrl ? "configurada" : "AUSENTE"}`);

if (!databaseUrl) {
  console.error("ERRO: crie um arquivo .env com DATABASE_URL no computador servidor.");
  process.exitCode = 1;
} else {
  try {
    const connection = await mysql.createConnection(databaseUrl);
    await connection.query("SELECT 1 AS ok");
    await connection.end();
    console.log("MySQL: conexão OK");
  } catch (error) {
    console.error(`MySQL: falha (${error instanceof Error ? error.message : String(error)})`);
    process.exitCode = 1;
  }
}

const server = net.createServer();
await new Promise((resolve) => {
  server.once("error", (error) => {
    if (error.code !== "EADDRINUSE") {
      console.error(`Porta ${port}: indisponível (${error.code || error.message})`);
      process.exitCode = 1;
      resolve();
      return;
    }

    const probe = net.createConnection({ host: "127.0.0.1", port });
    probe.once("connect", () => {
      console.log(`Porta ${port}: já está em uso por um servidor ativo`);
      probe.end(resolve);
    });
    probe.once("error", () => {
      console.error(`Porta ${port}: ocupada, mas não respondeu como servidor`);
      process.exitCode = 1;
      resolve();
    });
  });
  server.listen(port, "0.0.0.0", () => {
    console.log(`Porta ${port}: disponível em 0.0.0.0`);
    server.close(resolve);
  });
});

if (process.exitCode) {
  console.error("Diagnóstico concluído com problemas.");
} else {
  console.log("Diagnóstico concluído sem problemas.");
}
