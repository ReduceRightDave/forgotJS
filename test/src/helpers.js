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

class InvalidCommentValueError extends Error {
    constructor(message) {
      super(message);
      this.name = "InvalidCommentValueError";
    }
}

class UnsupportedFeatureError extends Error {
    constructor(message) {
      super(message);
      this.name = "UnsupportedFeatureError";
    }
}

module.exports = {
    removeMultiLineComments,
    splitIntoLines,
    removeWholeLineDoubleSlashComments,
    InvalidCommentValueError,
    UnsupportedFeatureError
};
