const yargonaut = require('yargonaut');
const chalk = yargonaut.chalk();

module.exports = msg => {
  throw new Error(chalk.red.bold(msg));
};
