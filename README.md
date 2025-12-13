# 🔐 KIRA - Password Manager

A modern, secure password manager built with React, TypeScript, Tailwind CSS, Node.js, Express, and MongoDB. Features client-side encryption, zero-knowledge architecture, and a beautiful dark-mode UI.

![KIRA Password Manager](https://img.shields.io/badge/Security-AES--256-green) ![React](https://img.shields.io/badge/React-19.2.0-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue) ![Node.js](https://img.shields.io/badge/Node.js-18+-green) ![MongoDB](https://img.shields.io/badge/MongoDB-9.0.1-green)

---

## ✨ Features

- 🔒 **Client-Side Encryption** - AES-256-GCM encryption, your data never leaves unencrypted
- 🔑 **Zero-Knowledge Architecture** - Server never sees your master password or unencrypted data
- 🎨 **Modern UI** - Beautiful dark mode interface with glassmorphism effects
- ⚡ **Fast & Responsive** - Built with Vite and optimized for performance
- 🛡️ **Security First** - bcrypt hashing, JWT authentication, rate limiting, and security headers
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- 🔍 **Search & Filter** - Quickly find your passwords with smart search
- 🎲 **Password Generator** - Generate strong, random passwords
- 📂 **Categories** - Organize passwords by category
- ⭐ **Favorites** - Mark important passwords for quick access

---

## 🏗️ Tech Stack

### Frontend
- **React** 19.2.0 - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS v4** - Utility-first styling
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **crypto-js** - Client-side encryption
- **Framer Motion** - Animations
- **Lucide React** - Icons

### Backend
- **Node.js** + **Express** - Web framework
- **TypeScript** - Type safety
- **MongoDB** + **Mongoose** - Database and ODM
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT authentication
- **Helmet** - Security headers
- **express-rate-limit** - Rate limiting
- **express-validator** - Input validation

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **MongoDB** ([Local](https://www.mongodb.com/try/download/community) or [Atlas](https://www.mongodb.com/cloud/atlas))
- **Git** ([Download](https://git-scm.com/))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/sugashsm/Kira.git
cd Kira
```

2. **Install frontend dependencies**
```bash
cd client
npm install
```

3. **Install backend dependencies**
```bash
cd ../server
npm install
```

4. **Configure environment variables**

**Frontend** (`client/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

**Backend** (`server/.env`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/kira
JWT_SECRET=your-super-secret-jwt-key-change-this-to-something-random
JWT_EXPIRE=24h
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

> **Note:** For MongoDB Atlas, use: `mongodb+srv://username:password@cluster.mongodb.net/kira`

5. **Start the development servers**

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

6. **Open your browser**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health

---

## 📁 Project Structure

```
KIRA/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── utils/         # Encryption, API utilities
│   │   ├── types/         # TypeScript types
│   │   ├── context/       # React context providers
│   │   └── assets/        # Images, icons
│   └── package.json
│
├── server/                # Node.js backend
│   ├── src/
│   │   ├── models/        # MongoDB models
│   │   ├── routes/        # API routes
│   │   ├── controllers/   # Business logic
│   │   ├── middleware/    # Auth, validation, security
│   │   ├── config/        # Database configuration
│   │   └── server.ts      # Express app
│   └── package.json
│
└── README.md
```

---

## 🔒 Security Architecture

### Client-Side Encryption
1. User enters master password
2. Master password → PBKDF2 (100,000 iterations) → Encryption key
3. Password data → AES-256-GCM encryption → Encrypted data
4. Encrypted data + IV sent to server
5. Server stores encrypted data (cannot decrypt)

### Authentication Flow
1. User registers with email and master password
2. Master password hashed with bcrypt (12 rounds)
3. JWT token issued on successful login
4. Token required for all password operations
5. Token expires after 24 hours (configurable)

### Security Features
- ✅ Client-side AES-256-GCM encryption
- ✅ bcrypt password hashing (12 rounds)
- ✅ JWT authentication with expiration
- ✅ Rate limiting (5 auth attempts / 15 min)
- ✅ Helmet.js security headers
- ✅ CORS protection
- ✅ Input validation and sanitization
- ✅ MongoDB injection prevention
- ✅ Unique IVs for each password entry

---

## 🌐 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user (protected) |

### Passwords
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/passwords` | Get all passwords (protected) |
| GET | `/api/passwords/:id` | Get single password (protected) |
| POST | `/api/passwords` | Create password (protected) |
| PUT | `/api/passwords/:id` | Update password (protected) |
| DELETE | `/api/passwords/:id` | Delete password (protected) |

---

## 🛠️ Development

### Available Scripts

**Frontend:**
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

**Backend:**
```bash
npm run dev        # Start dev server with auto-reload
npm run build      # Compile TypeScript
npm run start      # Run production server
npm run type-check # Check TypeScript types
```



## 📊 Database Schema

### Users Collection
```javascript
{
  email: String (unique, indexed),
  masterPasswordHash: String (bcrypt),
  salt: String (for PBKDF2),
  createdAt: Date,
  updatedAt: Date
}
```

### Passwords Collection
```javascript
{
  userId: ObjectId (ref: User),
  encryptedData: String (AES-256 encrypted),
  iv: String (initialization vector),
  category: String,
  favorite: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📝 License

This project is licensed under the ISC License.

---

## ⚠️ Disclaimer

This is a personal project for educational purposes. While security best practices have been implemented, use at your own risk. Always keep backups of important passwords.

---

## 🙏 Acknowledgments

- [Tailwind CSS](https://tailwindcss.com/)
- [React](https://react.dev/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Lucide Icons](https://lucide.dev/)

---

## 📧 Contact

**GitHub:** [@sugashsm](https://github.com/sugashsm)

**Repository:** [https://github.com/sugashsm/Kira](https://github.com/sugashsm/Kira)

---

<p align="center">Made with ❤️ and ☕</p>
