# Environment Variables Setup

This document explains how to set up environment variables for the CO2e Portal application.

## Backend Environment Variables

Create a `.env` file in the `Backend/` directory with the following variables:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here

# Email Configuration (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_here
EMAIL_FROM=your_email@gmail.com
EMAIL_TO=your_email@gmail.com

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Server Configuration
PORT=5001
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

## Frontend Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# API Configuration
REACT_APP_API_BASE_URL=http://localhost:5001

# Stripe Configuration (if needed for frontend)
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# Other Frontend Configuration
REACT_APP_NAME=CO2e Portal
REACT_APP_VERSION=1.0.0
```

## Important Notes

1. **Never commit `.env` files to version control**
2. **Use different values for development and production**
3. **Keep your secrets secure**
4. **Restart your server after changing environment variables**

## Getting Started

1. Copy the `.env.example` file to `.env` in the Backend directory
2. Fill in your actual values
3. Create a `.env` file in the root directory for frontend
4. Restart both frontend and backend servers

## Security Best Practices

- Use strong, unique JWT secrets
- Use app passwords for Gmail (not your regular password)
- Rotate secrets regularly
- Use environment-specific configurations
