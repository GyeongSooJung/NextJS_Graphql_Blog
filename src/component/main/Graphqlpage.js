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
  Box,
  FormControl,
  InputLabel,
  Select
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
});

function createRow(id, name, age, address, objectID) {
  return {id, name, age, address, objectID}
}


export default function Graphqlpage(props) {
  const classes = useStyles();
  
  const [GraphqlData,setGraphqlData] = useState(props.gqldata) // 상위에서 가져온 DB값들 (string으로 받아왔기 때문에 parse)
  const [rows, setRows] = useState(() => { // 처음 rows는 처음 query로 가져온 데이터들을 모아둔 것
      let array = []
      for (var i = 0; i< GraphqlData.length; i ++) {
        array.push(createRow(i, GraphqlData[i].name, GraphqlData[i].age, GraphqlData[i].address, GraphqlData[i]._id ));
      }
      return {array : array}
    });
  const [indexID, setIndexID] = useState(0);
  const [objectID, setObjectID] = useState('')

  // Tab consts
  const [tabvalue, setTabValue] = useState(0);
  const [modelqueryQuery, setModelqueryQuery] = useState('create');
  const [modelqueryData, setModelqueryData] = useState({name : "", age : "", address : ""});

  //query result
  const [queryResult, setQueryResult] = useState('');

  //update data
  const [updateLabel, setUpdateLabel] = useState({name : "", age : "", address : "", id : 0});

  //Tab을 위한 것들-------------------------------------------------

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

  function createHandler(e) {
    setModelqueryData({...modelqueryData,[e.target.name] : e.target.value})
  }

  function ChangeQuery(e) {
    setModelqueryQuery(e.target.value);
    setModelqueryData({name : "", age : "", address : ""});
    setUpdateLabel({name : "", age : "", address : "", id : 0});
    setIndexID('none');
  }

  function ChangeID(e) {
    setIndexID(e.target.value);
    let result = rows.array.filter((index) => {
      return index.id=== e.target.value
    })

    setUpdateLabel(result[0]) // 라벨 바꿔줌
    setObjectID(result[0].objectID) // 오브젝트아이디( axios로 보낼 것 )
  }


  //graphql에 쿼리 전송
  function sendQuery() {
    if(modelqueryQuery === 'create') {
      Axios({
        url: 'http://'+process.env.NEXT_PUBLIC_IP+':'+process.env.NEXT_PUBLIC_Graphql_Port,
        method: 'post',
        data : {
          query : `
            query{
              modelQuery(Query : "${modelqueryQuery}", Collection : "Person", Data : {name : "${modelqueryData.name}", age : "${modelqueryData.age}", address : "${modelqueryData.address}"})
              {
                _id
                name
                age
                address
              }
            }
          `
        }
      }).then((result) => {
          let array = rows.array
          let data = result.data.data.modelQuery[0]
          data.id = array.length + 1
          array.push(data)
          setQueryResult(JSON.stringify(result.data.data.modelQuery[0]))
          setRows({array : array});
      }).catch((error) => {
        console.log(error)
      })
    }
    else if (modelqueryQuery === 'find') {
      Axios({
        url: 'http://'+process.env.NEXT_PUBLIC_IP+':'+process.env.NEXT_PUBLIC_Graphql_Port,
        method: 'post',
        data : {
          query : `
            query{
              modelQuery(Query : "${modelqueryQuery}", Collection : "Person", Data : {name : "${modelqueryData.name}"})
              {
                _id
                name
                age
                address
              }
            }
          `
        }
      }).then((result) => {
          setQueryResult(JSON.stringify(result.data.data.modelQuery))
      }).catch((error) => {
        console.log(error)
      })
    }
    else if (modelqueryQuery === 'update') {
      Axios({
        url: 'http://'+process.env.NEXT_PUBLIC_IP+':'+process.env.NEXT_PUBLIC_Graphql_Port,
        method: 'post',
        data : {
          query : `
            query{
              modelQuery(Query : "${modelqueryQuery}", Collection : "Person", Data : { where : { _id : "${objectID}" }, update : { name : "${modelqueryData.name}", age : "${modelqueryData.age}", address : "${modelqueryData.address}" }})
              {
                result
              }
            }
          `
        }
      }).then((result) => {
         var array = rows.array
         for (var i = 0 ; i < rows.array.length; i ++) {
           if( rows.array[i].objectID === objectID ) {
              array[i].name = modelqueryData.name;
              array[i].age = modelqueryData.age;
              array[i].address = modelqueryData.address;
           }
         }
         setRows({array : array});
      }).catch((error) => {
        console.log(error)
      })
    }
    else if (modelqueryQuery === 'delete') {

      Axios({
        url: 'http://'+process.env.NEXT_PUBLIC_IP+':'+process.env.NEXT_PUBLIC_Graphql_Port,
        method: 'post',
        data : {
          query : `
            query{
              modelQuery(Query : "remove", Collection : "Person", Data : { _id : "${objectID}" })
              {
                result
              }
            }
          `
        }
      }).then((result) => {
         var array = rows.array;
         for (var i = 0 ; i < rows.array.length; i ++) {
           if( rows.array[i].objectID === objectID ) {
             array.splice(i, 1)
           }
         }
         for (var i = 0; i < array.length; i ++) {
           array[i].id = i
         }
         setRows({array : array});
      }).catch((error) => {
        console.log(error)
      })

    }
  }


  return (
    <div>
        <Paper style={{margin : '50px', padding : '20px'}}>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">id</TableCell>
                  <TableCell align="center">name</TableCell>
                  <TableCell align="center">age</TableCell>
                  <TableCell align="center">address</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.array.map((row) => (
                <TableRow key={row.objectID}>
                <TableCell align="center">{row.id}</TableCell>
                  <TableCell align="center">{row.name}</TableCell>
                  <TableCell align="center">{row.age}</TableCell>
                  <TableCell align="center">{row.address}</TableCell>
                </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      
        <Paper style={{margin : '50px', padding : '20px'}}>
            <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Query</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={modelqueryQuery}
              onChange={ChangeQuery}
            >
              <MenuItem value={'create'}>create</MenuItem>
              <MenuItem value={'find'}>find</MenuItem>
              <MenuItem value={'update'}>update</MenuItem>
              <MenuItem value={'delete'}>delete</MenuItem>
            </Select>
          </FormControl>
          {(modelqueryQuery === 'create' ) ?
            <TableContainer component={Paper} style={{height : '300px'}}>
              <form noValidate >
              <Table className={classes.table} aria-label="simple table">
                <TableBody>
                  <TableRow key={'query'}>
                    <TableCell align="center">name</TableCell>
                    <TableCell align="center">
                    <TextField
                    name="name"
                    label="name"
                    autoComplete="name"
                    value={modelqueryData.name}
                    onChange={createHandler} />
                    </TableCell>
                  </TableRow>
                  <TableRow key={'query2'}>
                    <TableCell align="center">age</TableCell>
                    <TableCell align="center">
                    <TextField
                    name="age"
                    label="age"
                    autoComplete="age"
                    value={modelqueryData.age}
                    onChange={createHandler} />
                    </TableCell>
                  </TableRow>
                  <TableRow key={'query3'}>
                    <TableCell align="center">address</TableCell>
                    <TableCell align="center">
                    <TextField
                    name="address"
                    label="address"
                    autoComplete="address"
                    value={modelqueryData.address}
                    onChange={createHandler} />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              </form>
            </TableContainer>
          : ""}
          {(modelqueryQuery === 'find') ? 
          <TableContainer component={Paper} style={{height : '300px'}}>
              <form noValidate >
              <Table className={classes.table} aria-label="simple table">
                <TableBody>
                  <TableRow key={'query'}>
                    <TableCell align="center">name</TableCell>
                    <TableCell align="center">
                    <TextField
                    name="name"
                    label="name"
                    autoComplete="name"
                    value={modelqueryData.name}
                    onChange={createHandler} />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              </form>
            </TableContainer>
            : ""}
            {(modelqueryQuery === 'update') ? 
            <TableContainer component={Paper} style={{height : '320px'}}>
              <form noValidate >
              <Table className={classes.table} aria-label="simple table">
                <TableBody>
                  <TableRow key={'query'}>
                    <TableCell align="center">id</TableCell>
                    <TableCell align="center">
                      <FormControl className={classes.formControl}>
                        <InputLabel id="demo-simple-select-label">id</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={indexID}
                          onChange={ChangeID}
                        >
                        {rows.array.map((row) => (
                          <MenuItem value={row.id}>{row.id}</MenuItem>
                        ))
                        }
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>
                  <TableRow key={'query2'}>
                    <TableCell align="center">name</TableCell>
                    <TableCell align="center">
                    <TextField
                    name="name"
                    label={updateLabel.name}
                    autoComplete="name"
                    value={modelqueryData.name}
                    onChange={createHandler} />
                    </TableCell>
                  </TableRow>
                  <TableRow key={'query3'}>
                    <TableCell align="center">age</TableCell>
                    <TableCell align="center">
                    <TextField
                    name="age"
                    label={updateLabel.age}
                    autoComplete="age"
                    value={modelqueryData.age}
                    onChange={createHandler} />
                    </TableCell>
                  </TableRow>
                  <TableRow key={'query4'}>
                    <TableCell align="center">address</TableCell>
                    <TableCell align="center">
                    <TextField
                    name="address"
                    label={updateLabel.address}
                    autoComplete="address"
                    value={modelqueryData.address}
                    onChange={createHandler} />
                    </TableCell>
                  </TableRow>
                  
                </TableBody>
              </Table>
              </form>
            </TableContainer>
            : "" }  
            {(modelqueryQuery === 'delete') ?
            <TableContainer component={Paper} style={{height : '320px'}}>
              <form noValidate >
              <Table className={classes.table} aria-label="simple table">
                <TableBody>
                  <TableRow key={'query'}>
                    <TableCell align="center">id</TableCell>
                    <TableCell align="center">
                      <FormControl className={classes.formControl}>
                        <InputLabel id="demo-simple-select-label">id</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={indexID}
                          onChange={ChangeID}
                        >
                        {rows.array.map((row) => (
                          <MenuItem value={row.id}>{row.id}</MenuItem>
                        ))
                        }
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>
                  <TableRow key={'query2'}>
                    <TableCell align="center">name</TableCell>
                    <TableCell align="center">
                    <TextField
                    value={updateLabel.name}
                    InputProps={{
                      readOnly: true,
                    }} />
                    </TableCell>
                  </TableRow>
                  <TableRow key={'query3'}>
                    <TableCell align="center">age</TableCell>
                    <TableCell align="center">
                    <TextField
                    value={updateLabel.age}
                    InputProps={{
                      readOnly: true,
                    }} />
                    </TableCell>
                  </TableRow>
                  <TableRow key={'query4'}>
                    <TableCell align="center">address</TableCell>
                    <TableCell align="center">
                    <TextField
                    value={updateLabel.address}
                    InputProps={{
                      readOnly: true,
                    }} />
                    </TableCell>
                  </TableRow>
                  
                </TableBody>
              </Table>
              </form>
            </TableContainer>

             : "" }
            <Button variant="contained" color="primary" onClick={sendQuery}>
            query 전송
            </Button>
        </Paper>
        <Paper style={{margin : '50px', padding : '20px'}}>
        쿼리 결과값 : {queryResult}
        </Paper>
    </div>
  );
}
