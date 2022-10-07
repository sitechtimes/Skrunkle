import './style.css';

const Socket = new WebSocket("ws://localhost:2000");

Socket.onmessage?((event: MessageEvent<any>) => {
  console.log('Message from server ', event.data);
})

