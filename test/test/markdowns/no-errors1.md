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
a === 42

let u;
u === undefined
u //undefined

function f() {
  return 1;
}
f(); //1

const f1 = function a() {return 1}
f1 //  function a() { return 1 }

new RegExp("'") // /'/

new RegExp('fo{2}$') ///fo{2}$/

const arr = [3,2,1]
arr //  [   3,2   ,    1    ]

// needs the ;
;(function(){return [1,2,8]})(); //[1, 2, 8]

[1, 2, ...[3, 4]] //[1,2,3,4]  

// if (true) { //[]
// }

/* I'm a comment 
over several 
lines 1 === 1 */

/* Where a comment value lives on the same line as an expression containing
a comparison operator, there should be no error. (The comment value has precedence). */
2 != 3 //true

1 == 1 ? 'foo' : 'baz' // 'foo'

let str = '1234'
str //'1234'

var singleQuote = "don't"
singleQuote //"don't"

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
