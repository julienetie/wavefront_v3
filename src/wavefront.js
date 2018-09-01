const name = 'julien';
const age = 3223;

const message = `
  hello ${name}!
  the answer is ${40 + 2}`.toUpperCase();

const person = {
  name,
  age,
  message,
  sayHello () {
    console.log( 'hello! my name is ' + this.name );
  }
};


const greeting = person.sayHello();
console.log('hello world', greeting)