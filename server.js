const express = require('express');
const { SerialPort, ReadlineParser } = require('serialport');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

const port = new SerialPort({ path: 'COM5', baudRate: 9600 }); // Change COM port as needed
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

parser.on('data', (line) => {
  const [left, right] = line.split(',').map(x => x === "1");
  io.emit('status', { left, right });
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
