import joi from 'joi';
import { isValidObjectId } from '../../middleware/validation.js';

export const createOrderSchema = joi.object({
    address: joi.string().min(10).required(),
    coupon: joi.string().length(5),
    phone: joi.string().length(11).required(),
    payment: joi.string().valid("cash", "visa").required(),
}).required();

export const cancelOrderSchema = joi.object({
    orderId: joi.string().custom(isValidObjectId).required()
});