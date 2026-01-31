# FinTracker

FinTracker is a comprehensive personal finance application designed to help you track your income, expenses, and savings goals. It features a modern, responsive user interface and a robust backend for secure data management.

![Dashboard Preview](frontend/src/assets/signup-image.png)

## Features

- **User Authentication**: Secure Signup and Login with email/password and social providers (Google/Apple).
- **Dashboard**: Visual overview of your financial health, including total balance, income, expenses, and savings.
- **Transactions Management**: detailed list of all your transactions with filtering and pagination.
- **Responsive Design**: Built with a mobile-first approach, ensuring a great experience on all devices.
- **Security**: Password hashing and secure API endpoints.

## Tech Stack

### Frontend
- **React** (Vite)
- **TypeScript**
- **Tailwind CSS**
- **Shadcn/UI** (Components)
- **Recharts** (Data Visualization)
- **React Router DOM** (Navigation)

### Backend
- **Go** (Golang)
- **Gin Web Framework**
- **MongoDB** (Database)

## Getting Started

### Prerequisites
- Node.js & npm
- Go (1.21+)
- MongoDB Atlas Account or Local MongoDB

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/gokul-d3v/FinTrack.git
    cd FinTrack
    ```

2.  **Frontend Setup**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

3.  **Backend Setup**
    ```bash
    cd backend
    # Create .env file with PORT, MONGO_URI, DB_NAME
    go mod tidy
    go run cmd/server/main.go
    ```

## License

MIT License
