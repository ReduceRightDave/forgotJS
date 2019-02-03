# Contributing

## Testing
Some experimental CI tests run on CircleCI. The JavaScript snippets are extracted from the 
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


Comments starting with // on the same line as code should display the value of the 
preceeding expression. What you might call *comment values*:

```javascript
x //baz
```
becomes
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


Because of comment values, there is a restriction on where // comments can be placed. 
Eg this generates an `ImproperlyPlacedCommentError`:

```javascript
if (a === b) { //42
```



On pull request, along with the tests above, the routines that generate these 
tests are tested (`yarn test` as below).

To run the tests locally, [NodeJS](http://nodejs.org) and [Yarn](http://yarnpkg.com) 
are required.

Available scripts:
* `yarn test-readme` tests README.md
* `yarn verify-test-generation` checks the test generation routines
* `yarn test` tests everything



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


## Todos

* The tests should check the structure of the markdown
* Where comments display exceptions, add tests



