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
  TableRow,
  AppBar,
  Tabs,
  Tab,
  Typography,
  Box
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
  },
});

function createRow(name, age, address) {
  return {name, age, address}
}


export default function Graphqlpage(props) {
  const classes = useStyles();
  
  const [GraphqlData,setGraphqlData] = useState(JSON.parse(props.gqldata)) // 상위에서 가져온 DB값들 (string으로 받아왔기 때문에 parse)
  const [Query, setQuery] = useState('');
  const [rows, setRows] = useState(() => { // 처음 rows는 처음 query로 가져온 데이터들을 모아둔 것
      let array = []
      for (var i = 0; i< GraphqlData.length; i ++) {
        array.push(createRow(GraphqlData[i].name, GraphqlData[i].age, GraphqlData[i].address ));
      }
      return array
    });




  
  // useEffect(() => { // 처음 rows는 처음 query로 가져온 데이터들을 모아둔 것
  //   let array = []
  //   for (var i = 0; i< data.modelQuery.length; i ++) {
  //     array.push(createRow(data.modelQuery[i]));
  //   }
  //   setRows(array);
  // }, [data]);
  console.log("data : " + JSON.stringify(GraphqlData));
  console.log("rows : " + JSON.stringify(rows));


  //Tab을 위한 것들-------------------------------------------------

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }


  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
  
  // function ChangeQueryHander() { // 쿼리문을 바꿔주고 결과 출력하는 함수
  //   const Query = gql`
  //   query{
  //     modelQuery(Query : "find", Collection : "Person", Data : {name : "경수"})
  //     {
  //       name
  //     }
  //   }
  //   `
  //   setQuery(Query);
    
  //   Axios({
  //     url: process.env.NEXT_PUBLIC_IP+':'+process.env.NEXT_PUBLIC_Graphql_Port,
  //     method: 'post',
  //     data: {
  //         query: Query
  //     }
  //   }).then((result) => {
  //   });
    
  //   // const childData = {Query : Query}
  //   // props.onChange(childData) //부모에게 보내는 데이터
  // }

  return (
    <div className='graphql'>
      = SSR로 불러온 DB 데이터들=
      <Paper style={{margin : '20px', width : 700}}>
      <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">name</TableCell>
            <TableCell align="center">age</TableCell>
            <TableCell align="center">address</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell align="center">{row.name}</TableCell>
              <TableCell align="center">{row.age}</TableCell>
              <TableCell align="center">{row.address}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
      </Paper>
      
      <Paper style={{margin : '20px', width : 700}}>
        쿼리문
        <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
          <Tab label="Create" {...a11yProps(0)} />
          <Tab label="Find" {...a11yProps(1)} />
          <Tab label="Update" {...a11yProps(2)} />
          <Tab label="Delete" {...a11yProps(3)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        Collection : Person
        Data : (name : , age : , address : )
      </TabPanel>
      <TabPanel value={value} index={1}>
        Collection : Person
        Data : (name : , age : , address : )
      </TabPanel>
      <TabPanel value={value} index={2}>
        Collection : Person
        Data : (name : , age : , address : )
      </TabPanel>
      <TabPanel value={value} index={3}>
        Collection : Person
        Data : (name : , age : , address : )
      </TabPanel>

        <Button variant="contained" color="primary">
        query 전송
        </Button>
      </Paper>
      
      <Paper style={{margin : '20px'}}>
      쿼리 결과값 : 
      </Paper>
      
    </div>
  );
}
