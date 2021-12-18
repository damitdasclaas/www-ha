import webApp from "./src/app.js";
import * as sqlite from "sqlite";
import sqlite3 from "sqlite3";

const port = 3000;

(async () => {
  const db = await sqlite.open({
    filename: "./data/database.sqlite",
    driver: sqlite3.Database,
  });
  const config = { port, db };
  await webApp(config);
})();
