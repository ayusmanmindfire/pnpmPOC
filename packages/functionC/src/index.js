const { app } = require('@azure/functions');
const { name, config } = require('./functions/httpTrigger1');

app.http(name, config);
