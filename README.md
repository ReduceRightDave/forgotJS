# So you forgot JavaScript

Haven't used JS for a while? These terse and compact notes might jog the memory. Some are for fun. Many of the idiosyncrasies of JavaScript are listed and a little Python is sprinkled in for comparison.

Semicolons tend to be reserved for multi-line code examples.

Based on material by Tony Alicea, Douglas Crockford and Kyle Simpson.

See CONTRIBUTING.md for a description of the automated tests.

Strict mode is assumed for all snippets.

## Why the triple equals?

```javascript
// The == and != operators do implicit type coercion
1 == '1'

//but they also convert values in weird & strange ways, e.g.
null == undefined

//Whereas the strict === and !== do no coercion -nice and simple
1 !== '1'
```

## Switch uses ===

```javascript
let result;
switch (1) {
    case '1': 
        result = 'I\'m not selected because no coercion';
        break;
    case 1:
        result = 'I am selected because strict equality';
        break;
}

result === 'I am selected because strict equality'

//Remember the switch gotcha: fallthrough happens without break
```


## Why use isNaN() to check for the value NaN?

```javascript
//Because NaN (the invalid number value) doesn't equal itself

let a = NaN
a != NaN
a !== NaN
//but
isNaN(a)
Number.isNaN(a)

//Number.isNaN does no type coercion, whereas the global isNaN function does

/* NaN results from invalid maths operations, and trying to convert a 
string to a number that won't convert. */
Number.isNaN(parseInt('this is not a number'))
Number.isNaN(Number('wont work either'))

//Although
Number('') === 0
```


## Strict mode

```javascript
/* Strict mode corrects some of the sloppines of JavaScript. Opt in by declaring 
'use strict' for individuals functions, or for a whole module in Node. */
function goodPractice() {
    'use strict';
    //Things like: implicit global variables are disallowed -see later
}
```


## Strings are immutable

```javascript
let str = 'abc'
//Access individual chars with []
str[2] === 'c'

//But setting the chars fails
//str[0] = 'Z' //TypeError
//(TypeError in strict mode, fails silently otherwise)

//String methods always return a new string (often not the case with array methods)
str.replace('c', 'Z') === 'abZ'
//str remains unaffected
str === 'abc'
```


## Strings have length and backticks

```javascript
let name = 'Sauron'
name.length === 6

//Back-ticks also define strings but allow placeholders in the form of ${expression}
'Hi SAURON' === `Hi ${name.toUpperCase()}`
```


## Arithmetic operators do type conversion

```javascript
// Implicit, automatic type coercion (although slightly differently to the == kind)

//Python gives TypeError
'5' - 4 === 1
/* It's as if - is using Number() behind the scenes to coerce '5' to 5, and then 
doing the subtraction. */
Number('5') === 5

8 * null === 0
//because
Number(null) === 0

//In Python, 'five' * 2 == 'fivefive'
//but in JS
'five' * 2 !== 'fivefive'
//Because
Number.isNaN(Number('five'))
//and if NaN is the operand in a maths operation, NaN is the answer
Number.isNaN('five' * 2)
```


## + does even more

```javascript
//As well as the expected
6 + 6 === 12
//and
'bad' + 'ass' === 'badass'
//by adding an empty string, + also coerces to string 
'' + 1 === '1'
//or coerces to string and concatenates (whereas Python gives TypeError)
6 + '6' === '66'
'MI' + 5 === 'MI5'
'Very ' + true === 'Very true'
```


## + vs -

```javascript
//Given the above:

'' + 1 === '1'

'' - 1 === -1
//because
Number('') === 0
```


## More still that + does

```javascript
//+ as a prefix operator coerces to number

4 === +'4'
9.9 === +'9.9'
0 === +null
0 === +[]

//same as the parseInt and parseFloat built-in functions for numbers
+'4' === parseInt('4', 10) 
//second param is radix (base)
+'9.9' === parseFloat('9.9', 10)

//but different for weird stuff
parseInt(null, 10) !== +null
//rather
Number.isNaN(parseInt(null, 10))
Number.isNaN(parseFloat([], 10))

//+ gives the value NaN when it doesn't work
isNaN(+'cant be a number')
Number.isNaN(+'cant be a number')
```


## Relational comparison operators and more coercion

```javascript
'1' < 2
//because
Number('1') === 1

'foo' <= 1 === false
//because
Number.isNaN(Number('foo'))
//and NaN is neither greater-than nor less-than nor equal to any value
```


## Okay, I've remembered all this operator coercion now

```javascript
//Hold up hotshot, it's not always as you might think, e.g. while
//as above
Number(null) === 0 
//it's also the case that
Number(undefined) !== 0
//rather
Number.isNaN(Number(undefined))
```


## More on undefined vs. null

```javascript
//Declaration but no assignment
let x;
x === undefined

/* They sound kinda the same but best to leave undefined for the engine to use 
(as a placeholder -as above). If *we* want to set "no value", use null. */
x = null

/* In fact, best practise is not to refer to undefined (despite what you see in this 
document!). */

// undefined is returned by functions when you don't return anything

// Parameters with no arguments also have the value undefined
function f(a, b) {
    return b
}
f(1) === undefined
```


## Which string is higher?

```javascript
'a' < 'b' === true
'anonymous' < 'belly' === true
'c' < 'b' === false
'z' > 'm' === true

//Because ASCII
//caps before lower
'B' < 'a' 
//numbers first
'1' < 'A' 

'1' < '2'
'111' < '2'

//works similarly in Python
```


## I don't know what's true

```javascript
/* In a boolean context, all values are true, apart from:
false, 0, -0, NaN, '', null, undefined */

Boolean('') === false
Boolean(0) === false
Boolean(undefined) === false
Boolean(1) === true
Boolean('Hi') === true

if (1) { console.log('1 is truthy so I am printed') }
if (true && function(){} && 'Hi' && Number) { console.log('all truthy so I am printed') }

if (0) {
} else {
    console.log('0 is falsy so I am printed')
}

while ('Hi') {
    console.log('"Hi" is truthy so I am printed')
    break
}

//Use logical NOT to get the opposite of the truthiness of a value
!1 === false
//using it twice is like Boolean()
!!0 === false

if (!0 && !'') { console.log('0 and empty string are both falsey so I am printed') }

//Unlike Python, empty [] and {} are truthy
!![] === true && !!{} === true
```


## Short circuiting

```javascript
//Commonly used for assignment: logical OR
//OR gives the first truthy value it sees

let q = 1
let x = q || z
//1 is truthy, so
x === 1
//Notice there is no z available, but also no ReferenceError -short circuiting

/* It works because the && and || operators work left to right and return the value 
of one of their operands. */

let y = undefined || 1
//undefined is falsey, so
y === 1
```


## Chained short circuiting

```javascript
/* OR is easy going and will keep moving to the next operand, returning the first 
truthy value it finds (as above). */

//If OR reaches the last operand, OR returns it, regardless of its truthyness

let result = 0 || undefined || false || null
result === null

/* AND is different: it insists that everthing be true. It has a tantrum and gives 
up as soon as it sees anything falsey, and returns it. */

null === (1 && {} && null && true)

/* Like OR, if it reaches the last operand, it has no choice but to return it, 
regardless of its truthyness. */

let c
c = 1 && [] && true && 9
c === 9
c = 1 && [] && true && 0
c === 0
```


## Fun fact: 46,655 is asleep

```javascript
let n = 46655
//(using base 36 instead of the default 10)
n.toString(36) === 'zzz'
//parseInt gets a number from a string
parseInt('zzz', 36) === n

//magic
37439508
```


## Assigning primitives vs assigning objects

```javascript
//Primitive types e.g. numbers, strings and boolean, have their value assigned 
let a = 'hi'
let copy_of_hi = a

//Whereas for reference types e.g. objects and arrays, the reference is assigned
let myArray = [1,2]
let also_points_to_my_array = myArray

//The same principle applies to passing arguments to, and returning them from, functions
```


## Assignment returns a value

```javascript
let a, b

//The assignment operator returns the value it assigned
(a = 1) === 1
'foo' === (b = 'foo')

3 === (a += 2)  
2 === (a -= 1)
```


## Associa-what?

```javascript
//Associativity determines the order of execution of operators with the same precedence

//< is left-associative (works left-to-right)
//wtf true?? (False in Python)
3 < 2 < 1 === true 
//because, starting from the left
3 < 2 === false
//and given automatic type coercion (see earlier)
Number(false) === 0
//so we're left with
0 < 1

//For the same reason:
5 > 10 < 13 === true 
//False in Python!

//= is right-associative (works right-to-left)
var a, b
a = b = 1
a === 1
//because
1 === (b = 1)
```


## Somewhat annoying: typeof

```javascript
typeof false === 'boolean'
typeof 1 === 'number'
typeof NaN === 'number'
typeof 'foo' === 'string'
typeof `see later for this string syntax` === 'string'
typeof {} === 'object'
typeof new Date() === 'object'
typeof Number === 'function'

//all good so far, but
typeof [] === 'object'
//not 'array' -use Array.isArray
//and
typeof null === 'object'
// :( Just use value === null to check for null

//regular expressions
typeof /abc/ === 'object'
//in Node, at least

//undefined is a type with just one value
typeof undefined === 'undefined' 

let x
typeof x === 'undefined'
//but also, rather than ReferenceError:
typeof name_not_declared === 'undefined'

typeof NaN === 'number'

//more functions -see later
typeof function f(){return 1} === 'function'
typeof (()=>1) === 'function'
```





## My very own object

```javascript
//Can create object values with the object literal syntax
let ob = {} 
//which is shorthand for let ob = new Object()

//Similar to a Python dictionary. Mutable collection of key/value pairs (aka properties)
const developer = {
    name: 'Dave',
    isAmazing: true,
    myMethod: function() {return 'Do coding';}
};
//This object is now in memory and the developer variable points to it

//Access properties of the object with the . and [] operators
developer.name === 'Dave' 
developer['na' + 'me'] === 'Dave'
//run the method
developer.myMethod() === 'Do coding'
developer['myMethod']() === 'Do coding'

//Create new properties on the object using . or [] and assignment
developer.isThirsty = true
developer['isHungry'] = false

//For numbers as keys use []
developer[666] = 'evil bug'
//developer.666 //SyntaxError
developer[666] === developer['666']

/* But for numbers as keys, use an array instead. Arrays are actually objects (see later), 
with integers as keys.
(Although negative numbers as keys don't play nice when looping over an array 
with forEach() or for...of). */
```

## What else is an object?

```javascript
/*
*Any* value that is not a primitive.

The primitives are: string, number, boolean, null, undefined, symbol which are all 
immutable, single values. Some have methods, but they are still classed as primitives.

Whereas objects are mutable collections of key/value pairs (aka properties). 

Arrays, regular expressions and functions are objects. See later.

String, number, boolean and symbol have equivalent wrapper objects, made with e.g. 
new Number(6) 
but they're generally pointless.
*/
```


## My very own object, again

```javascript
/* Let's make the developer object again but with shorthand, and a computed property
name. */

const name = 'Dave',
      prop = 'isAmaz'

const developer = {
    name,
    [prop + 'ing']: true,
    myMethod() {return 'Do coding'}
}

const me = developer
me.isAmazing
```



## Don't collide names

```javascript
//Objects can be used to create namespaces to avoid identifier collision
let myLibrary = {
    myVar: 'myVar is not polluting the global namespace'
};
let otherLib = {
    myVar: 'This myVar is independant of myLibrary.myVar'
};
myLibrary.myVar !== otherLib.myVar;
```




## Missing keys

```javascript
//Wrong property name? No problem! (exception)

let ob = {}
//undefined instead of an error
ob.a === undefined 
ob['a'] === undefined 
//(Python gives KeyError)

//whereas
//ob.a.b //TypeError -undefined has no key b

//Arrays are actually objects, with integers as keys 
let arr = []
arr[10] === undefined
```



## Where's my inheritance?

```javascript
//Objects can inherit from others
const parent = {
    rhythmRating: 'pretty terrible',
    doDance() {
        return 'dancing is ' + this.rhythmRating
    }
}

const offspring = Object.create(parent)

//customise child by overwriting an inherited property
offspring.rhythmRating = 'rather good'

offspring.doDance() === 'dancing is rather good'
parent.doDance() === 'dancing is pretty terrible'

//parent is the prototype
Object.getPrototypeOf(offspring) === parent

parent.isPrototypeOf(offspring)

const newGeneration = Object.create(offspring)
newGeneration.doDance = () => 'soz, too busy with smartphone'

parent.isPrototypeOf(newGeneration)
```




## in or out?

```javascript
/* The in operator tests for the existence of a key in an object, or its prototype 
chain. */

'x' in {x:1} === true
'a' in {x:1} === false

/* All object literals automatically inherit a bunch of stuff like hasOwnProperty() 
and toString(). */
'toString' in {}

//Arrays are actually objects, with integers as keys
1 in ['a', 'b']

//Functions are objects too, with methods
'call' in Function
'call' in function(){}

//The same goes for regular expressions
'test' in /abc/

/* The hasOwnProperty() method also tests for the existence of a property in an 
object, but excludes its prototype chain. */
let ob = {x:1}
ob.hasOwnProperty('x') === true
ob.hasOwnProperty('toString') === false

//In Python, works on strings too
```

## Property enumeration: another type of in

```javascript
/* Can enumerate the properties of an object (including inherited properties) 
with for...in */
let log = ''
const ob = {
    one: 'wun',
    two: 'to'
}
for (const key in ob) {
    log += `${ key }: ${ ob[key] } `
}
//for...in does not guarantee property order
log.includes('one: wun') === true
log.includes('two: to') === true

//See also Object.keys() and Object.getOwnPropertyNames()
```



## Remove my key

```javascript
//Remove an object's property with delete
const ob = {removeThis: 'gonna be gone'}
delete ob.removeThis
'removeThis' in ob === false

/* N.B. if the object inherited properties from another object, including one 
called removeThis, it would now be accessible. */
```


## It's freezing

```javascript
//Freeze an object to make it immutable

const ob = {a:1}
Object.freeze(ob)
Object.isFrozen(ob)
//ob.a = 2 //TypeError
//(TypeError in strict mode, otherwise fails silently)

//Creating and removing properties are also prevented

//Nested objects aren't immutable though, unless also frozen
const outer = {inner:{a:1}}
Object.freeze(outer)
Object.isFrozen(outer.inner) === false
outer.inner.a = 2 
outer.inner.a === 2

//See also Object.seal()

//These methods also works on arrays, as arrays are actually objects
```




## Equality, identity, === again

```javascript
//For primitive types, equality compares the values

2 === 2
'a' === 'a'
let x, y
x = 0
y = 0
x === y

//For objects, it's different

var identical1 = {a:1}
var identical2 = {a:1} 
//two different objects in memory
identical1 !== identical2 
//ditto
[1,2,3] !== [1,2,3] 

//Instead, identity is checked
let myObject = {z:8}
let also_points_to_my_object = myObject
//same object in memory
also_points_to_my_object === myObject 

let nestedObject = {a:1}
let ob1 = {x:nestedObject}
let ob2 = {y:nestedObject}
ob1.x.a === 1 && ob2.y.a === 1
nestedObject.a = 2
ob1.x.a === 2 && ob2.y.a === 2

//All boils down to: primitives are dealt with by value, objects always by reference

/* In Python [1,2,3] == [1,2,3]  -instead use the is operator to compare indentity.
In JS, a library like Lowdash can compare object contents. */
```




## Arrays Are Fancy Objects

```javascript
let a = ['a', 'b', 'c']
Object.keys(a) //['0', '1', '2']

//TODO
```




## Length doesn't count

```javascript
/* The length property of arrays is the index of the last element + 1, rather than
the total number of elements. */
const arr = ['a']
arr[100] = 'b'
arr.length === 101
```



## Sorting arrays

```javascript
var arr;

//By default, works fine for strings
arr = ['m','z','a']
arr.sort() //['a', 'm', 'z']

//but not so much for numbers, because it sorts them as if they were strings
arr = [14, 8, 25, 3]
arr.sort() //[14, 25, 3, 8]

//so a comparison function is needed
arr = [14, 8, 25, 3]
arr.sort((a, b) => a - b) //[3, 8, 14, 25]
```




## Remove array duplicates

```javascript
var arr = [1, 1, 1, 2]
Array.from(new Set(arr)) //[1, 2]
```




## Slice vs splice

```javascript
/* slice() gives a shallow copy of some part of/whole of an array. slice() is also 
a string method. 

Whereas splice() changes an array, adding and/or removing elements. */
```


## Copying arrays

```javascript
let arr = [3,4,5]
//old way to copy an array one level deep
let copy = arr.slice() 
//newer (ES6) way using the spread operator
copy = [...arr] 
copy //[3,4,5]

//2 levels deep
arr = [[1], [2], [3]] 
copy = [...arr]
copy[0].push('A')
arr //[[1, 'A'], [2], [3]]
//comparing object references
arr[0] === copy[0] 
```




## JSON

```javascript
/*
JSON is a text interchange format -the payload of e.g. an AJAX response.
Based on object literal syntax. 

Remember to double quote all keys and strings.
*/

let myData_parsed = {
    "people": ["Sauron", "Smeagol"]
}
let myData_serialised = '{"people":["Sauron","Smeagol"]}'

/*Convert between parsed and serialised versions with built-in methods
-no need for eval() */
JSON.stringify(myData_parsed) === myData_serialised
JSON.parse(myData_serialised).people[1] === 'Smeagol'
```





## Arguments

```javascript
//Too many arguments? Chill out, they're ignored
function f(a) {
    return a
}
f(1,'extra','argument') === 1

//Function overloading (like in Java) is not possible
```

## Collect the rest into an array...

```javascript
//The rest syntax can collect extra arguments into an array 
function f(a, ...b) { return b }
f('a', 1, 2, 3) //[1, 2, 3]

//It also collects extra stuff in destructuring
let [a, b, ...rest] = [1, 2, 3, 4]
rest //[3, 4]
```

## Spread out an array (or any iterable)...

```javascript
//The spread syntax can roll things out of an array
[1, 2, ...[3, 4]] //[1, 2, 3, 4]

//and roll things out of an array just like apply() does
function sum(a, b, c) {
  arguments[3] === 'a';
  return a+b+c;
}
sum.apply(null, [1, 2, 3, 'a']) === sum(...[1, 2, 3, 'a'])

//Also works with strings
sum(...'zzza') === 'zzz'
Math.min(...'321') === 1
```





## Function statements vs. function expressions

```javascript
//A function statement (which is subject to hoisting):
function square(x) { 
    return x * x 
}

//Function expression
let f = function(x) {
    return x * x;
};

/* Function expressions can have a name, which is displayed in stack traces.
The name is available only in the function's scope. */
f = function square(x) { 
    return x * x;
}

//arrow function equivalent
f = x => x * x 
```


## Functions are fancy objects too

```javascript
/* Functions are objects, and so can have properties and methods, just like any 
other object. */

//E.g. the built-in call() method
let f = function(){} 
typeof f.call === 'function'
//other built-in properties and methods
f.length === 0
typeof f.toString === 'function'

//Create an arrow function, that returns 1, and assign it as a method of f
f.myMethod = ()=>1
f.myMethod() === 1
```

## Because functions are objects, they are values

```javascript
/* Functions are "first class", so can be assigned to variables and evaluated 
like any other value. */

let arrayOfValues = [{}, [], function(){return 'foo'}, 0]
arrayOfValues[2]() === 'foo'

let f = 1 && function(){} && Number
f === Number 
//f and Number refer to the same function

//What makes functions different is the ability to invoke them, with ()
f('6') === 6
//the same as
Number('6') === 6

//Pass a function to a function (map)
function addOne(n){ return n+1 }
let newArray = [0,5].map(addOne)
newArray //[1,6]

//The same thing using an arrow function
newArray = [0,5].map(n => n+1)
newArray //[1,6]

//Return a function from a function
f = function() {
    return function() {
        return 1;
    };
};
f()() === 1
```






## Nested Scopes / The scope chain

```javascript
(function(s) {
  (function() {
    (function() {
      s; //foo
    })();
  })();
})('foo');

(function(s) {
  return (function() {
    return (function() {
      return s;
    })();
  })();
})('foo') === 'foo';

var globl = 1;
(function() {
  (function() {
    (function() {
      globl; //1
    })();
  })();
})();
```


## Shadowing

```javascript
(function outer() {
    let x = 1; 
    function inner() {
        let x = 4; 
        //only the inner x is accessible here
        return x; 
    }
    inner() === 4; //true
})();

(function outer() {
    let x = 1; 
    function inner(x) {
        //only the inner x is accessible here
        return x; 
    }
    inner(4) === 4; //true
})();

//Both examples work equally with var instead of let
```



## Function scope vs block scope

```javascript
/*
var has function scope.
const and let have {block} scope (ie like variables in most C syntax languages).
*/

if (true) {
    var a = 1;
    let b = 1;
    //c is constant -can't assign to it ever again
    const c = 1; 
}

//a is available everywhere in the function
a === 1 
//b //ReferenceError: b is not defined
//c //ReferenceError: c is not defined


{
    let iMayWellBeGarbageCollected = 'after this block';
    var whereasI = 'exist everywhere in the enclosing scope due to hoisting';
}
```

## IIFE

```javascript
/* Immediately Invoked Function Expression -the IIFE pattern: harnessing function
scope to keep var variables private. */

(function optionalName() {

    //a is private -does not pollute the parent scope
    var a = 66; 

//the function is immediately invoked
})();

//a //ReferenceError: a is not defined

/* optionalName doesn't pollute the enclosing scope either, because this isn't a 
function statement, rather a function expression. */
```



## Hoisting

```javascript
// Variables and function statements being available when you wouldn't expect

foo === undefined
var foo = 1 
//although let instead of var gives ReferenceError

bar() === 1
function bar() {return 1}

/*
Why?

During compilation, all variable and function declarations are found and processed 
(with var declarations initialised to undefined).

Then, during execution, assignments are dealt with.
*/

i === undefined 
//(rather than ReferenceError)

//As above, doesn't work with let
if (false) { var i = 3 } 
```

