module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  rootDir: '.',

  testMatch: ['**/*.spec.ts'],

  moduleFileExtensions: ['ts', 'js', 'json'],

  transform: {
    '^.+\\.ts$': 'ts-jest',
  },

  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },

  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.json',
    },
  },
};


