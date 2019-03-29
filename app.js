require('dotenv').config();
const yargonaut = require('yargonaut');
const yargs = require('yargs');
const Table = require('cli-table');

const errMsg = require('./utils/err-msg');
const getLocation = require('./location');
const getIP2Location = require('./location/ip2location');
const getWeather = require('./weather');
const chalk = yargonaut.chalk();

process.env.DEBUG = process.env.DEBUG || false;

yargonaut
  .style('blue')
  .style('yellow', 'required')
  .helpStyle('green')
  .errorsStyle('red.bold');

yargs
  .usage('Usage: $0 [options]')
  .command(
    '$0',
    'Get weather from address',
    yargs =>
      yargs
        .option('address', {
          alias: 'a',
          describe: 'Address to fetch weather',
          string: true
        })
        .option('debug', {
          alias: 'd',
          describe: 'Show debug informations',
          boolean: true,
          default: false
        })
        .check(({ address }) => {
          if (address && address.length) {
            if (!address.trim()) {
              errMsg('address is empty');
            } else if (address.includes(';')) {
              errMsg('address must not contain the semicolon(;) character');
            }
          }

          return true;
        }),
    async ({ address }) => {
      try {
        const { lat, lng, loc } = address
          ? await getLocation(address)
          : await getIP2Location();
        const weather = await getWeather(lat, lng);

        console.log(chalk.green('Showing weather for: '), loc);
        const chars = {
          top: '─',
          'top-mid': '─',
          'top-left': '┌',
          'top-right': '┐',
          bottom: '─',
          'bottom-mid': '─',
          'bottom-left': '└',
          'bottom-right': '┘',
          left: '│',
          'left-mid': '├',
          mid: '─',
          'mid-mid': '─',
          right: '│',
          'right-mid': '┤',
          middle: '│'
        };
        for (const key in chars) {
          chars[key] = chalk.white(chars[key]);
        }
        const table = new Table({ chars });
        for (let key in weather) {
          const data = {};
          k = key.charAt(0).toUpperCase() + key.slice(1);
          data[`${chalk.yellow(k)}`] = weather[key];
          table.push(data);
        }
        console.log(table.toString());
      } catch (err) {
        yargs.showHelp();
        console.error(chalk.red.bold(`You have error:`), `${err.message}`);
      }
    }
  )
  .help()
  .alias('help', 'h')
  .alias('version', 'v')
  .strict().argv;
