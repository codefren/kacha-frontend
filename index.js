const concurrently = require('concurrently');

concurrently([
    // {
    //     command: 'npm:start-api:dev',
    //     name: 'api',
    //     prefixColor: 'red.bold',
    // },
    /*{
        command: 'npm:start-jobs-api:dev',
        name: 'jobs-api',
        prefixColor: 'yellow.bold',
    },
    {
        command: 'npm:start-engine:dev',
        name: 'engine',
        prefixColor: 'green.bold',
    },*/
    {
        command: 'npm:start-website:dev',
        name: 'website',
        prefixColor: 'cyan.bold',
    },
]).then();
