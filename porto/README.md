# Portfolio CMS Project

## Project info

A professional portfolio website built with React, TypeScript, Vite, and Tailwind CSS.

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Shadcn/ui** - UI components
- **React Router** - Routing
- **Framer Motion** - Animations

## How to run locally

### Prerequisites

Make sure you have Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

```sh
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Project Structure

```
porto/
├── src/
│   ├── components/     # React components
│   │   ├── admin/     # Admin dashboard components
│   │   ├── portfolio/ # Portfolio page components
│   │   └── ui/        # Reusable UI components
│   ├── pages/         # Page components
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility functions
│   └── main.tsx       # Application entry point
├── public/            # Static assets
└── index.html         # HTML template
```

## Features

- Modern portfolio showcase
- Admin dashboard (placeholder)
- Responsive design
- Dark mode support
- Smooth animations
- SEO optimized

## Development

The development server runs on `http://localhost:8080/`

Changes will hot-reload automatically.

## Deployment

Build the project for production:

```sh
npm run build
```

The built files will be in the `dist/` directory, ready to be deployed to any static hosting service.
