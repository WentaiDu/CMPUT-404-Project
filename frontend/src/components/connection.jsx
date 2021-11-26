import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';

const base_url = process.env.REACT_APP_API_URL || 'http://localhost:8000';
// const curent_url = window.location.href;
const curent_url = "http://localhost:3000";
//

class ConnectComponent extends React.Component {
  constructor(){
    super();
    this.state = {
        token: "d24dab8fb212465e7c88b7d165456a482e26a6ff",
        url: "https://socialdistribution-t02.herokuapp.com",
        authorId:"91348e6a-1bcb-43c7-8108-2a77cc6c15d2",
        value:[],
    }
  }

  getVlaue = () => {
    console.log(this.state.url);
    console.log(this.state.token);
    console.log(this.state.authorId);

    axios.get(`${this.state.url}/author/${this.state.authorId}/posts/`,    
    {
      headers: {
        Authorization: "token " + this.state.token,
      },
    })
      .then(res => {
        const value = res.data;
        console.log(value);
        this.setState( value );
    }).catch(e => {
        console.log("get failed")
    })
  }

    handleForm = e => {
        const target = e.target;

        const value = target.type === "checkbox"
        ? target.checked
        : target.value;

        const name = target.name;
        console.log(name)
        console.log(value)
        this.setState({
            [name]:value
        })
    }

  renderValue(){
    const {value} = this.state;
    return value.length === 0
        ? (<ListItem>
          <ListItemText primary="404 Not Found" secondary="" />
          </ListItem>)
        : (value.map(item => (
          <ListItem key = {item.post_id}>
            <ListItemText primary={item.title} secondary={item.description} />
          </ListItem> ))
          )

        };

    render(){
    const {token,authorId,url} = this.state;

      return (
          
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
        <TextField
        required
        name="token"
        label="token"
        fullWidth
        variant="standard"
        value={token}
        onChange={this.handleForm}
      />     
        <TextField
        required
        name="authorId"
        label="authorId"
        fullWidth
        variant="standard"
        value={authorId}
        onChange={this.handleForm}
      />                   
        <TextField
        required
        name="url"
        label="url"
        fullWidth
        variant="standard"
        value={url}
        onChange={this.handleForm}
        />
        <Button
            type="connect"
            variant="contained"
            sx={{
                width: 100,
                m:'auto',
                borderRadius: 15,
                backgroundColor: "#00428b",
            }}
            onClick={this.getVlaue}
        >
            Submit
        </Button>
          <List
            sx={{
              width: '100%',
              maxWidth: 360,
              bgcolor: 'background.paper',
            }}
          >
            {this.renderValue()}
          </List>
        </Grid>
      )
    }
}

export default function Connection() {


  return(<ConnectComponent/>);
}
