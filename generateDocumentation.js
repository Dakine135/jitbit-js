const path = require('path');
const fs = require('fs');
const jsdoc2md = require('jsdoc-to-markdown');
(async () => {
  const apiDocs = await jsdoc2md.render({ files: 'lib/*.js' });
  await fs.writeFileSync(path.join(__dirname, '/apiDocs.md'), apiDocs);
  console.log('Done Generating Documentation');
})();
