const config = {
  transform: {
    "^.+\\.jsx?$": "babel-jest"
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(module1|module2)/)"
  ],
  testEnvironment: "node",
  transform: {
    "^.+\\.jsx?$": ["babel-jest", { presets: ["@babel/preset-env"], plugins: ["@babel/plugin-transform-modules-commonjs"] }]
  }
};

export default config;