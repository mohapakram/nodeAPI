const { env } = require("process");

// Create and export config variables. 
const staging = {
    httpPort: 3000,
    httpsPort: 3001,
    envName: 'staging'
}

const production = {
    httpPort: 6000,
    httpsPort: 6001,
    envName: 'production'
}

// Container for all the environments 
const environments = {
    staging,
    production
};

const currentEnv = typeof (process.env.NODE_ENV) === 'string' && process.env.NODE_ENV.toLowerCase();

const envToExport = typeof (environments[currentEnv]) === 'object' ? environments[currentEnv] : environments.staging;

module.exports = envToExport;