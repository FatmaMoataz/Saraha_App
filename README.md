# Saraha App Backend 🚀

A backend project for a Saraha-style anonymous messaging app, built with **Node.js** and **Express.js**, focusing on authentication, validation, and security best practices.  

## ✨ Key Features
- **User Authentication:** JWT & Google OAuth  
- **Email Verification:** OTP sent via Nodemailer + Gmail  
- **Password Security:** Password hashing with Bcrypt.js  
- **Secure File Uploads:** Multer + Cloudinary integration  
- **Data Validation:** Using Joi for input validation  
- **Security Enhancements:** Rate limiting + Helmet  
- **Database:** MongoDB with Mongoose for data management  

## 📸 Screenshots
- Successful Sign Up request from Postman
- ![Image](https://github.com/user-attachments/assets/c71cec9e-50bf-4c4b-8ff4-abe950644066)
- Successful Confirm Email request with OTP  
- User data stored in MongoDB Compass  

## 💡 Skills Improved
This project helped strengthen skills in:
- API development with Node.js & Express.js  
- Authentication & Authorization practices  
- Database integration with MongoDB  
- Security best practices for web applications  

## 🛠️ Technologies Used
- Node.js & Express.js  
- MongoDB & Mongoose  
- JWT for authentication  
- Google OAuth  
- Nodemailer + Gmail for email OTP  
- Bcrypt.js for password hashing  
- Multer + Cloudinary for file uploads  
- Joi for validation  
- Helmet & Rate Limiting for security  

## 🚀 Getting Started
1. Clone the repository:

 ```bash
git clone https://github.com/FatmaMoataz/Saraha_App.git
```

2. Install dependencies:

```bash
npm install
```

3. Create a .env file with your environment variables:

- MONGO_URI=your_mongodb_uri

- JWT_SECRET=your_jwt_secret

- GMAIL_USER=your_gmail

- GMAIL_PASS=your_gmail_password

- CLOUDINARY_CLOUD_NAME=your_cloud_name

- CLOUDINARY_API_KEY=your_api_key

- CLOUDINARY_API_SECRET=your_api_secret

4. Run the server:

```bash
npm run start:dev
```
