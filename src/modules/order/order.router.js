import express from 'express';
import { isAuthenticated } from './../../middleware/authentication.middleware.js';
import { isAuthorized } from './../../middleware/authorization.middleware.js';
import { isValid } from './../../middleware/validation.js';
import { cancelOrder, createOrder } from './order.controller.js';
import { cancelOrderSchema, createOrderSchema } from './order.validation.js';
const orderRouter = express.Router();



orderRouter.post("/", isAuthenticated, isValid(createOrderSchema), createOrder);


orderRouter.patch("/:orderId", isAuthenticated, isValid(cancelOrderSchema), cancelOrder);




export default orderRouter;