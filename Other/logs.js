const { inspect } = require('node:util');

const color = {
    red: '\x1b[31m',
    orange: '\x1b[38;5;202m',
    yellow: '\x1b[38;5;190m',
    green: '\x1b[32m',
    blue: '\x1b[34m',
    reset: '\x1b[0m',
    purple: '\x1b[38;5;92m',
    lblue: '\x1b[38;5;111m',
    slash: '\x1b[38;5;51m',
    prefix: '\x1b[38;5;41m',
    HotR: '\x1b[38;5;12m',
    event: '\x1b[38;5;222m',
    components: '\x1b[38;5;201m'
}

function getTimestamp() {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${hours}:${minutes}:${seconds}`;
}

function write(message = '', prefix = '', colors = true) {
    const properties = inspect(message, { depth: 3, colors: Boolean(colors && typeof message !== 'string') });

    const regex = /^\s*["'`](.*)["'`]\s*\+?$/gm;

    const lines = properties.split('\n');
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].replace(regex, '$1');
        if (i === 0) {
            console.log(prefix + line);
        } else {
            console.log(line);
        }
    }

    process.stdout.write(color.reset);
}

function util(message) {
    return write(message, `${color.yellow}[ ${getTimestamp()} ] [ UTIL ]${color.reset} `);
}

function warn(message) {
    return write(message, `${color.orange}[ ${getTimestamp()} ] [ WARN ]${color.reset} `);
}

function error(message) {
    return write(message, `${color.red}${getTimestamp()} `, false);
}

function success(message) {
    return write(message, `${color.green}${getTimestamp()} [ SUCCESS ]${color.reset} `);
}

function debug(message) {
    return write(message, `${color.blue}${getTimestamp()} [ DEBUG ]${color.reset} `);
}

function login(message) {
    return write(message, `${color.purple}[ ${getTimestamp()} ] [ LOGIN ]${color.reset} `);
}

function blue(message) {
    return write(message, `${color.lblue}[ ${getTimestamp()} ] [ BLUE ]${color.reset} `)
}

function slash(message) {
    return write(message, `${color.slash}[ ${getTimestamp()} ] [ SLASH ]${color.reset} `)
}

function prefix(message) {
    return write(message, `${color.prefix}[ ${getTimestamp()} ] [ PREFIX ]${color.reset} `)
}

function HR(message) {
    return write(message, `${color.HotR}[ ${getTimestamp()} ] [ RELOAD ]${color.reset} `)
}

function event(message) {
    return write(message, `${color.event}[ ${getTimestamp()} ] [ EVENT ]${color.reset} `)
}

function comp(message) {
    return write(message, `${color.components}[ ${getTimestamp()} ] [ COMPONENT ]${color.reset} `)
}

module.exports = { getTimestamp, write, util, warn, error, success, debug, color, login, blue, slash, prefix, HR, event, comp};