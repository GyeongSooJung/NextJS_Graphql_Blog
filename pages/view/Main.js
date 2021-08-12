import React from 'react';
import { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';



//pages
import Header from '../../src/component/main/Header';
import Main from '../../src/component/main/Main';
import Footer from '../../src/component/main/Footer';
import Graphqlpage from '../../src/component/main/Graphqlpage'

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


export default function Blog({graphqlData}) {
  const classes = useStyles();
  
  const [section, setSection] = useState("Blog");
  const [Graphqldata,setGraphqlData] = useState(JSON.parse(graphqlData)); // graphql 데이터

  
  function pagefunction(section) {
    switch(section) {
      case  'Blog' :
        return ""
      case  'Graphql' :
        return (
          <Graphqlpage
            Graphqldata={Graphqldata}
            onChange={(childData) => { // Graphqlpage에서 받아온 쿼리로 바꿈
            
            }}
            />
          )
      default :
        return 
    }
  }

  
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
          {pagefunction(section)}
          </ApolloProvider>
        </main>
      </Container>
      <Footer title="Footer" description="Something here to give the footer a purpose!" />
    </React.Fragment>
  );
}




// graphql 모델쿼리를 위한 쿼리문 (처음엔 name, age, address 다 찾는다)
const Query = gql`
query{
        modelQuery(Query : "find", Collection : "Person", Data : {})
        {
          name
          age
          address
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
  
  
  //테이블 값들
  
  
  // zip 값들
  
  
  return {
    props : {
      graphqlData : JSON.stringify(data.modelQuery) // 위에 Myapp으로 보낼 apollo 결과값들
    }
  }
} 