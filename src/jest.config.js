export default {
  transform: {},
  moduleFileExtensions: ['js', 'json', 'node'],
  testEnvironment: 'node',
  transformIgnorePatterns: ['/node_modules/(?!(your-module-to-transform)/)'],
};