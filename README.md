# GB-Scrapper

A secure website that scrappes google and bing search results in one platform with robust authentication and session management system.

## Description

GB-Scrapper is a web scraping platform that retrieves search results from Google and Bing, built with NextJS, NodeJS, ExpressJS, Tailwind CSS, MongoDB, and Puppeteer. This project ensures efficient data retrieval with security features like JWT authentication, password hashing, CSRF protection, and query rate limiting.

## Features
- **Search Results Scrapping:** Retrieve search results from Google and Bing.
- **User Friendly Interface:** Clean and intuitive UI built with NextJS and Tailwind CSS.
- **User Authentication:** Secure login and registration system with Google OAuth support.
- **Security Measures:** Implements password hashing, CSRF protection, and rate limiting to ensure safe and efficient usage.
- **Real Time Updates:** Uses WebSocket to provide real-time updates on search results.
- **Session Management:** Manages user sessions and provides secure access to search results.

## Tech Stack

- **Frontend:** Next.js (React), Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Web Scraping:** Puppeteer
- **Real-time Communication:** Socket.io
- **Authentication:** Google OAuth
- **Other:** JWT, bcrypt, CSRF protection

## Getting Started

### Prerequisites

- Node.js version 16.16.0

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/hars008/GB-scrapper.git
   cd GB-scrapper
2. **Install frontend dependencies:**
   ```sh
    cd client
    npm install
    npm run dev
3. **Navigate to the API folder and install backend dependencies:**
   ```sh
    cd api
    npm install
    npm run dev
4. **Environment Variables(/api/.env):**
   ```sh
    MONGO_URL=your_mongodb_connection_string
    EMAIL_PASS=your_email_password

    OTP_JWT_SECRET=your_otp_jwt_secret
    JWT_SECRET=your_jwt_secret
    REFRESH_JWT_SECRET=your_refresh_jwt_secret

    OAUTH_CLIENT=your_google_oauth_client_id
    OAUTH_SECRET=your_google_oauth_secret
    OAUTH_REDIRECT=your_google_oauth_redirect_uri

    RECAPTCHA_SITE_KEY=your_recaptcha_site_key
    RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key
5. **Environment Variables(/client/.env.local):**
   ```sh
      NEXT_PUBLIC_SERVER_ENDPOINT=your_backend_url
      NEXT_PUBLIC_GOOGLE_OAUTH_REDIRECT_URL=your_google_oauth_redirect_uri
      NEXT_PUBLIC_SITE_KEY=your_recaptcha_site_key
      NEXT_PUBLIC_SECRET_KEY=your_recaptcha_secret_key
      NEXT_PUBLIC_apiBaseUrl=your_backend_url


To view a live demo of the project, watch the full video [here](https://harsh-bansal.netlify.app/GB-scrapper.mp4).

## Pages

- **Login Page**
- **Register Page**
- **Home Page:** Landing Page
- **Dashboard Page:** Retrieve search results from Google and Bing
- **History Page:** View search history
- **Session Page:** Manage user sessions

## Security

- **JWT Tokens:** Secure and stateless authentication
- **Password Hashing:** Bcrypt encryption
- **CSRF Protection:** Prevents Cross-Site Request Forgery attacks
- **Rate Limiting:** Limits the number of requests to prevent abuse
- **Recaptcha:** Protects against bots and spam
- **Google OAuth:** Secure login with Google account
- **OTP Verification:** Two-factor authentication for secure access


## Contact

For any inquiries or support, please contact harshbansal699@gmail.com.
