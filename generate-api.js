const { generateApi } = require('swagger-typescript-api')
const path = require('path')
const fs = require('fs')

/* NOTE: all fields are optional expect one of `output`, `url`, `spec` */
generateApi({
  name: 'OrientClientApi.ts',
  output: path.resolve(process.cwd(), './src/api'),
  url: 'https://__fake-api__.orient.com/swagger.json',
  input: path.resolve(process.cwd(), './src/library/api/swagger.json'),
  spec: {
    swagger: '2.0', // Why not 3.0.1?
    info: {
      version: "1.0.0",
      title: "Swagger Petstore",
    },
  },
})
  .then(({ files, configuration }) => {
    files.forEach(({ content, name }) => {
      fs.writeFile(path, content);
    });
  })
  .catch(e => console.error(e))
