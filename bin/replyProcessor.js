#!/usr/bin/env node
require("dotenv").config();
require('../lib/Infrastructure/DB/DatabaseConnection');

const Sentry = require('@sentry/node');
Sentry.init({
    dsn: 'https://02b2667d704e41fb8ad46ff2173668a3@sentry.codecactus.com/13',
    environment: process.env.ENV || 'local'
});

const program = require('commander');
const JobProcessor = require("../lib/Services/ReplyJobProcessor");

program
    .version('1.0.0', '-v, --version')
    .description('Gmail Job Processor');

program
    .command('replyProcessor')
    .alias('gm-p')
    .description('Publish reply jobs to queue')
    .action(async (cmd) => {
        await JobProcessor.process();
    });


program.parse(process.argv);