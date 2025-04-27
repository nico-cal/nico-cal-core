# nico-cal Frontend

Frontend web application for the nico-cal diary service.

## Tech Stack

- Next.js (App Router) with TypeScript
- React 19
- Zod for validation
- NextAuth.js for authentication
- React Hook Form for form handling
- shadcn/ui for UI components
- Tailwind CSS for styling
- Vitest for testing
- ESLint and Prettier for code quality

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the frontend directory
3. Install dependencies:

```bash
npm install
```

4. Create a `.env.local` file with your environment variables:

```bash
cp .env.example .env.local
```

5. Edit the `.env.local` file with your configuration

### Development

Start the development server with hot-reload:

```bash
npm run dev
```

The application will be available at http://localhost:3000.

For HTTPS development (with self-signed certificates):

```bash
npm run dev:https
```

### Building for Production

```bash
npm run build
```

This will create an optimized production build.

### Running in Production

```bash
npm start
```

For HTTPS in production:

```bash
npm run start:https
```

## Directory Structure

```
/
├── src/                  # Source code
│   ├── app/              # Next.js App Router pages and layouts
│   ├── components/       # Reusable UI components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions and shared libraries
│   └── public/           # Static assets
├── certificates/         # SSL certificates for HTTPS development
├── public/               # Public static files
└── ...config files       # Various configuration files
```

## Key Features

- **Calendar View** - Monthly calendar showing emotion states
- **Diary Creation/Editing** - Record daily emotions and comments
- **Authentication** - Secure user login/logout
- **Responsive Design** - Works on mobile and desktop

## Screen Structure

- **Login Screen** - User authentication
- **Calendar Screen** (Home) - Monthly view with emotion indicators
- **Diary Creation Screen** - Create new diary entries
- **Diary Editing Screen** - Modify existing entries
- **Diary Detail Screen** - View specific day's entry
- **Common Header** - Navigation and logout

## Development

### Linting

```bash
npm run lint
```

### Formatting

```bash
npm run format
```

### Testing

```bash
npm test
```

## Development Guidelines

- Use TypeScript for all code (avoid `any` type)
- Implement proper type definitions
- Follow the component structure for UI elements
- Use React Hook Form for all forms
- Use Zod for validation
- Write tests for components and hooks

## Deployment

The application is configured for deployment on Vercel. The deployment process is automated through Vercel's integration with the repository.

## Connection to Backend

The frontend connects to the nico-cal backend API for data storage and retrieval. The backend API is available at `/api` endpoints.

See the backend README for more details on the API endpoints and authentication.
