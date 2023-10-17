const { env } = require("process");

// Create and export config variables. 
const staging = {
    port: 3000,
    envName: 'staging'
}

const production = {
    port: 6000,
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