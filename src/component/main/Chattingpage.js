import Axios from "axios";
import Head from "next/head";
import { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Image from "next/image";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Paper,
  Grid,
  TextField,
  Typography,
  TextareaAutosize,
  Button
  } from '@material-ui/core';

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql
} from "@apollo/client";  // apollo 이용을 위한 것들

const useStyles = makeStyles({
  table: {
    Width: 300,
    Height: 300
  }
});

import socketIOClient from "socket.io-client"; // 소켓 io

//socket endpoint
const ENDPOINT = 'http://' + process.env.NEXT_PUBLIC_IP + ':' + process.env.NEXT_PUBLIC_Socket_Port;

export default function Graphqlpage(props) {
  const classes = useStyles();

  const socket = socketIOClient(ENDPOINT); // socket

  //socket을 위한 consts
  const [chatList,setChatList] = useState({array : []}); // 전체 채팅 리스트(처음엔 db로 받아오고 socket으로 왔다갔다함)
  const [Chat,setChat] = useState({name : '', chat : ''}); // TextField에 입력될 채팅

  useEffect(()=> { // socket이 들어올 때 Chatlist 바꿈
    socket.on('message',(array)=>{
      console.log("클라이언트 수신메세지 : "+array)
      setChatList({array : array})
    })
  },[])

  function chatHandler(e) {
    setChat({...Chat,[e.target.name] : e.target.value});
  }

  function sendChat() { // 메세지를 보내줌
  // 나중엔 db에 추가도 해줘야함( 불러올 때 한번, 보낼 때 한번 )
    const emptyarray = chatList.array
    emptyarray.push(Chat); // 현재 Chatlist 배열에 현재 chat을 추가해서 보낸다.
    setChatList({array : emptyarray})
    socket.emit('message',chatList.array)
  }

  console.log(Chat, chatList)

    return (
        <Paper style={{margin : '50px', padding : '20px'}}>
        <Grid container className={classes.root} spacing={2}>
          <Grid item xs={7}>
          <List >
              {chatList.array.map((chat) => (
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                    <Avatar />
                </ListItemAvatar>
                <ListItemText
                primary={<Typography
                      component="span"
                      variant="body2"
                      color="textPrimary"
                    >
                      {chat.name}
                    </Typography>
                    }
                secondary={chat.chat}
                
                />
              </ListItem>  
              ))}
          </List>
          </Grid>
          <Grid item xs={5}>
            <Grid>
              <Typography> 이름 </Typography>
            </Grid>
            <Grid>
              <TextField
                name='name'
                label='name'
                value={Chat.name}
                onChange={chatHandler} />
            </Grid>

            <Grid>
              <Typography> 내용 </Typography>
            </Grid>
            <Grid>
              <TextareaAutosize
                name="chat"
                label="chat"
                aria-label="minimum height"
                minRows={3}
                placeholder="Contents"
                value={Chat.chat}
                onChange={chatHandler} />
            </Grid>
            <Grid>
              <Button onClick={sendChat}>send</Button>

            </Grid>
          </Grid>
        </Grid>
        </Paper>
    )
}