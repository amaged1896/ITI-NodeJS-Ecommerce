import { catchAsync } from "../../utils/catchAsync.js";
import { CouponModel } from './../../../DB/model/coupon.model.js';
import { AppError } from './../../utils/appError.js';
import { CartModel } from './../../../DB/model/cart.model.js';
import { ProductModel } from './../../../DB/model/product.model.js';
import { OrderModel } from './../../../DB/model/order.model.js';
import { createInvoice } from './../../utils/pdfTemplate.js';
import { fileURLToPath } from "url";
import { clearCart, updateStock } from "./order.service.js";
import { sendEmail } from "../../utils/email.js";
import { sendData } from './../../utils/sendData.js';
import cloudinary from './../../utils/cloud.js';

import path from 'path';
import Stripe from "stripe";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const createOrder = catchAsync(async (req, res, next) => {
    const { address, coupon, phone, payment } = req.body;
    // check coupon
    let checkCoupon;
    if (coupon) {
        checkCoupon = await CouponModel.findOne({ code: coupon, expiredAt: { $gt: Date.now() } });
        if (!coupon) return next(new AppError("Invalid coupon", 400));
    }
    // check cart
    const cart = await CartModel.findOne({ user: req.user._id });
    const products = cart.products;
    if (products.length < 1) return next(new AppError("Empty Cart!", 400));

    let orderProducts = [];
    let orderPrice = 0;

    // check products 
    for (let i = 0; i < products.length; i++) {
        // check products existence
        const product = await ProductModel.findById(products[i].productId);
        if (!product) return next(new AppError(`Product ${products[i].productId} is not found`, 400));
        // check product stock
        if (!product.checkStock(products[i].quantity))
            return next(new AppError(`${product.name} out of stock, only ${product.availableItems} items are left`));

        orderProducts.push({
            productId: product._id,
            quantity: products[i].quantity,
            name: products.name,
            itemPrice: product.finalPrice,
            totalPrice: products[i].quantity * product.finalPrice
        });
        orderPrice += products[i].quantity * product.finalPrice;
    }

    // create order
    const order = await OrderModel.create({
        user: req.user._id,
        products: orderProducts,
        address,
        phone,
        coupon: {
            id: checkCoupon?._id,
            name: checkCoupon?.name,
            discount: checkCoupon?.discount
        },
        payment,
        price: orderPrice

    });
    // generate invoice
    const user = req.user;
    const invoice = {
        shipping: {
            name: user.userName,
            address: order.address,
            country: "Egypt",
        },
        items: order.products,
        subtotal: order.price,
        paid: order.finalPrice,
        invoice_nr: order._id
    };

    const pdfPath = path.join(__dirname, `./../../../invoiceTemp/${order._id}.pdf`);
    createInvoice(invoice, pdfPath);

    // upload cloudinary
    const { secure_url, public_id } = await cloudinary.uploader.upload(pdfPath,
        { folder: `${process.env.FOLDER_CLOUD_NAME}/order/invoice/${user._id}` });

    // add invoice to order 
    order.invoice = { id: public_id, url: secure_url };
    await order.save();
    // send email invoice
    const isSent = await sendEmail({
        email: user.email,
        subject: "Order Invoice",
        attachments: [{
            path: secure_url,
            contentType: "application/pdf"
        }]
    });
    if (isSent) {
        // update stock
        updateStock(order.products, true);
        // clear cart
        clearCart(user._id);
    }

    if (payment == 'visa') {
        // payment 
        console.log(process.env.STRIPE_KEY);
        const stripe = new Stripe(process.env.STRIPE_KEY);
        let existCoupon;
        if (order.coupon.name !== undefined) {
            existCoupon = await stripe.coupons.create({
                percent_off: order.coupon.discount,
                duration: "once"
            });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            success_url: process.env.SUCCESS_URL,
            cancel_url: process.env.CANCEL_URL,
            line_items: await Promise.all(order.products.map(async (product) => {
                let productId = await ProductModel.findById(product.productId);
                console.log(productId);
                return {
                    price_data: {
                        currency: "egp",
                        product_data: {
                            name: productId?.name,
                            images: [productId.images[0].url]
                        },
                        unit_amount: product.itemPrice * 100
                    },
                    quantity: product.quantity
                };
            })),
            discounts: existCoupon ? [{ coupon: existCoupon.id }] : []
        });

        return res.status(200).json({ status: "success", results: session.url });
    }

    // return response
    sendData(200, "success", "Order placed successfully!, check email for invoice.", undefined, res);
});

export const cancelOrder = catchAsync(async (req, res, next) => {
    const order = await OrderModel.findById(req.params.orderId);
    if (!order) return next(new AppError("order not found!", 400));

    if (order.status === "shipped" || order.status === "delivered") {
        return next(new AppError("can't cancel order!"));
    }

    order.status = "canceled";
    await order.save();

    updateStock(order.products, false);

    sendData(200, "success", "order canceled successfully!", undefined, res);
});