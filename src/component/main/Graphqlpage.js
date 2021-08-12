import Axios from "axios";
import Head from "next/head";
import { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Container,
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
  MenuList,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
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
    minWidth: 650,
  },
});




export default function Graphqlpage(props) {
  const classes = useStyles();
  
  const [Graphqldata,setGraphqlData] = useState(props.Graphqldata); //Main에서 SSR로 받아온 전체 데이터
  const [Query, setQuery] = useState(``);
  const [rows, setRows] = useState()
  
  console.log(Graphqldata)
  
  useEffect(() => {
  }, []);
  
  
  function ChangeQueryHander() { // 쿼리문을 바꿔주고 결과 출력하는 함수
    const Query = gql`
    query{
      modelQuery(Query : "find", Collection : "Person", Data : {name : "경수"})
      {
        name
      }
    }
    `
    setQuery(Query);
    
    Axios({
      url: process.env.NEXT_PUBLIC_IP+':'+process.env.NEXT_PUBLIC_Graphql_Port,
      method: 'post',
      data: {
          query: Query
      }
    }).then((result) => {
    });
    
    // const childData = {Query : Query}
    // props.onChange(childData) //부모에게 보내는 데이터
  }
  
  console.log(Graphqldata)

  return (
    <div className='graphql'>
      <Paper style={{margin : '20px'}}>
      = SSR로 불러온 DB 데이터들=
      </Paper>
      
      <Paper style={{margin : '20px'}}>
        쿼리문
        <Button
        onClick={ChangeQueryHander}>
        query 변환 버튼
        </Button>
      </Paper>
      
      <Paper style={{margin : '20px'}}>
      쿼리 결과값 : 
      {Graphqldata}
      </Paper>
      
    </div>
  );
}
