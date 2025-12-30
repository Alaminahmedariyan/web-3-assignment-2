import { Router } from "express";
import auth from "../../middleware/auth";
import { Roles } from "./auth.constant";
import { userController } from "./user.controller";

const router = Router();

router.get("/", auth(Roles.ADMIN), userController.getAllUsers);
router.put("/:userId", auth(Roles.ADMIN , Roles.CUSTOMER), userController.updateUser);
router.delete("/:userId", auth(Roles.ADMIN), userController.deleteUser);

export const userRoutes = router;