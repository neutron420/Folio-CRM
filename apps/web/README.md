# Intellune

AI-powered autonomous agent platform template built with Next.js 15, React 19, and Tailwind CSS 4.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **React**: 19.0.0
- **Styling**: Tailwind CSS 4, Radix UI, shadcn/ui
- **Animations**: Framer Motion
- **Database**: Drizzle ORM + Neon (PostgreSQL)
- **Email**: Resend + React Email
- **Forms**: React Hook Form + Zod

## Getting Started

### Install Dependencies

```bash
pnpm install
```

### Environment Setup

Copy the example environment file and configure your variables:

```bash
cp .env.example .env
```

### Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server with Turbopack |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm format` | Format code with Biome |
| `pnpm lint` | Lint code |
| `pnpm check` | Run all checks |
| `pnpm db:push` | Push database schema |
| `pnpm db:studio` | Open Drizzle Studio |

## Project Structure

```
src/
├── app/
│   ├── (home)/          # Landing pages
│   │   ├── _components/ # Page-specific components
│   │   ├── contact/     # Contact page
│   │   ├── privacy/     # Privacy policy
│   │   └── terms/       # Terms of service
│   └── layout.tsx       # Root layout
├── components/
│   ├── icons/           # Icon components
│   ├── sections/        # Layout sections
│   └── ui/              # UI components
├── lib/                 # Utilities
└── styles/              # Global styles
```

## Features

- Responsive landing page with hero section
- Interactive feature showcases
- Testimonials carousel
- FAQ accordion
- Contact form
- Dark/light theme support
- SEO optimized with sitemap generation

## License

MIT
