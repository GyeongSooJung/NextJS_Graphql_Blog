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
  TextareaAutosize
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



export default function Graphqlpage(props) {
  const classes = useStyles();

    return (
        <Paper style={{margin : '50px', padding : '20px'}}>
        <Grid container className={classes.root} spacing={2}>
          <Grid item xs={7}>
          <List >
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
                      Ali Connors
                    </Typography>
                    }
                secondary={" I'll be in your neighborhood doing errands this…"}
                
              />
            </ListItem>
          </List>
          </Grid>
          <Grid item xs={5}>
            <Grid>
              <Typography> 이름 </Typography>
            </Grid>
            <Grid>
              <TextField label='name' />
            </Grid>

            <Grid>
            <Typography> 내용 </Typography>
            </Grid>
            <Grid>
            <TextareaAutosize aria-label="minimum height" minRows={3} placeholder="Minimum 3 rows" />
            </Grid>
          </Grid>
        </Grid>
        </Paper>
    )
}