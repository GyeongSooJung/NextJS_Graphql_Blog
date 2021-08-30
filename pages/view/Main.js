import React from 'react';
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import {
  Paper,
  Typography
  } from '@material-ui/core';
//pages
import Header from '../../src/component/main/Header';
import Main from '../../src/component/main/Main';
import Footer from '../../src/component/main/Footer';
import Graphqlpage from '../../src/component/main/Graphqlpage';
import Chattingpage from '../../src/component/main/Chattingpage';
import Filepage from '../../src/component/main/Filepage';
import Tablepage from '../../src/component/main/Tablepage';
import Addresspage from '../../src/component/main/Addresspage';
// import Alarmpage from '../../src/component/main/Alarmpage';
import Paypage from '../../src/component/main/Paypage';

//Axios
import Axios from 'axios'

//SSR apollo
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql
} from "@apollo/client";

import { useCookies } from "react-cookie";

const client = new ApolloClient({
  uri: 'http://localhost:4000',
  cache: new InMemoryCache()
});

const useStyles = makeStyles((theme) => ({
  mainGrid: {
    marginTop: theme.spacing(3),
  },
}));

const sections = [
  { title: 'Graphql', url: '#' },
  { title: 'Chatting', url: '#' },
  { title: 'File', url: '#' },
  { title: 'Table', url: '#' },
  { title: 'Address', url: '#' },
  { title: 'Pay', url: '#' }
];


export default function Blog({SSRdata}) {
  const classes = useStyles();
  const router = useRouter();
  const [cookies, setCookie, removeCookie] = useCookies(['isLogined']);

  useEffect(() => { // 쿠키가 없을 때 메인화면으로
    if(cookies.isLogined  === undefined){
      router.push('/');
    }
  },[]);

  const [section, setSection] = useState("Blog");
  const [Graphqldata,setGraphqlData] = useState(SSRdata.modelQuery); // graphql 데이터
  const [TableData,setTableData] = useState(SSRdata.schools);


  function pagefunction(section) {
    switch(section) {
      case  'Blog' :
        return (
          <Paper style={{margin : '50px', padding : '20px'}}>
          <Typography>서버 사이드 렌더링(SSR) 데이터</Typography>
          {JSON.stringify(SSRdata)}
          </Paper>
        )
      case  'Graphql' :
        return (
          <Graphqlpage
            gqldata={Graphqldata}
            onChange={(childData) => { // Graphqlpage에서 받아온 쿼리로 바꿈
            
            }}
            />
          )
      case 'Chatting' :
        return (
          <Chattingpage
            onChange={(childData) => { // Chattingpage에서 받아온 쿼리로 바꿈
            
            }}
            />
        )
      case 'File' :
        return (
          <Filepage
            onChange={(childData) => { // Zippage에서 받아온 쿼리로 바꿈
              
            }}
          />
        )
      case 'Table' :
        return (
          <Tablepage
            tbdata={TableData}
            onChange={(childData) => { // Zippage에서 받아온 쿼리로 바꿈
              
            }}
          />
        )
      case 'Address' :
        return (
          <Addresspage
            onChange={(childData) => { // Zippage에서 받아온 쿼리로 바꿈
              
            }}
          />
        )
      // case 'Alarm' :
      //   return (
      //     <Alarmpage
      //       onChange={(childData) => { // Zippage에서 받아온 쿼리로 바꿈
              
      //       }}
      //     />
      //   )
      case 'Pay' :
        return (
          <Paypage
            onChange={(childData) => { // Zippage에서 받아온 쿼리로 바꿈
              
            }}
          />
        )
      
      default :
        return (
          <Paper style={{margin : '50px', padding : '20px'}}>
          {SSRdata}
          </Paper>
        )
        return 
    }
  }

  
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth ={false}>
        <Header title="Blog"
        section={section}
        sections={sections}
        onChange={(value) => { setSection(value.section) } }
        />
        <main>
          <Grid container spacing={5} className={classes.mainGrid}>
            <Main title={section}/>
          </Grid>
          <ApolloProvider client={client}>
          {pagefunction(section)}
          </ApolloProvider>
        </main>
      </Container>
      <Footer title="Footer" description="티포의 개인 개발 블로그 " />
    </React.Fragment>
  );
}




// graphql 모델쿼리를 위한 쿼리문 (처음엔 name, age, address 다 찾는다)
const Query = gql`
query{
        modelQuery(Query : "find", Collection : "Person", Data : {})
        {
          _id
          name
          age
          address
        }
        schools {
          _id
          name
          division
          type
        }
      }
`


//서버 사이드 렌더링은 pages 안에서만 가능한가보다
export async function getServerSideProps(context) { // 서버 렌더링
  
  const client = new ApolloClient({ // apollo 포트로 데이터 전송할 client 생성
    uri : 'http://localhost:'+process.env.NEXT_PUBLIC_Graphql_Port,
    cache : new InMemoryCache()
    })
  
  const {data} = await client.query({ // apollo로 데이터 전송
    query : Query // 처음에는 위에서 선언한 쿼리문으로 일단 불러옴( 나중에 바뀌면 다시 부르게끔 )
  }) 
  //채팅에서 쓰일 값들
  
  // zip 값들
  
  
  return {
    props : {
      SSRdata : data // 위에 Myapp으로 보낼 apollo 결과값들
    }
  }
} 