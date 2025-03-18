# FastBreak Dashboard 🏀

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15.2.2-black" alt="Next.js">
  <img src="https://img.shields.io/badge/React-19.0.0-blue" alt="React">
  <img src="https://img.shields.io/badge/TailwindCSS-4.0-38B2AC" alt="TailwindCSS">
  <img src="https://img.shields.io/badge/Auth0-Authentication-orange" alt="Auth0">
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License">
</div>

## 📊 Overview

FastBreak Dashboard is a powerful and elegant NBA statistics platform that provides comprehensive insights into player performance, team analytics, and game statistics. Built with modern web technologies, it offers a responsive and intuitive interface for basketball enthusiasts, fantasy sports players, and data analysts.

### ✨ Key Features

- **Player Statistics** - Comprehensive player stats including points, rebounds, assists, and shooting percentages
- **Team Analytics** - Complete team roster information and performance metrics
- **Performance Visualization** - Interactive charts and graphs for visual data analysis
- **Advanced Metrics** - Advanced analytics including PER, Win Shares, and Box Plus/Minus
- **Historical Data** - Access to historical statistics and trend analysis
- **Responsive Design** - Beautiful UI that works on desktop and mobile devices
- **Dark/Light Mode** - Customizable theme options for optimal viewing experience

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn
- Auth0 account for authentication (optional for local development)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/fastbreak-dashboard.git
cd fastbreak-dashboard
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Environment Setup:

Create a `.env.local` file in the root directory with the following variables:

```
# Auth0 Configuration
AUTH0_SECRET='your-auth0-secret'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='https://your-tenant.auth0.com'
AUTH0_CLIENT_ID='your-client-id'
AUTH0_CLIENT_SECRET='your-client-secret'
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 🏗️ Project Structure

```
fastbreak-dashboard/
├── app/               # Next.js App Router
│   ├── api/           # API Routes
│   ├── components/    # UI Components
│   ├── dashboard/     # Dashboard Pages
│   ├── players/       # Player Pages
│   └── ...
├── components/        # Shared Components
├── contexts/          # Context Providers
├── lib/               # Utility Functions
├── public/            # Static Assets
├── types/             # TypeScript Type Definitions
└── ...
```

## 🔒 Authentication

FastBreak Dashboard uses Auth0 for secure authentication. User sessions are managed via middleware that protects all routes except for the landing page and authentication endpoints.

## 🎨 Styling

The application uses TailwindCSS for styling with a custom theme that supports both light and dark modes. The design system is consistent throughout the application with attention to accessibility and user experience.

## 📱 Responsive Design

FastBreak Dashboard is fully responsive and works well on devices of all sizes, from mobile phones to large desktop screens.

## 🛠️ Development

### Commands

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Lint the codebase

## 🔍 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/) - The React Framework
- [Auth0](https://auth0.com/) - Authentication and Authorization
- [TailwindCSS](https://tailwindcss.com/) - A utility-first CSS framework
- [NBA API](https://www.balldontlie.io/) - NBA statistics API
