import express, { Application, Request, Response } from 'express';
import initDB from './config/db';
import { userRoutes } from './modules/user/user.route';
import { authRoutes } from './modules/auth/auth.route';
import { vehicleRoutes } from './modules/vehicle/vehicle.routes';
import { bookingRoutes } from './modules/booking/booking.route';
const app: Application = express();
app.use(express.json());// Middleware to parse JSON bodies

initDB(); // Initialize the database
// Sample route for testing purpose localhost:5000/
app.get('/', (req: Request, res: Response) => {
    res.send('Hello World');
});
// CRUD operations will be defined in their respective route files and imported here
app.use('/api/v1/users', userRoutes);  // User routes
app.use('/api/v1/auth', authRoutes);  // Auth routes
app.use('/api/v1/vehicles', vehicleRoutes); // Vehicle routes
app.use('/api/v1/bookings', bookingRoutes); // Booking routes
export default app;