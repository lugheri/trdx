/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        modalUp: 'modalUp .5s',
      },
      keyframes: {
        modalUp: {
          '0%':{ marginTop: '100%', width:'10%', opacity: '0'},
          '30%':{ marginTop: '-10%'},
          '60%':{ marginTop: '5%'},
          '100%':{ marginTop:'0', opacity: '1'},
        }
      },
      backgroundImage:{
        'login-bg':"url('/public/img/bg-login.jpg')",
        'login-mobile-bg':"url('/public/img/bg-login-mobile.jpg')",
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

