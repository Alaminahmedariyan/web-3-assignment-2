import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../../config/db";
import config from "../../config/index";

// Service to sign up a new user
const signupUser = async (payload: any) => {
  const { name, email, password, phone, role } = payload;
  const hashPassword = await bcrypt.hash(password as string, 12);
  const result = await pool.query(
    "INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [name, email, hashPassword, phone, role]
  );
 delete result.rows[0].password;
    return result;
};
// Service to sign in an existing user
const signinUser = async(userEmail: string, password: string) => {
     const user = await pool.query("SELECT * FROM users WHERE email = $1", [userEmail]);
     const { id, name, email, phone, role } = user.rows[0];
   const jwtSecret = config.jwt_secret as string;
    if (user.rows.length === 0) {
        throw new Error("User not found");
    }
    const matchPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!matchPassword) {
        throw new Error("Invalid password");
    };
    const jwtPayload = {id: id, name: name,email: email, role: role};
    const token = jwt.sign(jwtPayload, jwtSecret, { expiresIn: "1h" });
    return { token, user:{ id, name, email, phone, role } };
};

export const authServices = {
  signupUser,
    signinUser
};