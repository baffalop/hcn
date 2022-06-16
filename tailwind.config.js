module.exports = {
  mode: 'jit',
  content: [
    './src/**/*.{html,js,svelte,ts}',
  ],
  theme: {
    extend: {
      fontFamily: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Open Sans', 'Helvetica Neue', 'sans-serif'],
      colors: {
        svelte: 'rgb(255, 62, 0)'
      },
    },
  },
  plugins: [],
}
