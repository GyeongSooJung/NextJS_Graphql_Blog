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
  },
  paper : {
    height : 450,
    margin : '20px',
    padding : '20px'
  },
  gridcontainer : {
    margin : '5px',
    padding : '5px'
  },
  griditem : {
    margin : '5px',
    padding : '5px'
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

    return (
      <div>
      <Grid container  spacing={2}>
        <Grid item xs={6} lg={6}>
          <Paper className={classes.paper}>
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
          </Paper>
        </Grid>
        <Grid item xs={6} lg={6}>
          <Paper className={classes.paper}>
            <Grid className={classes.griditem} container justifyContent='center' alignItems='center' spacing={2}>
              <Grid item>     
                <Typography> 이름 </Typography>
              </Grid>
            </Grid>
            <Grid className={classes.griditem} container justifyContent='center' alignItems='center' spacing={2}>
              <Grid item>
                <TextField
                  name='name'
                  label='name'
                  value={Chat.name}
                  onChange={chatHandler} />
              </Grid>
            </Grid>
            <Grid className={classes.griditem} container justifyContent='center' alignItems='center' spacing={2}>
              <Grid item>
                <Typography> 내용 </Typography>
              </Grid>
              <Grid item>
            </Grid>
            <Grid className={classes.griditem} container justifyContent='center' alignItems='center' spacing={2}>
                <TextareaAutosize
                  name="chat"
                  label="chat"
                  aria-label="minimum height"
                  minRows={3}
                  placeholder="Contents"
                  value={Chat.chat}
                  onChange={chatHandler} />
              </Grid>
            </Grid>
            <Grid className={classes.griditem} container justifyContent='center' alignItems='center' spacing={2}>
              <Grid item>
                <Button onClick={sendChat} variant="contained" color="primary">send</Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      </div>
    )
}