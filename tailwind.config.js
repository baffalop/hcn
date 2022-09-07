module.exports = {
  mode: 'jit',
  content: [
    './index.html',
    './src/**/*.{js,ts,vue}',
  ],
  theme: {
    extend: {
      fontFamily: {
        text: ['Agrandir']
      },
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
