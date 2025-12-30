import { pool } from "../../config/db";

/* ================================
   1. CREATE BOOKING
================================ */
const createBooking = async (payload: any) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  // 1️⃣ Vehicle check
  const vehicleResult = await pool.query(
    `SELECT vehicle_name, daily_rent_price, availability_status 
     FROM vehicles WHERE id = $1`,
    [vehicle_id]
  );

  if (vehicleResult.rows.length === 0) {
    throw new Error("Vehicle not found");
  }

  const vehicle = vehicleResult.rows[0];

  if (vehicle.availability_status !== "available") {
    throw new Error("Vehicle is not available");
  }

  // 2️⃣ Date calculation
  const start = new Date(rent_start_date);
  const end = new Date(rent_end_date);

  const days = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);

  if (days <= 0) {
    throw new Error("End date must be after start date");
  }

  const total_price = days * vehicle.daily_rent_price;

  // 3️⃣ Insert booking
  const bookingResult = await pool.query(
    `
    INSERT INTO bookings 
    (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
    VALUES ($1,$2,$3,$4,$5,'active')
    RETURNING *
    `,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]
  );

  // 4️⃣ Update vehicle status
  await pool.query(
    `UPDATE vehicles SET availability_status='booked' WHERE id=$1`,
    [vehicle_id]
  );

  const booking = bookingResult.rows[0];

  // 5️⃣ EXACT requirement response shape
  return {
    ...booking,
    rent_start_date: rent_start_date,
    rent_end_date: rent_end_date,
    total_price: Number(total_price),
    vehicle: {
      vehicle_name: vehicle.vehicle_name,
      daily_rent_price: vehicle.daily_rent_price,
    },
  };
};
/* ================================
   2. GET ALL BOOKINGS
================================ */
const getAllBookings = async (userId: number, role: string) => {
  let query = "";
  let params: any[] = [];

  if (role === "admin") {
    query = `
      SELECT b.*, u.name AS customer_name, u.email AS customer_email, v.vehicle_name, v.registration_number
      FROM bookings b
      JOIN users u ON b.customer_id = u.id
      JOIN vehicles v ON b.vehicle_id = v.id
      ORDER BY b.id DESC`;
  } else {
    query = `
  SELECT 
    b.*, 
    v.vehicle_name, 
    v.registration_number,
    v.type
  FROM bookings b
  JOIN vehicles v ON b.vehicle_id = v.id
  WHERE b.customer_id = $1
  ORDER BY b.id DESC`;
    params = [userId];
  }

  const result = await pool.query(query, params);
  const formattedBookings = [];

  for (let i = 0; i < result.rows.length; i++) {
    const res = result.rows[i];

    const baseBooking: any = {
      id: res.id,
      customer_id: res.customer_id,
      vehicle_id: res.vehicle_id,
      rent_start_date: new Date(res.rent_start_date)
        .toISOString()
        .split("T")[0],
      rent_end_date: new Date(res.rent_end_date).toISOString().split("T")[0],
      total_price: Number(res.total_price),
      status: res.status,
    };

    // 🔵 ADMIN RESPONSE
    if (role === "admin") {
      baseBooking.customer = {
        name: res.customer_name,
        email: res.customer_email,
      };

      baseBooking.vehicle = {
        vehicle_name: res.vehicle_name,
        registration_number: res.registration_number,
      };
    }

    // 🟢 CUSTOMER RESPONSE
    if (role === "customer") {
      baseBooking.vehicle = {
        vehicle_name: res.vehicle_name,
        registration_number: res.registration_number,
        type: res.type,
      };
    }

    formattedBookings.push(baseBooking);
  }

  return formattedBookings;
};

const updateBookingStatus = async (
  bookingId: number,
  status: string,
  user: any
) => {
  const bookingCheck = await pool.query(
    "SELECT * FROM bookings WHERE id = $1",
    [bookingId]
  );

  if (bookingCheck.rows.length === 0) throw new Error("Booking not found");
  const booking = bookingCheck.rows[0];

  if (user.role === "customer") {
    if (booking.customer_id !== user.id) {
      throw new Error("Unauthorized");
    }

    if (status !== "cancelled") {
      throw new Error("Customer can only cancel booking");
    }

    const today = new Date();
    const startDate = new Date(booking.rent_start_date);

    if (today >= startDate) {
      throw new Error("Cannot cancel after rent start date");
    }
  }

  if (user.role === "admin") {
    if (status !== "returned" && status !== "cancelled")
      throw new Error("Invalid status");
  }

  const updatedRes = await pool.query(
    "UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *",
    [status, bookingId]
  );

  if (status === "returned" || status === "cancelled") {
    await pool.query(
      "UPDATE vehicles SET availability_status = 'available' WHERE id = $1",
      [booking.vehicle_id]
    );
  }

  const res = updatedRes.rows[0];

  const finalData: any = {
    id: res.id,
    customer_id: res.customer_id,
    vehicle_id: res.vehicle_id,
    rent_start_date: new Date(res.rent_start_date).toISOString().split("T")[0],
    rent_end_date: new Date(res.rent_end_date).toISOString().split("T")[0],
    total_price: Number(res.total_price),
    status: res.status,
  };

  if (status === "returned") {
    finalData.vehicle = { availability_status: "available" };
  }

  return finalData;
};

export const bookingServices = {
  createBooking,
  getAllBookings,
  updateBookingStatus,
};
export default bookingServices;
