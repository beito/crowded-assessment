const path = require('path');

module.exports = {
  config: path.resolve(__dirname, 'config', 'config.json'),
  seedersPath: path.resolve(__dirname, 'src', 'database', 'seeders'),
  migrationsPath: path.resolve(__dirname, 'src', 'database', 'migrations')
};
