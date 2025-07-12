# 💰 Cashence Wallet App

Monitor your personal expenses and manage your budget effortlessly with this full-stack Wallet App! Built using **React Native** for the mobile frontend and **Node.js, Express, and PostgreSQL** for the backend, this app offers a reliable and smooth experience for tracking your financial activities on the go.

---

## ✨ Features

* **User-Friendly Interface**: A clean, intuitive UI for adding and viewing expenses.
* **Expense Management**: Record income and expenses with descriptions and categories.
* **User Authentication**: Secure login and signup functionality.
* **RESTful API Integration**: Real-time communication with the backend for accurate data syncing.

---

## 🛠️ Tech Stack

* **React Native**: Cross-platform mobile development with a single codebase.
* **Node.js & Express.js**: Fast and scalable backend services.
* **PostgreSQL**: Powerful and structured relational database for storing financial data.

---

## 📁 Folder Structure
bash
Copy
Edit
/wallet-app
  ├── /client             # React Native frontend
  └── /server             # Node.js + Express + PostgreSQL backend

## 🚀 Getting Started

### 🔧 Backend Setup (Node.js + PostgreSQL)

1. Navigate to the `server` directory:

   ```bash
   cd server
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Configure environment variables (e.g., PostgreSQL connection URI) in a `.env` file.
4. Start the backend server:

   ```bash
   npm run dev
   ```

---

### 📱 Frontend Setup (React Native)

1. Navigate to the `client` directory:

   ```bash
   cd client
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Start the Expo development server:

   ```bash
   npx expo start
   ```
4. Use the Expo Go app (iOS/Android) to scan the QR code and run the app on your mobile device.

---

## 🔗 API Overview

* `GET /api/transactions` - Fetch all expense transactions
* `POST /api/transactions` - Add a new expense or income
* `GET /api/transactions/:id` - Get a transaction by ID
* `POST /api/auth/register` - Register a new user
* `POST /api/auth/login` - Login user

---

## 🤝 Contributions

Contributions are highly encouraged! If you have suggestions or feature ideas, feel free to open an issue or submit a pull request.

---

## 🙌 Acknowledgments

Thanks to the open-source community behind **React Native**, **Express**, and **PostgreSQL** for their powerful and accessible development tools.

---

Let me know if you'd like me to include screenshots or badges in this version too!
