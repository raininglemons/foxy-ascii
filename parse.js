/**
 * Takes a html source generated from http://picascii.com/ then converts it to a json object. Examples
 * of how the generate json object can be rendered in the browser can be seen in web-*.js files
 */

const fs = require('fs');
const spanRegex = /<span style="color: #([a-zA-Z0-9]+);">([^<]+?)<\/span>/mig;
const hexRegex = /<span style="color: #(([a-zA-Z0-9])\2([a-zA-Z0-9])\3([a-zA-Z0-9])\4|([a-zA-Z0-9]+));">([^<]+?)<\/span>/mi;

fs.readFile('source.html', (err, data) => {
  const config = { colours: [], code: [] };
  data.toString().match(spanRegex)
    .forEach(span => {
      spanContents = span.match(hexRegex);

      const colour = spanContents[5] || spanContents.slice(2,5).join('');
      const content = spanContents[6];

      let colourIndex = config.colours.indexOf(colour);
      if (colourIndex === -1) {
        colourIndex = config.colours.push(colour);
      }

      const lastEntry = config.code.length ? config.code[config.code.length - 1] : null;

      if (lastEntry !== null && lastEntry[1] === colourIndex) {
        lastEntry[0] += content;
      } else {
        config.code.push([content, colourIndex]);
      }
    });

  console.log(config);

  fs.writeFile('config.json', JSON.stringify(config), (err) => {
    if (err)
      console.error(err);
    else
      console.log('Success');
  })
});