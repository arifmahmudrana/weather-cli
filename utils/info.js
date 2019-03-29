const yargonaut = require('yargonaut');
const chalk = yargonaut.chalk();

module.exports = msg => {
  const argv = require('yargs').argv;
  if (argv.debug) {
    console.log(chalk.green(msg));
  }
};
