import { AppError } from "./src/utils/appError.js";
import globalErrorHandler from "./src/utils/errorController.js";
import authRouter from './src/modules/auth/auth.router.js';
import categoryRouter from "./src/modules/category/category.router.js";
import subcategoryRouter from "./src/modules/subcategory/subcategory.router.js";
import brandRouter from './src/modules/brand/brand.router.js';
import productRouter from "./src/modules/product/product.router.js";
import couponRouter from "./src/modules/coupon/coupon.router.js";
import cartRouter from "./src/modules/cart/cart.router.js";
import orderRouter from "./src/modules/order/order.router.js";
import rateLimit from "express-rate-limit";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";

export const appRouter = (app, express) => {
    // Global Middleware 
    app.use(helmet());
    app.use(cors());
    const limiter = rateLimit({
        max: 100, // limit each IP to 100 requests per windowMs
        windowMs: 60 * 60 * 1000, // 1 hour
        message: "Too many requests from this IP, please try again after an hour!"
    });
    app.use('/api', limiter);
    app.use(express.json());

    // data sanitization against NoSQL query injection => clean data from malicious MongoDB operators
    app.use(mongoSanitize());

    // data sanitization against XSS => clean data from malicious HTML code
    app.use(xss());

    // auth
    app.use('/api/v1/auth', authRouter);

    // category
    app.use('/api/v1/category', categoryRouter);

    // subcategory
    app.use('/api/v1/subcategory', subcategoryRouter);

    // brand
    app.use('/api/v1/brand', brandRouter);

    // product
    app.use('/api/v1/product', productRouter);

    // coupon
    app.use('/api/v1/coupon', couponRouter);

    // cart
    app.use('/api/v1/cart', cartRouter);

    // order
    app.use('/api/v1/order', orderRouter);

    // not found page router
    app.all("*", (req, res, next) => {
        return next(new AppError('Page not found', 404));
    });
    // global error handling middleware
    app.use(globalErrorHandler);
};