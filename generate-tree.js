const fs = require('fs');
const path = require('path');

const MAX_DEPTH = 1;
const ENGLISH_LETTERS = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
];

const OUTPUT_DIR = './src';

const indexImports = ENGLISH_LETTERS.map((x) => (`import { index_${x} } from '${OUTPUT_DIR}/index_${x}';`)).join('\n');
const indexExecutions = ENGLISH_LETTERS.map((x) => (`   index_${x}();`)).join('\n');
const index = `${indexImports}

export function run () {
${indexExecutions}
}
`;

fs.writeFileSync('index.js', index);


generateLevel(OUTPUT_DIR, 0, 'index');


function generateLevel(basePath, depth, prefix) {
    const isLastLevel = (depth === MAX_DEPTH);
    fs.mkdirSync(basePath);
    for(let letter of ENGLISH_LETTERS) {
        let fileContent = '';
        if (isLastLevel) {
            fileContent = `
export function ${prefix}_${letter}() {
    console.log('Executing ${prefix}_${letter});
}
            `;
        } else {
            const imports = ENGLISH_LETTERS.map((x) => (`import { ${prefix}_${letter}_${x} } from '${basePath}/${prefix}_${letter}/${prefix}_${letter}_${x}';`)).join('\n');
            const executions = ENGLISH_LETTERS.map((x) => (`    ${prefix}_${letter}_${x}();`)).join('\n');
            fileContent = `${imports}
export function ${prefix}_${letter}() {
${executions}
}
            `;
        }
        fs.writeFileSync(`${basePath}/${prefix}_${letter}.js`, fileContent);
        if (depth < MAX_DEPTH) {
            generateLevel(`${basePath}/${prefix}_${letter}`, depth + 1, `${prefix}_${letter}`);
        }
    }
}
