// const app = require('express')()
// const server = require('http').createServer(app)
// const cors = require('cors')
// const io = require('socket.io')(server,{
//     cors : {
//         origin :"*",
//         credentials :true,
//         methods : ['GET','POST']
//     }
// });


// io.on('connection', socket=>{
//     socket.on('message',({name,message}) => {
//         console.log("@@@")
//         io.emit('message',({name, message}))
//     })
// })

// server.listen(3001, function(){
//     console.log('listening on port 3001');
// })

const {createServer: https} = require('https');
const {createServer: http} = require('http');
const {parse} = require('url');
const next = require('next');
const fs = require('fs');

const dev = process.env.NODE_ENV !== 'production';
const app = next({dev});
const handle = app.getRequestHandler();

const socketapp = require('express')()
const socketserver = require('http').createServer(app)
const cors = require('cors')

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
  http: process.env.NEXT_PUBLIC_React_Port,
  socket: process.env.NEXT_PUBLIC_Socket_Port
};


app.prepare().then(() => {
  http((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(ports.http, (err) => {
    if (err) throw err;
    console.log(`listening on Next port ${ports.http}`);
  });
  
   socketserver.listen(ports.socket, function(){
    console.log('listening on socket port 3001');
    })
});