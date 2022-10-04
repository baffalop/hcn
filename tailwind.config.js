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
          green: {
            DEFAULT: '#50C3A4',
            '50': '#D9F2EB',
            '100': '#CAEDE3',
            '200': '#ABE2D3',
            '300': '#8DD8C4',
            '400': '#6ECDB4',
            '500': '#50C3A4',
            '600': '#38A386',
            '700': '#2A7964',
            '800': '#1B4F41',
            '900': '#0D261F',
          },
          purple: '#af87c3',
          blue: '#5a9fdc',
          pink: '#e65583',
        },
      },
    },
  },
  plugins: [],
}
