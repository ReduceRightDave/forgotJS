"use strict";

// Remove /**/ comments
function removeMultiLineComments(code) { 
    let start;
    while ( (start = code.indexOf('/*')) !== -1 ) {
        const end = code.indexOf('*/');
        code = code.slice(0, start) + code.slice(end + 2);
    }
    return code;
}

function splitIntoLines(code) {
    return code.split(/\n/)
               .filter(line => line); //removes empty lines
}

function removeWholeLineDoubleSlashComments(lines) {
    return lines.filter(line => !/^\/\/.*/.test(line));
}

module.exports = {
    removeMultiLineComments,
    splitIntoLines,
    removeWholeLineDoubleSlashComments
};
