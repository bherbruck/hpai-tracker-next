module.exports = {
  content: ['./src/**/*.{j,t}s*'],
  theme: {
    extend: {
      maxWidth: {
        '1/2': '50%',
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
}
