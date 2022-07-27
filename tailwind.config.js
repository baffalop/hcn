module.exports = {
  mode: 'jit',
  content: [
    './index.html',
    './src/**/*.{js,ts,vue}',
  ],
  theme: {
    extend: {
      fontFamily: ['Inter', 'Avenir', 'Helvetica', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      colors: {
        primary: {
          orange: '#faa732',
          green: '#50c3a4',
          purple: '#af87c3',
          blue: '#5a9fdc',
          pink: '#e65583',
        },
      },
    },
  },
  plugins: [],
}
