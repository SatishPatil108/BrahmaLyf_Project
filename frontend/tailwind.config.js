import  {scrollbarHide} from 'tailwind-scrollbar-hide'

export default {
  darkMode: 'class', // 👈 enables manual dark theme toggling via .dark class
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {      
      
    },
    screens: {
      mobile: { max: '767px' },
      desktop: '768px',
    },
  },
  plugins: [scrollbarHide(),
    require('@tailwindcss/line-clamp'),
  ],
};