import { connectDB } from "../config/db.js";

export async function crearUsuario(nombre, apellido, email, password) {
  const db = await connectDB();
  const [result] = await db.execute(
    "INSERT INTO usuarios (nombre, apellido, email, password) VALUES (?, ?, ?, ?)",
    [nombre, apellido, email, password]
  );
  return result.insertId;
}

export async function buscarUsuarioPorEmail(email) {
  const db = await connectDB();
  const [rows] = await db.execute(
    "SELECT * FROM usuarios WHERE email = ? LIMIT 1",
    [email]
  );
  return rows[0];
}
