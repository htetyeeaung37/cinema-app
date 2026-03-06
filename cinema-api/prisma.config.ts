import path from "path";
import { defineConfig } from "prisma/config";
import Database from "better-sqlite3";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  earlyAccess: true,
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    url: process.env.DATABASE_URL!,
  },
  migrate: {
    async adapter() {
      const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
      const dbPath = process.env.DATABASE_URL!.replace(/^file:/, "");
      
      // ✅ cinema-api folder ကို base ယူ
      const absolutePath = path.resolve(process.cwd(), dbPath);
      const sqlite = new Database(absolutePath);
      return new PrismaBetterSqlite3(sqlite);
    },
  },
});