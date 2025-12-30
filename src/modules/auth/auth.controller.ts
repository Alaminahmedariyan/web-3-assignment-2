import { Request, Response } from "express";
import { authServices } from "./auth.service";

// controller function to create a new user
const signupUser = async (req: Request, res: Response) => {
  try {
    const user = req.body;
    const result = await authServices.signupUser(user);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Error creating user",
      error: err.message,
    });
  }
};

const signinUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await authServices.signinUser(email, password);
    res.status(201).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Error creating user",
      error: err.message,
    });
  }
};

export const authController = {
  signupUser,
  signinUser,
};
