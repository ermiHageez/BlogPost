module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.[tj]sx?$": "babel-jest",
  },
  // allow transforming @prisma/client (it uses ESM exports)
  transformIgnorePatterns: ["/node_modules/(?!(@prisma/client)/)"],
  testPathIgnorePatterns: ["/node_modules/"],
  moduleFileExtensions: ["js", "jsx", "json", "node"],
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
};
