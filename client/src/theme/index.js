import { createGlobalStyle } from 'styled-components';

// Color palette
export const colors = {
  primary: {
    main: '#16a34a',     // Green (brand color)
    light: '#22c55e',    // Lighter green
    dark: '#15803d',     // Darker green
    contrastText: '#ffffff'
  },
  secondary: {
    main: '#4ade80',     // Bright green accent
    light: '#86efac',
    dark: '#22c55e',
    contrastText: '#052e16'
  },
  success: {
    main: '#16a34a',
    light: '#4ade80',
    dark: '#15803d',
    contrastText: '#ffffff'
  },
  warning: {
    main: '#f57f17',
    light: '#ffb74d',
    dark: '#e65100',
    contrastText: '#ffffff'
  },
  error: {
    main: '#c62828',
    light: '#ef5350',
    dark: '#b71c1c',
    contrastText: '#ffffff'
  },
  grey: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121'
  },
  background: {
    default: '#ffffff',
    paper: '#ffffff'
  },
  text: {
    primary: '#212121',
    secondary: '#757575',
    disabled: '#9e9e9e',
    hint: '#9e9e9e'
  }
};

// Typography
export const typography = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  h1: {
    fontSize: '2.5rem',
    fontWeight: 700,
    lineHeight: 1.2
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 600,
    lineHeight: 1.3
  },
  h3: {
    fontSize: '1.5rem',
    fontWeight: 600,
    lineHeight: 1.4
  },
  h4: {
    fontSize: '1.25rem',
    fontWeight: 600,
    lineHeight: 1.4
  },
  h5: {
    fontSize: '1.1rem',
    fontWeight: 500,
    lineHeight: 1.5
  },
  h6: {
    fontSize: '1rem',
    fontWeight: 500,
    lineHeight: 1.5
  },
  body1: {
    fontSize: '1rem',
    lineHeight: 1.5
  },
  body2: {
    fontSize: '0.875rem',
    lineHeight: 1.5
  },
  button: {
    fontSize: '0.875rem',
    fontWeight: 500,
    textTransform: 'uppercase'
  },
  caption: {
    fontSize: '0.75rem',
    lineHeight: 1.5
  }
};

// Spacing
export const spacing = (multiplier) => `${multiplier * 8}px`;

// Shadows
export const shadows = {
  sm: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
  md: '0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)',
  lg: '0 10px 25px rgba(0,0,0,0.1), 0 2px 10px rgba(0,0,0,0.04)',
  xl: '0 20px 40px rgba(0,0,0,0.12)'
};

// Breakpoints
export const breakpoints = {
  xs: '0px',
  sm: '600px',
  md: '960px',
  lg: '1280px',
  xl: '1920px'
};

// Global styles
export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  body {
    font-family: ${typography.fontFamily};
    background-color: ${colors.background.default};
    color: ${colors.text.primary};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  h1, h2, h3, h4, h5, h6 {
    margin-bottom: ${spacing(2)};
  }
  
  p {
    margin-bottom: ${spacing(2)};
  }
  
  a {
    color: ${colors.primary.main};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 ${spacing(2)};
  }
  
  .card {
    background: ${colors.background.paper};
    border-radius: 8px;
    box-shadow: ${shadows.md};
    padding: ${spacing(3)};
    margin-bottom: ${spacing(3)};
  }
  
  .btn {
    background-color: ${colors.primary.main};
    color: ${colors.primary.contrastText};
    border: none;
    padding: ${spacing(1.5)} ${spacing(3)};
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    transition: background-color 0.3s, transform 0.2s;
    
    &:hover {
      background-color: ${colors.primary.dark};
      transform: translateY(-2px);
    }
    
    &:active {
      transform: translateY(0);
    }
    
    &:disabled {
      background-color: ${colors.grey[400]};
      cursor: not-allowed;
      transform: none;
    }
  }
  
  .btn-secondary {
    background-color: ${colors.secondary.main};
    color: ${colors.secondary.contrastText};
    
    &:hover {
      background-color: ${colors.secondary.dark};
    }
  }
  
  .btn-outline {
    background-color: transparent;
    color: ${colors.primary.main};
    border: 2px solid ${colors.primary.main};
    
    &:hover {
      background-color: ${colors.primary.main};
      color: ${colors.primary.contrastText};
    }
  }
`;

const theme = {
  colors,
  typography,
  spacing,
  shadows,
  breakpoints
};

export default theme;
