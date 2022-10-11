import './style.css';

const Socket = new WebSocket("ws://localhost:2000");

Socket.addEventListener('message', (data: MessageEvent<any>)=>{
  console.log(data)
})