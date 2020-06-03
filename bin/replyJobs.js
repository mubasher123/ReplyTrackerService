#!/usr/bin/env node
require("dotenv").config();
const program = require('commander');
const mongoose = require('../lib/Infrastructure/DB/DatabaseConnection');
const ReplyJobsService = require("../lib/Services/ReplyJobsService");
const RabbitMQ = require("../lib/Infrastructure/RabbitMQ/RabbitMQ");

const Sentry = require('@sentry/node');
Sentry.init({ 
    dsn: 'https://02b2667d704e41fb8ad46ff2173668a3@sentry.codecactus.com/13',
    environment: process.env.ENV || 'local'
});

program
    .version('1.0.0', '-v, --version')
    .description('Reply Job Publisher');

program
    .command('publish')
    .alias('pub')
    .description('Publish reply jobs to queue')
    .action(async (cmd) => {
        await ReplyJobsService.publishJobs();
        await mongoose.disconnect();
        await RabbitMQ.closeConnection();
        process.exit(0);
    });


program.parse(process.argv);