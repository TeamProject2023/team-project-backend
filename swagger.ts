import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        securityDefinitions: {
            bearerAuth: {
                type: 'apiKey',
                name: 'Authorization',
                in: 'header',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
        info: {
            title: 'MedApi',
            version: '1.0.0',
        },

    },
    // Make sure the path to your API docs is correct
    apis: ['./routes/*.ts', "./desc.ts"], // Update this if your route files are in a different location
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
