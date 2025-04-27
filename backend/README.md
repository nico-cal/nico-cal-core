# nico-cal Backend API

Backend API service for the nico-cal diary application.

## Tech Stack

- Express.js with TypeScript
- Zod for validation
- JWT authentication
- DynamoDB for data storage (placeholder implementation for now)

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies:

```bash
npm install
```

4. Copy the example environment file:

```bash
cp .env.example .env
```

5. Edit the `.env` file with your configuration

### Development

Start the development server with hot-reload:

```bash
npm run dev
```

The server will be available at http://localhost:3001 (or the port specified in your .env file).

### Building for Production

```bash
npm run build
```

This will compile TypeScript to JavaScript in the `dist` directory.

### Running in Production

```bash
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/login` - Login with userId and password
- `POST /api/auth/logout` - Logout and clear cookies

### Diary

- `GET /api/diaries` - Get all diary entries (with optional date filtering)
- `GET /api/diaries/:date` - Get diary entry for a specific date
- `POST /api/diaries` - Create a new diary entry
- `PUT /api/diaries/:date` - Update an existing diary entry

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
