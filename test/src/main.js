"use strict";

const unified = require('unified');
const markdown = require('remark-parse');
const vdom = require('remark-vdom');
const fs = require('fs');
const $ = require('vdom-query');

const InvalidCommentValueError = require('./helpers').InvalidCommentValueError;
const UnsupportedFeatureError = require('./helpers').UnsupportedFeatureError;
const getCodeWithTests = require('./getCodeWithTests.js');

//Make assert() available Function(  here  )()
global.assert = require('assert').strict;

function runCode(code) {
    const consLog = console.log;
    console.log = function(){};
    Function(`"use strict"; ${code}`)();
    console.log = consLog;
}

function main(headings, codeElements, callback) {

    for (let i = 0, length = headings.length; i < length; i++) {
        const heading = headings[i],
            codeSnippet = codeElements[i];
        let codeWithTests;
        
        if (heading.includes("\\") || codeSnippet.includes("\\")) {
            return callback(false, heading, 'UnsupportedFeatureError', 'Can\'t yet handle backslashes');
        }

        //Let the Node compiler check the snippet for errors
        try {
            runCode(codeSnippet);
        } catch (error) {
            return callback(false, heading, error.name, error.message);
        }

        try {
            codeWithTests = getCodeWithTests(codeSnippet);
        } catch (error) {
            if (error instanceof InvalidCommentValueError) {
                return callback(false, heading, 'InvalidCommentValueError', error.message);
            } else if (error instanceof UnsupportedFeatureError) {
                return callback(false, heading, 'UnsupportedFeatureError', error.message);
            } else {
                throw new Error(`Unexpected error ${error.name} in "${heading}":\n${error.message}`);
            }
        }

        //Run the tests
        try {
            runCode(codeWithTests);
        } catch (error) {
            if (error instanceof SyntaxError) {
                const syntaxErrorMessage = 'Inline comment not allowed here -check that first.\n(It\'s also possible that the test generation code is broken)';
                /* ImproperlyPlacedCommentError is a commentValue in the wrong place eg 
                   if (true) { //[]
                */
                return callback(false, heading, 'SyntaxError: Probably ImproperlyPlacedCommentError', syntaxErrorMessage);
            } else if (error instanceof assert.AssertionError) {
                //Assertion error from a test not passing
                return callback(false, heading, 'AssertionError', error.message);
            } else {
                throw new Error(`Unexpected error ${error.name} in "${heading}":\n${error.message}`);
            }

        }
    }
    
    return callback(true);
}

function checkSyntaxAndRunTests(filePath, callback) {
    unified()
        .use(markdown)
        .use(vdom)
        .process(fs.readFileSync(filePath, 'utf-8'), function(err, file) {
            if (err) throw err;

            //TODO check markdown conforms to expected structure

            const headings = $(file.contents).find('h2').map(el => el.children[0].text);
            const codeElements = $(file.contents).find('code').map(el => el.children[0].text);

            main(headings, codeElements, callback);
        });
}

module.exports = checkSyntaxAndRunTests;
