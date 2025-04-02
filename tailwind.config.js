/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2ECC71', //  松石绿 
        secondary: '#27AE60', //  森林绿
        "secondary-dark": '#1E8449',
        "secondary-light": '#D5F5E3', 
        background: '#FFFFFF', //  白色背景
        accent: '#F39C12', //  琥珀橙
        sidebar: '#F8F9FA', //  侧边栏背景
        textMain: '#333333', // 主要文本
        textSecondary: '#7F8C8D', // 次要文本
        "text-dark": '#2C3E50',
        "text-light": '#7F8C8D',
        warning: '#E67E22', // 警告色
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif', 'Arial'],
      },
    },
  },
  plugins: [],
}