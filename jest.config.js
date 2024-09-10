const config = {
  transform: {
    "^.+\\.jsx?$": "babel-jest"
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(module1|module2)/)"
  ],
  testEnvironment: "node"
};

export default config;