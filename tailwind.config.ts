import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '898px',
      // xl:"1024px"
    },
    container: {
      center: true,
    },
    extend: {
      colors: {
        green: {
          100: '#e0f7e4', // light green background
          200: '#d3f0d1', // lighter green for hover states or accents
          300: '#a3d8b8', // main content background
          400: '#8cc69d', // buttons and accents
          500: '#73b284', // intermediate shade for various uses
          600: '#4a8f62', // header background
          700: '#8bc349', // footer background
          800: '#2F5F34'
    , // dark green for buttons
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'custom-gradient':
          'linear-gradient(150deg, #1B1B16 1.28%, #565646 90.75%)',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      borderRadius: {
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
      },
    },
  },
  plugins: [],
};

export default config;
