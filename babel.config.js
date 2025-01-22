module.exports = {
  presets: [
    '@babel/preset-env', // Transpile modern JavaScript (ES6+)
    '@babel/preset-react', // Transpile React JSX syntax
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties', // Allow class properties
    '@babel/plugin-proposal-private-methods', // Allow private methods
    '@babel/plugin-transform-runtime', // Optimizes runtime usage (e.g., async/await)
  ],
  env: {
    production: {
      plugins: [
        'transform-react-remove-prop-types', // Remove prop types in production
      ],
    },
  },
};
