# Tech News Application

A modern React application that showcases news articles using The Guardian's public API. This project demonstrates best practices in frontend development, including state management with Redux, API integration with Axios, and a scalable architecture.

## 🚀 Features

- **News Article Listing:** Browse through a curated list of news articles
- **Article Details:** View detailed information about each article
- **Infinite Scrolling:** Seamless loading of more articles as you scroll
- **Responsive Design:** Optimized for all screen sizes
- **Error Handling:** Robust error management with user-friendly messages
- **Loading States:** Smooth loading indicators during data fetching
- **API Caching:** Efficient caching mechanism for improved performance

## 🛠️ Technology Stack

- **React** - Frontend framework
- **TypeScript** - Type safety and better developer experience
- **Redux Toolkit** - State management
- **Axios** - API requests
- **React Router** - Navigation
- **Jest & React Testing Library** - Testing
- **CSS Modules** - Styling

## 📁 Project Structure

```
src/
├── api/               # API configuration and services
├── assets/           # Static assets
├── components/       # Reusable UI components
├── features/         # Feature-based modules
├── hooks/           # Custom React hooks
├── redux/           # Redux store configuration
├── routes/          # Route definitions
├── styles/          # Global styles
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

## 🚦 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/giri-madhan/tech-news.git
   cd tech-news
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with the Guardian API key:
   ```
   REACT_APP_GUARDIAN_API_KEY=your-api-key
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run tests**
   ```bash
   npm test
   ```

## 🏗️ Architecture Decisions

### State Management
- Redux Toolkit for centralized state management
- Feature-based slice organization
- Thunks for handling async operations

### API Integration
- Axios instances with interceptors
- Centralized API error handling
- Response caching mechanism

### Component Structure
- Functional components with hooks
- Common components for reusability
- Feature-based organization

### Testing Strategy
- Unit tests for reducers and utilities
- Integration tests for components
- Mock service workers for API testing

## 🔄 Development Workflow

1. Create a feature branch from `main`
2. Implement changes with appropriate tests
3. Submit a pull request with detailed description
4. Code review and approval
5. Merge to `main`

## 📝 Code Style Guide

- Use functional components
- Implement proper TypeScript types
- Follow React hooks best practices
- Write meaningful commit messages
- Document complex logic
- Include unit tests for new features

### Linting and Formatting
- Run ESLint before committing changes:
  ```bash
  npm run lint
  ```
- Fix auto-fixable ESLint issues:
  ```bash
  npm run lint:fix
  ```
- Format code with Prettier:
  ```bash
  npm run format
  ```

## 🔍 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- [filename]
```

## 📦 Build and Deployment

```bash
# Create production build
npm run build

# Preview production build locally
npm run serve
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ by Giri Madhan