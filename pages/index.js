import Axios from "axios";
import Head from "next/head";
import { useEffect, useState } from "react";
import {TextField} from '@material-ui/core';

import socketIOClient from "socket.io-client"; // 소켓 io

const ENDPOINT = "http://3.6.177.242:3001"; // 소켓 io 포트랑 연결


import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql
} from "@apollo/client";  // apollo 이용을 위한 것들



export default function Home({launches}) {
  
  // let data = JSON.parse(launches) // apollo로 가져온 데이터들
  // console.log("graphql data : " + data);
  
  //------------------------- socket id -------------
  
  const socket = socketIOClient(ENDPOINT);
  
  
  const [chat, setChat] = useState([]);
  const [chatState, setChatState] = useState({message : '', name : ''})
  const [currentSocket, setCurrentSocket] = useState();
  
  console.log("chat : "+JSON.stringify(chat));
  console.log("chatState : "+ JSON.stringify(chatState));
  
  useEffect(() => {
    socket.on('message',({name,message})=>{
      setChat([...chat,{name,message}])
    })
  }, []);

  const onTextChange = e =>{
    setChatState({...chatState,[e.target.name]: e.target.value})
  }

  const onMessageSubmit =(e)=>{
    e.preventDefault()
    const {name, message} = chatState
    socket.emit('message',{name, message})
    setChatState({message : '',name})
  }


  const renderChat =()=>{
    return chat.map(({name, message},index)=>(
      <div key={index}>
        <h3>{name}:<span>{message}</span></h3>
      </div>
    ))
  }

  return (
    <div className='card'>
      <form onSubmit={onMessageSubmit}>
        <h1>Message</h1>
        <div className="name-field">
          <TextField 
          name ="name" 
          onChange={e=> onTextChange(e)} 
          value={chatState.name}
          label="Name"/>
        </div>
        <div >
          <TextField 
          name ="message" 
          onChange={e=> onTextChange(e)} 
          value={chatState.message}
          id="outlined-multiline-static"
          variant="outlined"
          label="Message"/>
        </div>
        <button>Send Message</button>
      </form>
      <div className="render-chat">
        <h1>Chat log</h1>
        {renderChat()}
      </div>
    </div>
  );
}

//------------------------------graphql 서버 렌더링
// const Query = gql`
// query{
//   modelQuery(Query : "find", Collection : "Company", Data : {CEON : "변무영"})
//   {
//     CEON
//   }
// }
// `

// export async function getStaticProps(context) { // 서버 렌더링
  
//   const client = new ApolloClient({ // apollo 포트로 데이터 전송할 client 생성
//     uri : 'http://localhost:4000',
//     cache : new InMemoryCache()
//   })
  
//   const {data} = await client.query({ // apollo로 데이터 전송
//     query : Query
//   }) 
  
  
//   return {
    
//     props : {
//       launches : JSON.stringify(data.modelQuery) // 위에 Myapp으로 보낼 apollo 결과값들
      
//     }
//   }
// } 