# Image Processing API

A Node.js Express API for image processing using Sharp. This API allows you to resize images dynamically and serves cached thumbnails for improved performance.

## Features

- Dynamic image resizing with customizable width and height
- Automatic thumbnail caching to improve performance
- Built with TypeScript for type safety
- Comprehensive test coverage using Jasmine
- ESLint and Prettier for code quality and formatting

## Project Structure

```
image-processing-api/
├── assets/
│   ├── full/          # Original images
│   └── thumb/         # Cached thumbnails
├── src/
│   ├── controllers/   # Request handlers
│   ├── routes/        # Route definitions
│   ├── services/      # Business logic
│   ├── tests/         # Test files
│   └── index.ts       # Application entry point
├── dist/              # Compiled JavaScript
└── spec/              # Jasmine test configuration
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Available Scripts

### Development
```bash
npm run dev
```
Starts the development server with hot reloading using nodemon and ts-node.

### Building
```bash
npm run build
```
Compiles TypeScript to JavaScript in the `dist` directory.

### Testing
```bash
npm test
```
Runs the build process followed by Jasmine tests.

```bash
npm run jasmine
```
Runs only the Jasmine test suite.

### Production
```bash
npm start
```
Starts the production server using compiled JavaScript from the `dist` directory.

### Code Quality
```bash
npm run lint
```
Runs ESLint to check code quality and style issues.

```bash
npm run lint:fix
```
Automatically fixes ESLint issues where possible.

```bash
npm run format
```
Formats code using Prettier.

## API Usage

### Base URL
```
http://localhost:3000
```

### Endpoints

#### GET `/`
Returns usage instructions.

#### GET `/images?filename=<name>&width=<width>&height=<height>`
Resizes and returns an image with specified dimensions.

**Parameters:**
- `filename` (required): Name of the image file (without extension)
- `width` (required): Target width in pixels
- `height` (required): Target height in pixels

**Example:**
```
GET /images?filename=fjord&width=200&height=200
```

## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript
- **Sharp** - High-performance image processing
- **Jasmine** - Testing framework
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Nodemon** - Development server with hot reloading

## Configuration

### TypeScript
- Target: ES5
- Module: CommonJS
- Strict mode enabled
- Output directory: `./dist`
- Source directory: `./src`

### ESLint
- TypeScript ESLint recommended rules
- Prettier integration for consistent formatting
- Node.js globals enabled

### Jasmine
- Test directory: `src/tests`
- Test files: `**/*[sS]pec.ts`
- TypeScript support via ts-node

## Development Workflow

1. **Start development server**: `npm run dev`
2. **Make changes** to TypeScript files in `src/`
3. **Run tests**: `npm test`
4. **Check code quality**: `npm run lint`
5. **Format code**: `npm run format`
6. **Build for production**: `npm run build`
7. **Start production server**: `npm start`

## Author

Ahmad Hamad

## License

ISC