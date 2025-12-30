import { pool } from "../../config/db";
// ------------------ create Vehicle ---------------------
const createVehicle = async (payload: Record<string, unknown>) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;
  // const hashedPass = await bcrypt.hash(password as string, 10);
  const result = await pool.query(
    `INSERT INTO Vehicles( vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );
  return result;
};
// ----------------------------- get all Vehicles ---------------------
const getAllVehicles = async () => {
  const result = await pool.query(`SELECT * FROM Vehicles`);
 
  return result;
};

// ----------------------- get single Vehicle ---------------------
const getSingleVehicle = async (id: string) => {
  const result = await pool.query(`SELECT * FROM Vehicles WHERE id = $1`, [id]);
  return result;
};
// -------------------------- update Vehicle --------------------
const updateVehicle = async (id: string, data: Record<string, unknown>) => {
  const { vehicle_name, type, registration_number, daily_rent_price, availability_status} = data;
  const result = await pool.query(
    `UPDATE Vehicles SET vehicle_name = $1, type = $2, registration_number = $3, daily_rent_price = $4, availability_status = $5 WHERE id = $6 RETURNING *`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
      id,
    ]
  );
  return result;
};
// -------------------------------- delete Vehicle ----------------------------
const deleteVehicle = async (id: string) => {
  const result = await pool.query(`DELETE FROM Vehicles WHERE id = $1`, [id]);
  return result;
};
export const VehicleServices = {
  createVehicle,
  getAllVehicles,
  getSingleVehicle,
  updateVehicle,
  deleteVehicle,
};
