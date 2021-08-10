import Axios from "axios";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Button, CssBaseline, TextField, Link, Grid, Container, Popper, Grow, Paper, ClickAwayListener, MenuList, MenuItem } from '@material-ui/core';

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql
} from "@apollo/client";  // apollo 이용을 위한 것들



export default function Graphqlpage(props) {
  
  const [Graphqldata,setGraphqlData] = useState(props.graphqlData);
  const [Query, setQuery] = useState(``);
  
  
  useEffect(() => { 
  }, []);
  
  function ChangeQueryHander() { // 쿼리문을 바꿔주는 핸들러
    const Query = gql`
    query{
      modelQuery(Query : "find", Collection : "Company", Data : {CEON : "변무영"})
      {
        CNA
      }
    }
    `
    setQuery(Query);
    
    const childData = {Query : Query}
    props.onChange(childData)
  }

  return (
    <div className='graphql'>
      <Button
      onClick={ChangeQueryHander}>
      asdasd
      </Button>
    </div>
  );
}
