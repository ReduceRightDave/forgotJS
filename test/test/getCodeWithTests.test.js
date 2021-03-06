"use strict";

const getCodeWithTests = require('../src/getCodeWithTests.js');

//Testing equality operators and comments
const input1 = `
/* 
Comment
*/

null == undefined

//Double slash whole-line comment
const a = 1, b = 2;
a === b;

//Not turned into a test but included in output
var num = 1;

1 == '1'

!![] === true && !!{} === true;

2 !== '2?:'

//A comment with === and !=

//Not turned into a test
if (a === b) {
    1;
}

//Not turned into a test
const x = a === b ? 'foo' : 'baz';
`;

const expected1 = `
assert(null == undefined, 'null == undefined --> Equality/inequality expressions on their own line should be true');
const a = 1, b = 2;
assert(a === b, 'a === b; --> Equality/inequality expressions on their own line should be true');
var num = 1;
assert(1 == '1', '1 == \\'1\\' --> Equality/inequality expressions on their own line should be true');
assert(!![] === true && !!{} === true, '!![] === true && !!{} === true; --> Equality/inequality expressions on their own line should be true');
assert(2 !== '2?:', '2 !== \\'2?:\\' --> Equality/inequality expressions on their own line should be true');
if (a === b) {
    1;
}
const x = a === b ? 'foo' : 'baz';
`;


//Testing reference types in comment values
const input2 = `
var arr = [1,2,3]
arr // [ 4,5, 6  ]

let ob = {
    a: 'a',
    b: {
        c: 1
    }
}
ob //{a:'a', b:{c:1}}
ob.b //{c:1}

const f = x => x + 1
f //x => x + 1
`;

const expected2 = `
var arr = [1,2,3]
assert.deepStrictEqual(arr, [ 4,5, 6  ], 'arr // [ 4,5, 6  ] --> Inline comment didn\\'t display value of preceeding expression');
let ob = {
    a: 'a',
    b: {
        c: 1
    }
}
assert.deepStrictEqual(ob, {a:'a', b:{c:1}}, 'ob //{a:\\'a\\', b:{c:1}} --> Inline comment didn\\'t display value of preceeding expression');  
assert.deepStrictEqual(ob.b, {c:1}, 'ob.b //{c:1} --> Inline comment didn\\'t display value of preceeding expression');      
const f = x => x + 1
assert.strictEqual(f.toString().replace(/\\s/g, ''), 'x => x + 1'.replace(/\\s/g, ''), 'f //x => x + 1 --> Inline comment didn\\'t display value of preceeding expression');
`;


//Other comment values
const input3 = `
Math.ceil(4.1) //4
const str = 'hello '
str + 'world' //'hello world'
var nout = null
nout //null
if (true) { //'comment in the wrong place'
`;

const expected3 = `
assert.deepStrictEqual(Math.ceil(4.1), 4, 'Math.ceil(4.1) //4 --> Inline comment didn\\'t display value of preceeding expression');  
const str = 'hello '
assert.deepStrictEqual(str + 'world', 'hello world', 'str + \\'world\\' //\\'hello world\\' --> Inline comment didn\\'t display value of preceeding expression');
var nout = null
assert.deepStrictEqual(nout, null, 'nout //null --> Inline comment didn\\'t display value of preceeding expression');
assert.deepStrictEqual(if (true) {, 'comment in the wrong place', 'if (true) { //\\'comment in the wrong place\\' --> Inline comment didn\\'t display value of preceeding expression');
`;


/* Precedence
Comment value tests have the highest precedence, 
then equality operator tests,
followed by is-functions. */
const input4 = `
a === b //'foo'
isNaN(1) //'omg'
false === Object.isFrozen({})
`;

const expected4 = `
assert.deepStrictEqual(a === b, 'foo', 'a === b //\\'foo\\' --> Inline comment didn\\'t display value of preceeding expression');
assert.deepStrictEqual(isNaN(1), 'omg', 'isNaN(1) //\\'omg\\' --> Inline comment didn\\'t display value of preceeding expression');
assert(false === Object.isFrozen({}), 'false === Object.isFrozen({}) --> Equality/inequality expressions on their own line should be true');
`;


//Testing is-function calls
const input5 = `
isNaN(1);
Number.isNaN(NaN)
`;

const expected5 = `
assert(isNaN(1), 'isNaN(1); --> Is-functions on their own line should return true');
assert(Number.isNaN(NaN), 'Number.isNaN(NaN) --> Is-functions on their own line should return true');
`;


/* All these lines should simply "pass through" as either they are missing 
a comment value or should not be tests in any case. */
const input6 = `
console.log('foo');
var a, b = 1
a
a = 10
a + 2
(function(return 1){})()
if (true) a = 3
let x;
x = a===b ? x : y;
while (a === b) {
    Math.ceil(1)
}

(function tooAdvancedForMe(s) {
  return (function() {
    return (function() {
      return s;
    })();
  })();
})('Would be nice') === 'to turn this into a test -make it a TODO';

if (Number.isNaN(1)) 
{
}
var x = Number.isNaN(x) ? 1 : Number.isNaN(x);
`;


function trimSnippetLines(code) {
    return code.split('\n').filter(line => line).map(line => line.trim() + '\n').join('');
}

test('getCodeWithTests()', () => {
    expect(getCodeWithTests(input1)).toBe(trimSnippetLines(expected1));
    expect(getCodeWithTests(input2)).toBe(trimSnippetLines(expected2));
    expect(getCodeWithTests(input3)).toBe(trimSnippetLines(expected3));
    expect(getCodeWithTests(input4)).toBe(trimSnippetLines(expected4));
    expect(getCodeWithTests(input5)).toBe(trimSnippetLines(expected5));

    expect(getCodeWithTests(input6)).toBe(trimSnippetLines(input6));
});
