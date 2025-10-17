import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

let db;

export async function connectDB() {
  if (!db) {
    try {
      db = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
      });
      console.log("✅ Conectado a la base de datos:", process.env.DB_NAME);
    } catch (error) {
      console.error("❌ Error al conectar DB:", error.message);
      process.exit(1);
    }
  }
  return db;
}

export default db;
