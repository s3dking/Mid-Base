const colors = {
    red: '\x1b[31m',
    orange: '\x1b[38;5;202m',
    yellow: '\x1b[38;5;190m',
    green: '\x1b[32m',
    blue: '\x1b[34m',
    reset: '\x1b[0m',
    purple: '\x1b[38;5;92m',
    slash: '\x1b[36m',
    prefix: '\x1b[32m',
    HotR: '\x1b[34m',
    event: '\x1b[33m',
    components: '\x1b[35m',
    grey: '\x1b[90m',
    context: '\x1b[38;5;197m',
    pkg: '\x1b[38;5;82m'
}

function getTime() {
    const localTime = new Date().toLocaleString();
    const hours = localTime.split(", ")[1].split(":")[0];
    const minutes = localTime.split(", ")[1].split(":")[1];
    const ampm = localTime.split(", ")[1].split(":")[2].split(" ")[1];
    const totalTime = ` ${hours}:${minutes} ${ampm} `;
    return totalTime;
}

function error(message) {
    console.log(`${colors.grey}[${getTime()}] ${colors.red}[ ERROR ] ${message}${colors.reset}`)
}

function warn(message) {
    console.log(`${colors.grey}[${getTime()}] ${colors.orange}[ WARN ] ${message}${colors.reset}`)
}

function login(message) {
    console.log(`${colors.grey}[${getTime()}] ${colors.purple}[ LOGIN ] ${message}${colors.reset}`)
}

function slash(message) {
    console.log(`${colors.grey}[${getTime()}] ${colors.slash}[ SLASH ] ${message}${colors.reset}`)
}

function prefix(message) {
    console.log(`${colors.grey}[${getTime()}] ${colors.prefix}[ PREFIX ] ${message}${colors.reset}`)
}

function event(message) {
    console.log(`${colors.grey}[${getTime()}] ${colors.event}[ EVENT ] ${message}${colors.reset}`)
}

function comp(message) {
    console.log(`${colors.grey}[${getTime()}] ${colors.components}[ COMPONENT ] ${message}${colors.reset}`)
}

function context(message) {
    console.log(`${colors.grey}[${getTime()}] ${colors.context}[ CONTEXT ] ${message}${colors.reset}`)
}

function info(message) {
    console.log(`${colors.grey}[${getTime()}] ${colors.yellow}[ INFO ] ${message}${colors.reset}`)
}

function HR(message) {
    console.log(`${colors.grey}[${getTime()}] ${colors.HotR}[ RELOAD ] ${message}${colors.reset}`)
}

function pkg(message) {
    console.log(`${colors.grey}[${getTime()}] ${colors.pkg}[ PACKAGES ] ${message}${colors.reset}`)
}

module.exports = { login, slash, prefix, event, comp, context, info, HR, error, warn, colors, pkg }