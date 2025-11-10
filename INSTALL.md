# Installation Guide

## Prerequisites

You need **Node.js** (which includes npm) installed on your system.

### Installing Node.js

1. **Download Node.js:**
   - Visit: https://nodejs.org/
   - Download the **LTS (Long Term Support)** version
   - This is the recommended stable version

2. **Install Node.js:**
   - Run the downloaded installer
   - Follow the installation wizard
   - Make sure to check "Add to PATH" option if available

3. **Verify Installation:**
   Open a new terminal/PowerShell window and run:
   ```powershell
   node --version
   npm --version
   ```
   Both commands should show version numbers.

### Alternative: Using Chocolatey (Windows)

If you have Chocolatey package manager:
```powershell
choco install nodejs-lts
```

### Alternative: Using Winget (Windows 10/11)

```powershell
winget install OpenJS.NodeJS.LTS
```

## Installing Project Dependencies

Once Node.js is installed:

1. **Navigate to project directory:**
   ```powershell
   cd investment-quiz
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```

   This will install all required packages listed in `package.json`.

3. **Wait for installation to complete** (may take a few minutes)

## Running the Project

### Development Server

```powershell
npm run dev
```

This starts the Vite development server. Open your browser to the URL shown (usually `http://localhost:5173`).

### Run Tests

```powershell
# Run tests once
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### Build for Production

```powershell
npm run build
```

This creates optimized production files in the `dist` directory.

### Preview Production Build

```powershell
npm run preview
```

## Troubleshooting

### "npm is not recognized"

- **Solution:** Node.js is not installed or not in PATH
- **Fix:** Install Node.js from https://nodejs.org/ and restart your terminal

### "Permission denied" errors

- **Solution:** Run terminal as Administrator (Windows)
- **Or:** Use a different directory that doesn't require admin rights

### Port already in use

- **Solution:** Another application is using port 5173
- **Fix:** Kill the process or change the port in `vite.config.ts`

### Module not found errors

- **Solution:** Dependencies not installed
- **Fix:** Run `npm install` again

### TypeScript errors

- **Solution:** Type definitions may be missing
- **Fix:** Run `npm install` to ensure all dev dependencies are installed

## Project Structure

```
investment-quiz/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/          # Page components
│   ├── utils/          # Business logic & utilities
│   ├── test/           # Test setup
│   └── ...
├── package.json        # Dependencies & scripts
├── vite.config.ts     # Vite configuration
├── tsconfig.json      # TypeScript configuration
└── tailwind.config.js # Tailwind CSS configuration
```

## Need Help?

If you continue to have issues:
1. Make sure Node.js is installed: `node --version`
2. Make sure npm is installed: `npm --version`
3. Try deleting `node_modules` folder and `package-lock.json`, then run `npm install` again
4. Check that you're in the correct directory (`investment-quiz`)


