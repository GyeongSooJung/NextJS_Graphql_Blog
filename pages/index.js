import React from 'react';
import { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Header from '../src/component/main/Header';
import Main from '../src/component/main/Main';
import Footer from '../src/component/main/Footer';

import Axios from 'axios'

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql
} from "@apollo/client";

const client = new ApolloClient({
  uri: 'http://localhost:4000',
  cache: new InMemoryCache()
});

import Graphqlpage from '../src/component/main/Graphqlpage'

const useStyles = makeStyles((theme) => ({
  mainGrid: {
    marginTop: theme.spacing(3),
  },
}));

const sections = [
  { title: 'Graphql', url: '#' },
  { title: 'Chatting', url: '#' },
  { title: 'ZIP', url: '#' },
  { title: 'Table', url: '#' }
];

// graphql 모델쿼리를 위한 쿼리문
const Query = gql`
query{
  modelQuery(Query : "find", Collection : "Company", Data : {CEON : "변무영"})
  {
    CEON
  }
}
`

export default function Blog({graphqlData}) {
  const classes = useStyles();
  
  const [section, setSection] = useState("");
  
  const [Graphqldata,setGraphqlData] = useState(graphqlData); // graphql 데이터
  const [modelQuery,setModelQuery] = useState(Query); // 쿼리문이 바뀔경우 데이터 바뀌게끔
  
  
  // useEffect( 
  //   async () => { // query문이 바뀔 경우 데이터를 다시 부르는 함수
    
  //   const client = new ApolloClient({ // apollo 포트로 데이터 전송할 client 생성
  //   uri : 'http://localhost:4000',
  //   cache : new InMemoryCache()
  //   })
  
  // const {data} = await client.query({ // apollo로 데이터 전송
  //   query : Query // 처음에는 위에서 선언한 쿼리문으로 일단 불러옴( 나중에 바뀌면 다시 부르게끔 )
  // }) 
  // },[modelQuery])

  async function graphqlHandler() { //클라이언트에서 보내는 graphql
    Axios({
      url: 'http://3.6.177.242:4000',
      method: 'post',
      data: {
        query: `
            query{
              modelQuery(Query : "find", Collection : "Company", Data : {CEON : "변무영"})
              {
                CNA
              }
            }
          `
      }
    }).then((result) => {
      console.log("data = "+JSON.stringify(result.data))
    });
  }
  
  console.log("modelQuery : "+JSON.stringify(modelQuery))
  console.log("graphqlData : "+graphqlData)
  
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg">
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
            <Graphqlpage
            graphqlData={graphqlData}
            onChange={(childData) => { // Graphqlpage에서 받아온 쿼리로 바꿈
              setModelQuery(childData.Query);
              graphqlHandler();
            }}
            />
          </ApolloProvider>
        </main>
      </Container>
      <Footer title="Footer" description="Something here to give the footer a purpose!" />
    </React.Fragment>
  );
}



//서버 사이드 렌더링은 pages 안에서만 가능한가보다
export async function getServerSideProps(context) { // 서버 렌더링
  
  const client = new ApolloClient({ // apollo 포트로 데이터 전송할 client 생성
    uri : 'http://localhost:4000',
    cache : new InMemoryCache()
    })
  
  const {data} = await client.query({ // apollo로 데이터 전송
    query : gql`
      query{
        modelQuery(Query : "find", Collection : "Company", Data : {CEON : "변무영"})
        {
          CEON
        }
      }
      ` // 처음에는 위에서 선언한 쿼리문으로 일단 불러옴( 나중에 바뀌면 다시 부르게끔 )
  }) 
  return {
    
    props : {
      graphqlData : JSON.stringify(data.modelQuery) // 위에 Myapp으로 보낼 apollo 결과값들
      
    }
  }
} 