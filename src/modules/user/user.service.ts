import bcrypt from "bcryptjs";
import { pool } from "../../config/db";

// get all users service 
const getAllUsers = async () => {
    const result = await pool.query("SELECT id, name, email, phone, role FROM users");
    return result;
};
// update user service
const updateUser = async (userId: number, payload: any) => {
  const { name, email, phone, role } = payload;

  const result = await pool.query(
    `UPDATE users 
     SET name = COALESCE($1, name), 
         email = COALESCE($2, email), 
         phone = COALESCE($3, phone), 
         role = COALESCE($4, role) 
     WHERE id = $5 
     RETURNING id, name, email, phone, role`,
    [name || null, email || null, phone || null, role || null, userId]
  );

  return result;
};
// delete user service
const deleteUser = async (userId: number) => {
    const result = await pool.query("DELETE FROM users WHERE id = $1", [userId]);
    return result;
  };

export const userServices = {
    getAllUsers,
    updateUser,
    deleteUser
}