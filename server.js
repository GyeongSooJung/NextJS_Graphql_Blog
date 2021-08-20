const express = require('express');
const next = require('next');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const dotenv = require('dotenv');

const dev = process.env.NODE_ENV !== 'production';
const prod = process.env.NODE_ENV === 'production';

dotenv.config();

const app = next({ dev }); // next 모듈을 사용
const handle = app.getRequestHandler();

//socket
const socketapp = require('express')()
const socketserver = require('http').createServer(app)
const cors = require('cors');
socketapp.use(cors());

const io = require('socket.io')(socketserver,{
    cors : {
        origin: process.env.NEXT_PUBLIC_IP+":"+process.env.NEXT_PUBLIC_React_Port, //해보니까 localhost는 안됨
        methods: ["GET", "POST"],
        allowedHeaders: ["*"],
        credentials: true,
    }
});

io.on('connection', socket=>{
    console.log("소켓 연결")
    socket.on('message',({name,message}) => {
        console.log("@@@")
        io.emit('message',({name, message}))
    })
})




const ports = {
  next: process.env.NEXT_PUBLIC_React_Port,
  socket: process.env.NEXT_PUBLIC_Socket_Port
};


app.prepare().then(() => {
  const server = express(); // back 서버에서의 const app = express()

  server.use(morgan('dev'));
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));
  server.use(cookieParser(process.env.COOKIE_SECRET));
  server.use(
    expressSession({
      resave: false,
      saveUninitialized: false,
      secret: process.env.COOKIE_SECRET, // backend 서버와 같은 키를 써야한다.
      cookie: {
        httpOnly: true,
        secure: false,
      },
    }),
  );
  
  server.get('/hashtag/:tag', (req, res) => {
    return app.render(req, res, '/hashtag', { tag: req.params.tag });
  });

  server.get('/user/:id', (req, res) => {
    return app.render(req, res, '/user', { id: req.params.id });
  });

  server.get('*', (req, res) => { // 모든 get 요청 처리
    return handle(req, res); // next의 get 요청 처리기
  });

  //nextserver
  server.listen(ports.next, () => {
    console.log('next+expresss running on port 3000');
  });

  //socketserver
  socketserver.listen(ports.socket, function(){
    console.log('listening on socket port 3001');
    })
});