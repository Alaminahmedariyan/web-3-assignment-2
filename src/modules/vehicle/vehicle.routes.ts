import express from "express";
import { VehicleControllers } from "./vehicle.controller";
import auth from "../../middleware/auth";
import { Roles } from "../user/auth.constant";

const router = express.Router();


router.post("/", auth(Roles.ADMIN), VehicleControllers.createVehicle);

router.get("/", auth(Roles.ADMIN, Roles.CUSTOMER), VehicleControllers.getAllVehicles);

router.get("/:vehicleId", auth(Roles.ADMIN, Roles.CUSTOMER), VehicleControllers.getSingleVehicle);

router.put("/:vehicleId", auth(Roles.ADMIN),VehicleControllers.updateVehicle);

router.delete("/:vehicleId", auth(Roles.ADMIN),VehicleControllers.deleteVehicle);

export const vehicleRoutes = router;