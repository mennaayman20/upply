# Job Recruitment Platform

A modern web application built with React, TypeScript, and Vite for connecting job seekers with recruiters. Features include user authentication, job posting, application management, and profile management.

## Features

- User authentication (login/signup)
- Job posting and browsing
- Application tracking for recruiters
- User profiles for seekers and recruiters
- Responsive design with Tailwind CSS
- Modern UI components with ShadCN UI

## Tech Stack

- **Frontend**: React 18, TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI (via ShadCN)
- **Routing**: React Router DOM
- **State Management**: React Query
- **Form Handling**: React Hook Form with Zod validation

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd upply
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Scripts

The following scripts are available in the project:

- **`npm run dev`** - Starts the development server with hot reloading
- **`npm run build`** - Builds the application for production
- **`npm run build:dev`** - Builds the application in development mode
- **`npm run lint`** - Runs ESLint to check for code quality issues
- **`npm run preview`** - Previews the production build locally

## Usage

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Page components
├── contexts/       # React contexts (e.g., AuthContext)
├── hooks/          # Custom React hooks
├── lib/            # Utility functions and mock data
├── types/          # TypeScript type definitions
└── assets/         # Static assets
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
