/** @type {import('tailwindcss').Config} */
import aspectRatio from '@tailwindcss/aspect-ratio';
import lineClamp from '@tailwindcss/line-clamp';
import typography from '@tailwindcss/typography';

const config = {
  important: true,
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2dc275',
        primaryHover: '#28a864',
        secondary : '#27272a',
      },
      screens: {
        'xl': '1440px', // đặt tên tuỳ ý
      },
    },
  plugins: [aspectRatio, lineClamp, typography], }
};

export default config;
