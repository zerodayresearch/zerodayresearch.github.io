/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'cyberdark': {
          900: '#0c0e14',
          800: '#1a1d2e',
          700: '#242838',
          600: '#2e334a',
          500: '#3a4060',
        },
        'cyberblue': {
          500: '#29abe2',
          400: '#45b7e6',
          300: '#66c5eb',
        },
        'cyberred': {
          500: '#ff3b5c',
          400: '#ff5c78',
          300: '#ff7d93',
        },
        'cybergreen': {
          500: '#0db551',
          400: '#1fc664',
          300: '#37d078',
        },
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
        display: ['"Share Tech Mono"', 'monospace'],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.300'),
            a: {
              color: theme('colors.cyberblue.400'),
              '&:hover': {
                color: theme('colors.cyberblue.300'),
              },
            },
            h1: {
              color: theme('colors.white'),
              fontFamily: theme('fontFamily.display'),
            },
            h2: {
              color: theme('colors.white'),
              fontFamily: theme('fontFamily.display'),
            },
            h3: {
              color: theme('colors.white'),
              fontFamily: theme('fontFamily.display'),
            },
            h4: {
              color: theme('colors.white'),
              fontFamily: theme('fontFamily.display'),
            },
            code: {
              color: theme('colors.cybergreen.400'),
              backgroundColor: theme('colors.cyberdark.800'),
              padding: '0.2rem 0.4rem',
              borderRadius: '0.25rem',
              fontWeight: '400',
              fontFamily: theme('fontFamily.mono'),
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            pre: {
              backgroundColor: theme('colors.cyberdark.800'),
              color: theme('colors.gray.300'),
              fontFamily: theme('fontFamily.mono'),
              borderRadius: '0.5rem',
              padding: '1rem',
            },
            blockquote: {
              color: theme('colors.gray.400'),
              borderLeftColor: theme('colors.cyberblue.500'),
            },
            strong: {
              color: theme('colors.white'),
            },
            table: {
              thead: {
                th: {
                  color: theme('colors.white'),
                },
              },
              tbody: {
                tr: {
                  borderBottomColor: theme('colors.cyberdark.700'),
                },
              },
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};