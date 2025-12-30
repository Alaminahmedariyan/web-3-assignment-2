import express from "express";
import { bookingControllers } from "./booking.controller";
import { Roles } from "../user/auth.constant";
import auth from "../../middleware/auth";


const router = express.Router();


router.post("/", auth(Roles.ADMIN, Roles.CUSTOMER), bookingControllers.createBooking);
router.get("/", auth(Roles.ADMIN, Roles.CUSTOMER), bookingControllers.getAllBookings);
router.put("/:bookingId", auth(Roles.ADMIN, Roles.CUSTOMER), bookingControllers.updateBookingStatus);

export const bookingRoutes = router;