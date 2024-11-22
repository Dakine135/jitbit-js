const path = require('path');
const fs = require('fs');
const jsdoc2md = require('jsdoc-to-markdown');
(async () => {
  const staticReadmeTop = `# jitbit-js
  ZERO Dependencies Javascript Wrapper for the [Jitbit REST API](https://www.jitbit.com/docs/api/)
  `;

  const apiDocs = await jsdoc2md.render({ files: 'lib/*.js' });
  await fs.writeFileSync(path.join(__dirname, '/README.md'), staticReadmeTop + apiDocs);
  console.log('Done Generating Documentation');
})();
