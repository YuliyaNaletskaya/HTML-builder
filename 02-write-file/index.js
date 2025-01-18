const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, 'message.txt');
const writeStream = fs.createWriteStream(filePath, { flags: 'a' });
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Hello! Please enter your message. Type "exit" or "ctr + c" to quit.');

const handleInput = (input) => {
  if (input.trim().toLowerCase() === 'exit') {
    console.log('Goodbye!');
    rl.close();
  } else {
    writeStream.write(input + '\n');
    rl.question('Enter next message: ', handleInput);
  }
};

rl.question('Enter your message: ', handleInput);
rl.on('SIGINT', () => {
  console.log('\nGoodbye!');
  rl.close();
});