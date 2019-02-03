"use strict";

const helpers = require('./helpers');
const getAssertForValueInComment = require('./getAssertForValueInComment');

const separator = ' --> ',
      ifWhileForStatementPattern = /^(if|while|for)/,
      conditionalOperatorPattern = /.+=.+\?.+:.+/;

      
//Passed to String.prototype.replace() via bind()
function replaceWithSimpleAssert(line, code) { 
    if (ifWhileForStatementPattern.test(line) || conditionalOperatorPattern.test(line)) {
        return line;
    }
    line = line.replace(/'/g, "\\'");
    return `assert(${code.trim()}, '${line}${separator}${this.message}');`;
}

const equalityOperators = {
        pattern: /^([^{}/]+(?:==|!=)[^/;]+);?\s*$/,
        message: 'Equality/inequality expressions on their own line should be true',
        operation: replaceWithSimpleAssert
    },
    isFunctions = {
        pattern: /^((.*\.)?is[A-Z]\w*\(.+\));?$/,
        message: 'Is-functions on their own line should return true',
        operation: replaceWithSimpleAssert
    };


const valueInComment = {
    pattern: /^([^/;]+);?\s*\/\/(.+)$/,
    message: 'Inline comment didn\'t display value of preceeding expression',
    
    //Passed to String.prototype.replace() via bind()
    operation(line, code, commentValue) { 
        if (/^console\.log/.test(line)) return line;
        return getAssertForValueInComment(line, code, commentValue, this.message, separator);
    }
};


const insertAssertOperations = [
    equalityOperators,
    isFunctions,
    valueInComment
];

function insertAsserts(lines) {
    return lines.map(function(line) { 
        let replacement;
        for (const op of insertAssertOperations) {
            replacement = line.replace(op.pattern, op.operation.bind(op));
            if (replacement !== line) break;
        };
        return replacement;
    });
}


function getCodeWithTests(snippet) {
    let lines;
    snippet = helpers.removeMultiLineComments(snippet);
    lines = helpers.splitIntoLines(snippet);
    lines = helpers.removeWholeLineDoubleSlashComments(lines);
    lines = lines.map(line => line.trim());
    lines = insertAsserts(lines);
    lines = lines.map(line => line + '\n');
    return lines.join('');
}


module.exports = getCodeWithTests;
