# Website Vulnerability & Performance Analyzer

A comprehensive web application that analyzes websites for security, performance, and technical details. This tool helps developers, security professionals, and website owners understand their website's health and potential issues.

## Features

### 1. Security Analysis
- **Google Safe Browsing Integration**
  - Detects if the website is flagged as malicious or unsafe
  - Identifies potential security threats
  - Provides immediate security status feedback

### 2. Performance Analysis
- **Google PageSpeed Insights Integration**
  - Performance Score
  - Accessibility Score
  - Best Practices Score
  - SEO Score
  - Core Web Vitals:
    - First Contentful Paint (FCP)
    - Largest Contentful Paint (LCP)
    - Cumulative Layout Shift (CLS)
    - Total Blocking Time (TBT)
    - Speed Index

### 3. Website Metadata Analysis
- **Microlink API Integration**
  - Website Title
  - Meta Description
  - Preview Image
  - Basic metadata extraction

### 4. Domain Information
- **WHOIS Lookup**
  - Domain Registration Details
  - Registrar Information
  - Creation Date
  - Expiration Date
  - Domain Age
  - Domain Status

### 5. IP Information
- **IPinfo Integration**
  - IP Address
  - Hostname
  - Geographic Location
  - Organization
  - Timezone
  - Postal Code

### 6. User Features
- **Authentication System**
  - Secure user registration and login
  - JWT-based authentication
  - Protected routes

- **Scan Management**
  - Create new website scans
  - View scan history
  - Add notes to scans
  - Delete scans
  - Sort scans by date

## Technical Stack

### Frontend
- React.js
- Vite
- Axios for API calls
- React Router for navigation
- Modern UI with responsive design

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Multiple API integrations

## API Integrations
- Google Safe Browsing API
- Google PageSpeed Insights API
- Microlink API
- WHOIS API
- IPinfo API

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. Set up environment variables in `server/.env`:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GOOGLE_SAFE_BROWSING_API_KEY=your_google_safe_browsing_api_key
   WHOISXML_API_KEY=your_whoisxml_api_key
   IPINFO_API_KEY=your_ipinfo_api_key
   PORT=5000
   ```

4. Start the development servers:
   ```bash
   # Start backend server
   cd server
   npm start

   # Start frontend server
   cd ../client
   npm run dev
   ```

## Usage

1. Register or login to your account
2. Enter a website URL in the dashboard
3. Click "Scan Website" to start the analysis
4. View detailed results including:
   - Security status
   - Performance metrics
   - Domain information
   - IP details
   - Website metadata

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 