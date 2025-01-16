import React from 'react';

// Mock modules
jest.mock('../index.css', () => ({}));
jest.mock(
  '../App',
  () =>
    function MockApp() {
      return <div data-testid="mock-app">Mock App</div>;
    }
);
jest.mock(
  '../components/common/ErrorBoundary/ErrorBoundary',
  () =>
    function MockErrorBoundary({ children }: { children: React.ReactNode }) {
      return <div data-testid="mock-error-boundary">{children}</div>;
    }
);

describe('Index', () => {
  // Test setup variables
  let mockRootElement: HTMLElement;
  let mockRender: jest.Mock;
  let mockCreateRoot: jest.Mock;
  const originalConsoleError = console.error;

  beforeAll(() => {
    console.error = jest.fn(); // Suppress expected console errors
  });

  afterAll(() => {
    console.error = originalConsoleError;
  });

  beforeEach(() => {
    // Initialize mocks
    mockRender = jest.fn();
    mockCreateRoot = jest.fn(() => ({ render: mockRender }));
    jest.doMock('react-dom/client', () => ({ createRoot: mockCreateRoot }));
    jest.resetModules();

    // Setup DOM
    mockRootElement = document.createElement('div');
    mockRootElement.id = 'root';
    document.body.appendChild(mockRootElement);
  });

  afterEach(() => {
    document.body.contains(mockRootElement) && document.body.removeChild(mockRootElement);
    jest.resetModules();
  });

  it('should create root and render app with correct component hierarchy', async () => {
    await require('../index');

    // Verify root creation and rendering
    expect(mockCreateRoot).toHaveBeenCalledWith(mockRootElement);
    expect(mockRender).toHaveBeenCalledTimes(1);

    // Verify component hierarchy
    const { type: rootType, props: rootProps } = mockRender.mock.calls[0][0];
    expect(rootType).toBe(React.StrictMode);

    const { type: errorBoundaryType } = rootProps.children;
    expect(errorBoundaryType.name).toBe('MockErrorBoundary');

    const { type: appType } = rootProps.children.props.children;
    expect(appType.name).toBe('MockApp');
  });

  it('should throw error when root element is missing', () => {
    document.body.removeChild(mockRootElement);
    expect(() => require('../index')).toThrow('Failed to find the root element');
  });
});
