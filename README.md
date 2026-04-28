# AI Chat Application with Cloudflare Workers and Convex

This is a full-stack, production-ready AI Chat application built on Cloudflare Workers and the Convex backend platform. It provides a secure, real-time, and scalable foundation for building AI-powered conversational interfaces.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Rustam77-77/promptgen-tech-spec-architect)

## Key Features

-   **Real-time AI Chat**: A responsive chat interface for interacting with AI models.
-   **Thread Management**: Create, edit, delete, and switch between multiple conversation threads.
-   **Secure Authentication**: Built-in email/password and anonymous sign-in flows using `@convex-dev/auth`.
-   **Serverless Backend**: Powered by Convex for real-time database, serverless functions, and file storage.
-   **Edge-First API Layer**: Utilizes Cloudflare Workers and Hono for a lightweight, fast, and scalable API gateway.
-   **Modern Frontend**: Built with React, Vite, TypeScript, and styled with Tailwind CSS and shadcn/ui.
-   **Type-Safe**: End-to-end type safety from the database schema to the frontend components.
-   **Ready to Deploy**: Streamlined deployment process to Cloudflare.

## Technology Stack

-   **Frontend**: React, Vite, TypeScript, Tailwind CSS, shadcn/ui
-   **Backend API**: Cloudflare Workers, Hono
-   **Database & Serverless Functions**: Convex
-   **Authentication**: `@convex-dev/auth`
-   **Package Manager**: Bun
-   **Deployment**: Cloudflare Pages & Wrangler

## Prerequisites

Before you begin, ensure you have the following installed:
-   [Node.js](https://nodejs.org/en/) (v18 or later)
-   [Bun](https://bun.sh/)
-   A [Cloudflare account](https://dash.cloudflare.com/sign-up)
-   A [Convex account](https://dashboard.convex.dev/sign-up)

## Getting Started

Follow these steps to set up and run the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-repository-name.git
cd your-repository-name
```

### 2. Install Dependencies

Install all project dependencies using Bun.

```bash
bun install
```

### 3. Set Up Convex

Initialize your Convex project. This will link the project to your Convex account and generate necessary configuration files.

```bash
bun convex dev
```

Follow the on-screen prompts to log in and create a new project.

### 4. Configure Environment Variables

Convex automatically handles its environment variables during local development via the `convex dev` command. However, you need to set up secrets for third-party services.

Run the following command to set your AI and email provider API keys. Replace the placeholder values with your actual keys.

```bash
# Set the API key for the AI provider (e.g., OpenRouter)
bun convex env set ANDROMO_AI_API_KEY "your_openrouter_api_key"

# Set the URL and API key for your SMTP email service
bun convex env set ANDROMO_SMTP_URL "https://your-smtp-service.com"
bun convex env set ANDROMO_SMTP_API_KEY "your_smtp_api_key"

# Set the deployment URL (needed for authentication)
bun convex env set CONVEX_SITE_URL "http://localhost:3000"
```

**Note:** The `CONVEX_SITE_URL` should be updated to your production URL when you deploy.

### 5. Run the Development Server

Start the Vite frontend and the Convex development server in parallel.

```bash
bun dev
```

The application will now be running at `http://localhost:3000`. The `convex dev` process watches for changes in your `convex/` directory and pushes them automatically.

## Project Structure

-   `worker/`: Contains the Cloudflare Worker code, built with Hono. `userRoutes.ts` is where you can add custom API endpoints.
-   `src/`: The frontend React application built with Vite.
    -   `components/`: Reusable React components, including shadcn/ui components.
    -   `pages/`: Top-level route components for the application.
    -   `lib/`: Utility functions and Convex client configuration.
-   `convex/`: The Convex backend, including schema, queries, mutations, and actions.
-   `shared/`: TypeScript code shared between the frontend and backend (e.g., validation logic).
-   `wrangler.jsonc`: Configuration file for the Cloudflare Worker.

## Development Commands

-   `bun dev`: Starts the local development server for both frontend and backend.
-   `bun build`: Builds the frontend application for production.
-   `bun lint`: Runs ESLint to check for code quality issues.
-   `bun backend:deploy`: Deploys the Convex backend to production.

## Deployment

This project is designed for seamless deployment to Cloudflare.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Rustam77-77/promptgen-tech-spec-architect)

### Manual Deployment Steps

1.  **Deploy the Convex Backend**

    First, deploy your Convex functions and schema to production. This command will also prompt you to set your production environment variables if you haven't already.

    ```bash
    bun run backend:deploy
    ```

    Remember to set your production `CONVEX_SITE_URL` environment variable in the Convex dashboard.

2.  **Deploy to Cloudflare**

    Use the Wrangler CLI to build and deploy your application to Cloudflare. This command will deploy the static frontend assets to Cloudflare Pages and the worker code from the `worker/` directory.

    ```bash
    bun wrangler deploy
    ```

    After deployment, Wrangler will provide you with the URL of your live application.

## Contributing

Contributions are welcome! If you have suggestions for improvements or find any issues, please feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.