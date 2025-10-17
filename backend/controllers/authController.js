import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { crearUsuario, buscarUsuarioPorEmail } from "../models/usuarios.js";

export async function register(req, res) {
  try {
    const { nombre, apellido, email, password } = req.body;

    if (!nombre || !apellido || !email || !password) {
      return res.status(400).json({ msg: "Todos los campos son obligatorios" });
    }

    const usuarioExistente = await buscarUsuarioPorEmail(email);
    if (usuarioExistente) {
      return res.status(400).json({ msg: "El correo ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await crearUsuario(nombre, apellido, email, hashedPassword);

    return res.status(201).json({ success: true, msg: "Usuario registrado con éxito", id: userId });

  } catch (error) {
    return res.status(500).json({ msg: "Error en el servidor", error: error.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Todos los campos son obligatorios" });
    }

    const usuario = await buscarUsuarioPorEmail(email);
    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    const passwordCorrecto = await bcrypt.compare(password, usuario.password);
    if (!passwordCorrecto) {
      return res.status(401).json({ msg: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.json({
      success: true,
      msg: "Login exitoso",
      token,
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email },
    });
  } catch (error) {
    return res.status(500).json({ msg: "Error en el servidor", error: error.message });
  }
}
