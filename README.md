# Magazine (Chandamarutham)

Development notes and AWS Cognito / API Gateway setup for the Admin area.

## Quick Start

1. Copy `.env.example` to `.env` and fill in values (see [Environment Configuration Guide](Amazon%20AWS/guides/ENVIRONMENT_CONFIGURATION_GUIDE.md))
2. Install dependencies: `npm install`
3. Run configuration setup: `npm run setup-config`
4. Start the dev server: `npm run dev`

## Prerequisites

- Node.js (v18+ recommended)
- npm
- AWS Cognito Identity Pool for form submissions
- AWS API Gateway with endpoints configured

## Documentation

- [AWS Setup Guide](Amazon%20AWS/guides/AWS_SETUP_GUIDE.md) - Complete AWS infrastructure setup
- [Environment Configuration](Amazon%20AWS/guides/ENVIRONMENT_CONFIGURATION_GUIDE.md) - Environment variable configuration
- [GitHub Pages Deployment](Amazon%20AWS/guides/GITHUB_PAGES_CONFIGURATION.md) - Deployment setup
- [Troubleshooting Guide](Amazon%20AWS/guides/TROUBLESHOOTING_PREPRODUCTION.md) - Common issues and solutions

## Routes

- `/` — Home page
- `/listen`, `/photos`, `/read`, `/contribute`, `/staff`, `/subscribe` — Main application pages
- `/admin` — Admin login (Cognito-backed via Amplify)
- `/manage` — Protected admin UI (requires login)

## Architecture

- **Frontend**: React 19.1.1 with Vite build system
- **Authentication**: AWS Cognito User Pool (for admin features)
- **Form Submissions**: AWS API Gateway with Cognito Identity Pool for unauthenticated access
- **Deployment**: GitHub Pages with automated CI/CD

## Development

```bash
# Install dependencies
npm install

# Configure environment (interactive setup)
npm run setup-config

# Development server
npm run dev

# Build for production
npm run build

# Validate configuration
npm run validate-env
```

## Security

- Environment variables are never committed to git
- Production secrets are managed through GitHub Secrets
- API submissions use temporary AWS credentials via Cognito Identity Pool
- Admin features require authentication through Cognito User Pool
