/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    screens: {
      'mobile': '0px',
      'tablet': '768px',
      'desktop': '1024px',
    },
    container: {
      center: true,
      padding: '24px',
      screens: {
        desktop: '1100px',
      },
    },
    extend: {
      colors: {
        'deep-grove': 'var(--deep-grove)',
        'fresh-leaf': 'var(--fresh-leaf)',
        'sun-citrus': 'var(--sun-citrus)',
        'crate-brown': 'var(--crate-brown)',
        'paper-husk': 'var(--paper-husk)',
        'ink': 'var(--ink)',
        'stone': 'var(--stone)',
        'stone-dark': 'var(--stone-dark)',
        'white': 'var(--white)'
      },
      spacing: {
        '2': '8px',
        '3': '16px',
        '4': '24px',
        '5': '40px',
        '6': '64px',
      },
      borderRadius: {
        's': '4px',
        'm': '10px',
        'l': '16px',
        'xl': '24px',
        'pill': '999px'
      },
      boxShadow: {
        'card': 'var(--shadow-card)',
        'modal': 'var(--shadow-modal)'
      },
      fontFamily: {
        'fraunces': ['var(--font-fraunces)'],
        'cairo': ['var(--font-cairo)'],
        'mono': ['var(--font-ibm-plex-mono)']
      }
    },
  },
  plugins: [],
}
