"use strict";

const checkSyntaxAddAndRunTests = require('../src/main.js');

const pathToMarkdowns = 'test/test/markdowns/';

test('No errors', done => {
    function complete(succeeded, snippetHeading, errorName, message) {
        expect(snippetHeading).toBeUndefined();
        expect(errorName).toBeUndefined();
        expect(message).toBeUndefined();
        expect(succeeded).toBe(true);
        done();
    }
  
    checkSyntaxAddAndRunTests(`${pathToMarkdowns}no-errors1.md`, complete);
});

test('Comment value where it shouldn\'t be', done => {
    function complete(succeeded, snippetHeading, errorName, message) {
        const expectedMessage = `Inline comment not allowed here`;
        expect(snippetHeading).toBe('Comment value where it shouldn\'t be');
        expect(errorName).toBe('ImproperlyPlacedCommentError');
        expect(message).toBe(expectedMessage);
        expect(succeeded).toBe(false);
        done();
    }
  
    checkSyntaxAddAndRunTests(`${pathToMarkdowns}comment-placement-error1.md`, complete);
});

test('Syntax error', done => {
    function complete(succeeded, snippetHeading, errorName, message) {
        expect(snippetHeading).toBe('Snippet with a syntax error');
        expect(errorName).toBe('SyntaxError');
        expect(succeeded).toBe(false);
        done();
    }
  
    checkSyntaxAddAndRunTests(`${pathToMarkdowns}syntax-error1.md`, complete);
});

describe('Assertion errors', () => {

    test('assertion-error1.md', done => {
        function complete(succeeded, snippetHeading, errorName, message) {
            const expectedMessage = `arr //42 --> Inline comment didn\'t display value of preceeding expression`;
            expect(snippetHeading).toBe('Value in comment doesn\'t match preceding expression');
            expect(errorName).toBe('AssertionError');
            expect(message).toBe(expectedMessage);
            expect(succeeded).toBe(false);
            done();
        }
    
        checkSyntaxAddAndRunTests(`${pathToMarkdowns}assertion-error1.md`, complete);
    });

    test('assertion-error2.md', done => {
        function complete(succeeded, snippetHeading, errorName, message) {
            const expectedMessage = `pattern // /fo{1}$/ --> Inline comment didn\'t display value of preceeding expression`;
            expect(snippetHeading).toBe('Value in comment doesn\'t match preceding expression');
            expect(errorName).toBe('AssertionError');
            expect(message).toBe(expectedMessage);
            expect(succeeded).toBe(false);
            done();
        }
    
        checkSyntaxAddAndRunTests(`${pathToMarkdowns}assertion-error2.md`, complete);
    });

    test('assertion-error3.md', done => {
        function complete(succeeded, snippetHeading, errorName, message) {
            const expectedMessage = `isNaN(1) --> Is-functions on their own line should return true`;
            expect(snippetHeading).toBe('Is-function returns false');
            expect(errorName).toBe('AssertionError');
            expect(message).toBe(expectedMessage);
            expect(succeeded).toBe(false);
            done();
        }
    
        checkSyntaxAddAndRunTests(`${pathToMarkdowns}assertion-error3.md`, complete);
    });
});
