# Things that don't cause an error -either compilation or test assertion
Foo intro


## Comment-only snippet

```javascript

/* Nothing but comments */

//foo comment

```

## Level 2 heading

```javascript

// A comment with `==` and `!=`
1 == '1'

!![] === true && !!{} === true

let a = 42
a //42

function f() {
  return 1;
}
f(); //1

new RegExp("'") // /'/

new RegExp('fo{2}$') ///fo{2}$/

const arr = [3,2,1]
arr //  [   3,2   ,    1    ]

// needs the ;
;(function(){return [1,2,8]})() //[1, 2, 8]
// needs the ;
;[1, 2, ...[3, 4]] //[1,2,3,4]  

// if (true) { //[]
// }

/* I'm a comment 
over several 
lines 1 === 1 */

/* Where a // comment lives on the same line as an expression containing
a comparison operator, the value the comment displays should be tested. */
2 != 3 //true

1 == 1 ? 'foo' : 'baz' // foo

if (isNaN(NaN)) console.log()

isNaN("'");

let ob = {
    a: 'a',
    b: {
        c: 1
    }
}
ob['b']['c'] === 1
```


## Strings

```javascript

let strAlpha = 'hi'
strAlpha //hi

let strNum = '1234'
strNum //1234

const twoWords = "two words"
twoWords //two words

const multiWordString = 'multiple word string'
multiWordString //multiple word string

var singleQuote0 = "'"
singleQuote0 //'

var singleQuote1 = "don't"
singleQuote1 //don't

var singleQuote2 = 'don\'t\''
singleQuote2 //don't'

let singleQuote3 = '`\'foo\'`'
singleQuote3 //`'foo'`

var doubleQuote0 = '"'
doubleQuote0 //"
```
