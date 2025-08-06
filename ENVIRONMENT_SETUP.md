# 🌍 CO2e Portal - Environment Setup Guide

This guide will help you set up the environment variables for the CO2e Portal application.

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)
```bash
# Run the setup script
./setup-env.sh
```

### Option 2: Manual Setup
```bash
# Copy environment templates
cp .env.example .env
cp Backend/.env.example Backend/.env

# Install dependencies
npm install
cd Backend && npm install && cd ..
```

## 📁 Project Structure

```
my-app/
├── .env                    # Frontend environment variables
├── .env.example           # Frontend environment template
├── Backend/
│   ├── .env               # Backend environment variables
│   └── .env.example       # Backend environment template
├── setup-env.sh           # Automated setup script
└── ENVIRONMENT_SETUP.md   # This file
```

## 🔧 Environment Variables

### Frontend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_BASE_URL` | Backend API URL | `http://localhost:5001` |
| `REACT_APP_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | `pk_test_...` |
| `REACT_APP_NAME` | Application name | `CO2e Portal` |
| `REACT_APP_VERSION` | Application version | `1.0.0` |

### Backend (.env)

#### Database
| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |

#### Authentication
| Variable | Description | Example |
|----------|-------------|---------|
| `JWT_SECRET` | JWT signing secret | `your_jwt_secret_key_here` |

#### Payment Processing
| Variable | Description | Example |
|----------|-------------|---------|
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | `whsec_...` |

#### Email Configuration
| Variable | Description | Example |
|----------|-------------|---------|
| `EMAIL_USER` | Gmail address | `your_email@gmail.com` |
| `EMAIL_PASS` | Gmail app password | `your_app_password` |
| `EMAIL_FROM` | From email address | `your_email@gmail.com` |
| `EMAIL_TO` | To email address | `your_email@gmail.com` |

#### File Storage
| Variable | Description | Example |
|----------|-------------|---------|
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `your_api_key` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `your_api_secret` |

#### Server Configuration
| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5001` |
| `NODE_ENV` | Environment | `development` |
| `FRONTEND_URL` | Frontend URL | `http://localhost:3000` |

## 🔐 Security Best Practices

### 1. JWT Secret
```bash
# Generate a strong JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 2. Gmail App Password
1. Go to your Google Account settings
2. Enable 2-factor authentication
3. Generate an App Password for "Mail"
4. Use this password in `EMAIL_PASS`

### 3. MongoDB Atlas
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Replace username/password in the URI

### 4. Stripe Keys
1. Create a Stripe account
2. Get your test keys from the dashboard
3. Use test keys for development

### 5. Cloudinary
1. Create a Cloudinary account
2. Get your cloud name, API key, and secret
3. Configure upload presets if needed

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd my-app
```

### 2. Run Setup Script
```bash
./setup-env.sh
```

### 3. Configure Environment Variables
Edit the `.env` files with your actual values:

```bash
# Frontend
nano .env

# Backend
nano Backend/.env
```

### 4. Install Dependencies
```bash
# Frontend dependencies
npm install

# Backend dependencies
cd Backend && npm install && cd ..
```

### 5. Start the Application
```bash
# Terminal 1: Start backend
cd Backend && npm start

# Terminal 2: Start frontend
npm start
```

## 🔍 Troubleshooting

### Common Issues

#### 1. "Module not found" errors
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### 2. MongoDB connection failed
- Check your `MONGODB_URI`
- Ensure your IP is whitelisted in MongoDB Atlas
- Verify username/password are correct

#### 3. Email not sending
- Check Gmail app password
- Ensure 2FA is enabled
- Verify email addresses are correct

#### 4. Stripe payments failing
- Check Stripe keys are correct
- Ensure you're using test keys for development
- Verify webhook configuration

#### 5. File uploads not working
- Check Cloudinary credentials
- Verify cloud name is correct
- Ensure API key/secret are valid

### Environment Variable Validation

```bash
# Check if all required variables are set
node -e "
const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');
const required = ['REACT_APP_API_BASE_URL'];
required.forEach(key => {
  if (!env.includes(key)) {
    console.log('Missing:', key);
  }
});
"
```

## 📝 Development vs Production

### Development
- Use test keys for all services
- Enable debug logging
- Use localhost URLs
- Set `NODE_ENV=development`

### Production
- Use live keys for all services
- Disable debug logging
- Use production URLs
- Set `NODE_ENV=production`
- Enable HTTPS
- Use secure cookies

## 🔄 Updating Environment Variables

### Adding New Variables
1. Add to `.env.example` files
2. Update this documentation
3. Update the setup script if needed

### Changing Values
1. Edit the `.env` files
2. Restart the application
3. Test the changes

## 📚 Additional Resources

- [React Environment Variables](https://create-react-app.dev/docs/adding-custom-environment-variables/)
- [Node.js Environment Variables](https://nodejs.org/en/docs/guides/environment-variables/)
- [MongoDB Atlas Setup](https://docs.atlas.mongodb.com/getting-started/)
- [Stripe Documentation](https://stripe.com/docs)
- [Cloudinary Documentation](https://cloudinary.com/documentation)

## 🆘 Support

If you encounter issues:
1. Check the troubleshooting section
2. Verify all environment variables are set
3. Check the console for error messages
4. Ensure all services are properly configured

---

**Remember**: Never commit `.env` files to version control! They contain sensitive information. 