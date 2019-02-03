"use strict";

const unified = require('unified');
const markdown = require('remark-parse');
const vdom = require('remark-vdom');
const fs = require('fs');
const $ = require('vdom-query');

const getCodeWithTests = require('./getCodeWithTests.js');

//Make assert() available Function(  here  )()
global.assert = require('assert').strict;

function main(headings, codeElements, callback) {

    for (let i = 0, length = headings.length; i < length; i++) {
        const heading = headings[i],
            codeSnippet = codeElements[i];
        let codeWithTests;
        
        //Let the Node compiler check the snippet for errors
        try {
            const consLog = console.log;
            console.log = function(){};
            Function(`"use strict"; ${codeSnippet}`)();
            console.log = consLog;
        } catch (error) {
            return callback(false, heading, error.name, error.message);
        }

        codeWithTests = getCodeWithTests(codeSnippet);
        // console.log(codeWithTests);

        //Run the tests
        try {
            const consLog = console.log;
            console.log = function(){};
            Function(`"use strict"; ${codeWithTests}`)();
            console.log = consLog;
        } catch (error) {
            /*  If we get this far then any SyntaxError must be a //commentValue
                in the wrong place eg 
                if (true) { //[] 
            
                or an assertion error from a test not passing.
            */

            if (error instanceof SyntaxError) {
                return callback(false, heading, 'ImproperlyPlacedCommentError', 'Inline comment not allowed here');
            } else if (error instanceof assert.AssertionError) {
                return callback(false, heading, 'AssertionError', error.message);
            } else {
                throw new Error(`Unexpected error ${error.name} in "${heading}":\n${error.message}`);
            }

        }
    }
    
    return callback(true);
}


function checkSyntaxAddAndRunTests(filePath, callback) {
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

module.exports = checkSyntaxAddAndRunTests;