"use strict";

const checkSyntaxAndRunTests = require('./src/main.js');

function complete(succeeded, snippetHeading, name, message) {

    if (succeeded) {
        console.log('\n\x1b[42m%s\x1b[0m', 'PASS');
        console.log('\n');
    } else {
        console.error('\n\x1b[41m%s\x1b[0m', `${name}`);
        console.error(`in section "${snippetHeading}":\n${message}\n`);
        process.exitCode = 1;
    }
}

console.log('\nTesting README.md');
checkSyntaxAndRunTests('./README.md', complete);
