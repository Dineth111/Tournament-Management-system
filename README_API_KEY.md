# Secure API Key Integration

This document explains how to securely integrate API keys in the React + TypeScript + TailwindCSS frontend project.

## How It Works

1. **Environment Variables**: API keys are stored in a `.env` file and accessed via `import.meta.env.VITE_API_KEY`
2. **Secure Access**: The key is only accessible during build time and is embedded in the client-side code
3. **Type Safety**: TypeScript types are defined for environment variables to prevent runtime errors
4. **Centralized Client**: All API requests go through a centralized client that automatically includes the API key

## Setup Instructions

### 1. Create Environment File

Create a `.env` file in the `frontend/` directory:

```bash
# Copy the example file
cp .env.example .env
```

### 2. Add Your API Key

Edit the `.env` file and add your API key:

```env
VITE_API_KEY=your_actual_api_key_here
```

### 3. Using the API Client

The project includes a pre-built API client that automatically handles API key authentication:

```typescript
import { apiRequest, sendChatMessage } from './lib/apiClient';

// Example 1: Generic API request
const response = await apiRequest('/endpoint', {
  method: 'GET'
});

// Example 2: Specific service function
const chatResponse = await sendChatMessage('Hello AI!');
```

## Security Best Practices

1. **Never commit `.env` files** to version control
2. **Only use VITE_ prefix** for client-side environment variables
3. **Use different keys** for development and production
4. **Rotate keys regularly** for enhanced security

## File Structure

```
frontend/
├── .env.example          # Template for environment variables
├── src/
│   ├── types/
│   │   └── env.d.ts      # TypeScript types for environment variables
│   ├── lib/
│   │   └── apiClient.ts  # Centralized API client with key handling
│   └── components/
│       └── ApiKeyDemo.tsx # Demo component showing usage
```

## Testing the Integration

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to the Dashboard page
3. Find the "API Key Integration Demo" section
4. Enter a test message and click "Test"
5. View the secure API request in browser dev tools

## Troubleshooting

### "API key is missing" Error
- Ensure `.env` file exists in the `frontend/` directory
- Verify the `VITE_API_KEY` variable is set correctly
- Restart the development server after changes

### TypeScript Errors
- Ensure `src/types/env.d.ts` exists with correct type definitions
- Check that `tsconfig.json` includes the types directory

## Customization

To use with different third-party services:

1. Update the base URL in `apiClient.ts`
2. Modify the authorization header format if needed
3. Add new service-specific functions
4. Update the `.env.example` with service-specific variable names