const { app } = require('@azure/functions');

app.http('httpTrigger2', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        const name = request.query.get('name') || await request.text() || 'worldasdasdasdasd';

        return { body: `Hello, ${name}!asdasdasdasdasdasda` };
    }
});
