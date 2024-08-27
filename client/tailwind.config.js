/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'black': '#000000',
      'white': '#FFFFFF',
      'primary': '#13D0B4',
      'primary-light': '#3BE0C8',
      'title': '#000000',
      'body': '#666666',
      'footer': '#999999',
      'link': '#13D0B4',
      'blue': '#0AB5E7',
      'red': '#FF647A',
      'pink': '#FF7BB8',
      'gray-dark': '#E0E0E0',
      'gray-light': '#EEEEEE',
    },
  },
  plugins: [],
};
