import React from 'react';
import { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

import { useRouter } from "next/router";
import { useCookies } from "react-cookie";

const useStyles = makeStyles((theme) => ({
  toolbar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbarTitle: {
    flex: 1,
  },
  toolbarSecondary: {
    justifyContent: 'space-between',
    overflowX: 'auto',
  },
  toolbarLink: {
    padding: theme.spacing(1),
    flexShrink: 0,
  },
}));

export default function Header(props) {
  const classes = useStyles();
  const { sections, title } = props;
  const [section,setSection] = useState(props.section)

  const router = useRouter();
  const [cookies, setCookie, removeCookie] = useCookies(['isLogined']);

  
  function sectionHandler(event) {
    console.log(event.target.innerHTML)
    setSection(event.target.innerHTML);
    const value = {section : event.target.innerHTML}
    props.onChange(value)
  }
  
  function logout() {

    let result = window.confirm("로그아웃 하시겠습니까?");
    if(result) {
      removeCookie('isLogined');
      router.push('/')
    }
  }

  return (
    <React.Fragment>
      <Toolbar className={classes.toolbar}>
        <Typography
          component="h2"
          variant="h5"
          color="inherit"
          align="center"
          noWrap
          className={classes.toolbarTitle}
          onClick={()=>{setSection("Blog")}}
        >
          GS's Blog
        </Typography>
        <Button
         variant="outlined"
         size="small"
         onClick={logout}>
          Log out
        </Button>
      </Toolbar>
      <Toolbar component="nav" variant="dense" className={classes.toolbarSecondary}>
        {sections.map((section) => (
          <Link
            color="inherit"
            noWrap
            key={section.title}
            variant="body2"
            href={section.url}
            className={classes.toolbarLink}
            onClick={sectionHandler}
          >
            {section.title}
          </Link>
        ))}
      </Toolbar>
    </React.Fragment>
  );
}

Header.propTypes = {
  sections: PropTypes.array,
  title: PropTypes.string,
};