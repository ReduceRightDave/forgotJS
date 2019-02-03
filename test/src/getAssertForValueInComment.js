"use strict";

function getAssertForValueInComment(line, code, commentValue, message, separator) {
    let shouldTreatCommentAsString,
        evaledComment,
        escapedCommentValue;

    let testFragment = `${line}${separator}${message}`;
    testFragment = "'" + testFragment.replace(/'/g, "\\'") + "'";

    code = code.trim();
    commentValue = commentValue.trim();
    
    try {
        evaledComment = Function(`return ${commentValue}`)();
    } catch (e) {
        shouldTreatCommentAsString = true;
    }

    escapedCommentValue = commentValue.replace(/'/g, "\\'");

    if (shouldTreatCommentAsString || typeof evaledComment === 'string') {
        return `assert.strictEqual(${code}, '${escapedCommentValue}', ${testFragment});`;
    }
    
    return `if (typeof ${code} === 'string') {
assert.strictEqual(${code}, '${escapedCommentValue}', ${testFragment});
} else {
assert.deepStrictEqual(${code}, ${commentValue}, ${testFragment});
}`;

}

module.exports = getAssertForValueInComment;