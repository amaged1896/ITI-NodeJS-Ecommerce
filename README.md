# E-Commerce Application API

## Introduction

This e-commerce application API is a comprehensive solution for building scalable, efficient, and feature-rich e-commerce platforms. Developed using a robust stack of technologies and packages including Node.js, Express, and MongoDB, the API is designed to handle a wide range of e-commerce operations, from user management to product catalog handling, shopping cart management, order processing, and more.

## Technologies & Packages

The API leverages the following technologies and packages:

- **Node.js & Express**: For creating a robust server-side application.
- **Mongoose**: Object Data Modeling (ODM) library for MongoDB and Node.js.
- **Joi**: Object schema validation.
- **jsonwebtoken**: For implementing JWT-based authentication.
- **multer**: Middleware for handling `multipart/form-data`, primarily used for uploading files.
- **nanoid**: For generating unique random IDs.
- **nodemailer**: For sending emails.
- **pdfkit**: For generating PDF documents.
- **slugify**: For generating slugs from strings (e.g., product titles).
- **voucher-code-generator**: For generating unique codes for coupons or vouchers.
- **bcryptjs**: For hashing passwords.
- **cloudinary**: For cloud-based image and video management.
- **dotenv**: For loading environment variables from a `.env` file.
- **cors**: For enabling Cross-Origin Resource Sharing.
- **express-rate-limit**: For basic rate-limiting middleware.
- **helmet**: For securing HTTP headers.
- **express-mongo-sanitize**: For preventing MongoDB operator injection.
- **xss-clean**: For cleaning user input to prevent XSS attacks.
- **hpp**: For protecting against HTTP Parameter Pollution attacks.
- **stripe**: For integrating payment processing capabilities.

## Database Models

The application uses the following database models:

- **Brand**: Represents manufacturers or brands.
- **Cart**: Manages shopping cart data.
- **Category**: Organizes products into categories.
- **Coupon**: Manages discount coupons.
- **Order**: Manages customer orders.
- **Product**: Contains product details.
- **Subcategory**: Represents subcategories within categories.
- **Token**: Manages tokens for activities like account activation and password reset.
- **User**: Manages user data and authentication.

## Controllers

The API includes various controllers to manage business logic:

### User Management

- `signup`
- `activateAccount`
- `login`
- `sendForgetCode`
- `resetPassword`

### Brand Management

- `createBrand`
- `updateBrand`
- `deleteBrand`
- `getAllBrands`

### Cart Management

- `addToCart`
- `getUserCart`
- `updateCart`
- `removeProductFromCart`
- `clearCart`

### Category Management

- `createCategory`
- `updateCategory`
- `deleteCategory`
- `getAllCategories`

### Coupon Management

- `createCoupon`
- `getAllCoupons`
- `updateCoupon`
- `deleteCoupon`

### Order Management

- `createOrder`
- `cancelOrder`
- `updateStock`

### Product Management

- `addProduct`
- `updateProduct`
- `deleteProduct`
- `getAllProducts`
- `getCategoryProducts`
- `getSingleProduct`

### Subcategory Management

- `createSubCategory`
- `updateSubCategory`
- `deleteSubCategory`
- `getAllSubCategory`

### Additional Features

- **Generate HTML for PDF email receipt**: Generates HTML templates for PDF-based email receipts.

### API Features

The API supports:

- **Find, Filter, Search, Sort, Limit Fields, Paginate**: Robust querying capabilities for handling complex data retrieval requirements.

### Error Handling Controllers

Refined for clarity and efficiency, our error handling mechanisms ensure comprehensive feedback and resolution guidance:

- **Database Errors**: Address issues like incorrect data types or invalid IDs (`handleCastErrorDB`), duplicate data (`handleDuplicateFieldsDB`), and validation failures (`handleValidationErrorDB`).
- **Authentication Errors**: Manage errors related to JWT authentication (`handleJWTError`) and expired tokens (`handleJWTExpiredError`).
- **Operational Errors**: Provide detailed error information in development (`sendErrorDev`) and tailor responses for production (`sendErrorProduction`), with a global catch-all (`globalErrorHandler`) for unhandled exceptions.

## Documentation

For a detailed overview of API endpoints, request and response formats, and interactive examples, please refer to our comprehensive [API Documentation on Postman](https://documenter.getpostman.com/view/25935609/2s9Yyy7J3o).

## Getting Started

To get started with this API:

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Set up your environment variables in a `.env` file. This should include your database connection string, Stripe secret key, Cloudinary credentials, and any other sensitive/configurable information required by the application.
4. Run the application using `npm start`. This will start your server and connect it to the database, making your API endpoints accessible via the specified port on localhost.

## Contribution

Contributions are welcome! If you have suggestions or want to contribute to the codebase, please feel free to open issues or submit pull requests. We're always looking for ways to improve the application and add new features.

## License

This project is unlicensed and free to use. You can copy, modify, distribute, and perform the work, even for commercial purposes, all without asking permission.

---

Please read the documentation carefully to understand how to use this API effectively. We hope this API serves as a robust foundation for your e-commerce platform development needs. Happy coding!
