# Contributing

## Testing
Experimental continuous integration tests run on Github Actions. The JavaScript snippets are extracted from the 
README markdown document, run through the Node compiler to check for syntax 
and other errors, and then assertions are added as below.

In simplified terms, when on its own line 

```javascript
a === b
```
becomes
```javascript
assert(a === b);
```

Is-function lines also become tests:

```javascript
isNaN(x)
```
becomes
```javascript
assert(isNaN(x));
```

## Comment Values

Comments starting with // on the same line as code should display the value of the 
preceeding expression. What you might call *comment values*:

```javascript
x //'baz'
```
becomes something like
```javascript
assert.strictEqual(x, 'baz');
```


Comment values are mostly used to display the value of reference types.

```javascript
arr //[1,2,3]
```
becomes
```javascript
assert.deepStrictEqual(a, [1,2,3]);
```

Comment values should be single, valid literals, on one line. They can be `true`, `false`, `null`, `undefined`, number, string, regex literal, object literal, array literal or function. An `InvalidCommentValueError` may otherwise be thrown.

Because of comment values, there is a restriction on where // comments can be placed. 
Eg this generates an `ImproperlyPlacedCommentError`:

```javascript
if (a === b) { //42
```


## Scripts

On pull request, along with the tests above, the routines that generate these 
tests are themselves tested (Github Actions runs `npm test`).

To run the tests locally, [NodeJS](http://nodejs.org) and [NPM](https://www.npmjs.com/get-npm) 
are required. Github Actions is configured to run the tests on a variety of Node versions.

Available scripts:
* `npm run test-readme` tests README.md
* `npm run verify-test-generation` checks the test generation routines
* `npm test` runs both of the above



## Precedence

In the event that a line to be turned into a test contains say, both `===` and a 
comment value, comment value tests always have the highest precedence. So 

```javascript
isNaN(1) //foo
```
becomes 
```javascript
assert.strictEqual(isNaN(1), 'foo');
```
Comment values have the highest precedence, then equality operators, followed by is-functions (eg isNaN).


## Todos

* Test relational operators 
* Test to check the structure of the markdown
* Where comments display exceptions, add tests
* Allow multi-line expressions
* Allow for symbols
