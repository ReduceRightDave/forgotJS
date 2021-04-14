"use strict";

const helpers = require('./helpers');

function getAssertForValueInComment(line, code, commentValue, message, separator) {
    let evaledComment;

    let testFragment = `${line}${separator}${message}`;
    testFragment = "'" + testFragment.replace(/'/g, "\\'") + "'";

    code = code.trim();
    commentValue = commentValue.trim();

    let escapedCommentValue;

    let evalThis; 
    escapedCommentValue = commentValue.replace(/'/g, "\\'");
    if (commentValue.startsWith('\'')) {
        evalThis = '"' + escapedCommentValue + '"';
    } else if (commentValue.startsWith('"')) {
        evalThis = '\'' + escapedCommentValue + '\'';
    } else {
        evalThis = commentValue;
    }

    try {
        evaledComment = Function(`"use strict"; return ${evalThis}`)();
    } catch (error) {
        throw new helpers.InvalidCommentValueError(`${line}${separator}Comment values should be valid literals`);
    }

    for (const key in evaledComment) {
        if (typeof evaledComment[key] === 'function') {
            throw new helpers.UnsupportedFeatureError(`${line}${separator}A comment value can\'t be an object literal containing a method :(`);
        }
    }

    let assertStatement;
    
    if (typeof evaledComment === 'function') {
        assertStatement = `assert.strictEqual(${code}.toString().replace(/\\s/g, ''), '${escapedCommentValue}'.replace(/\\s/g, ''), ${testFragment});`;
    } else {
        assertStatement = `assert.deepStrictEqual(${code}, ${commentValue}, ${testFragment});`;
    }

    return assertStatement;
}

module.exports = getAssertForValueInComment;