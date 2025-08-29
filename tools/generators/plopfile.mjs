export default function (plop) {
    plop.setGenerator('service', {
      description: 'Create a new serverless service',
      prompts:[{
        type: 'input',
        name: 'name',
        message: 'Available options are AWS, Azure and GCP'
    }],
      actions: (data) => {
        const actions =[]
  
        if (data.provider === 'aws') {
          const basePath = '../../apps/aws/{{dashCase name}}';
          actions.push(
            {
              type: 'add',
              path: `${basePath}/project.json`,
              templateFile: 'templates/aws/project.json.hbs',
            },
            {
              type: 'add',
              path: `${basePath}/serverless.yml`,
              templateFile: 'templates/aws/serverless.yml.hbs',
            },
            {
              type: 'add',
              path: `${basePath}/package.json`,
              templateFile: 'templates/aws/package.json.hbs',
            },
            {
              type: 'add',
              path: `${basePath}/tsconfig.json`,
              templateFile: 'templates/aws/tsconfig.json.hbs',
            },
            {
              type: 'add',
              path: `${basePath}/tsconfig.app.json`,
              templateFile: 'templates/aws/tsconfig.app.json.hbs',
            },
            {
              type: 'add',
              path: `${basePath}/src/index.ts`,
              templateFile: 'templates/aws/index.ts.hbs',
            }
          );
        } else {
          // Placeholder for other providers
          actions.push(() => `Generators for ${data.provider} are not yet implemented.`);
        }
  
        return actions;
      },
    });
  }