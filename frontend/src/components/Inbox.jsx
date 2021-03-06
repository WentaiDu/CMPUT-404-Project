import * as React from 'react';
import { useState, useContext, useEffect } from "react";
import InboxList from "./InboxType/InboxList";
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Link, Typography, TextField} from "@material-ui/core";
import Card from "@mui/material/Card";
import axios from "axios";
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import Stack from '@mui/material/Stack';

export default function Inbox() {
    const token = localStorage.getItem('jwtToken')
    const id = localStorage.getItem('userID')
    const base_url = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    // const messages = getMockData().items
    const [messages, setMessages] = useState([]);
    useEffect(()=>{
            axios.get(
              `${base_url}/author/${id}/inbox/`,
            {
              headers: {
                Authorization: "token " + token,
              },
            })
              .then(res => {
                console.log(res.data);
                if (res.data.items){
                  let temp = res.data.items;
                  let data = JSON.parse(temp);
                  console.log(data)
                  for (let oneData of data){
                    if (oneData.type == "post"){
                      oneData.author =  JSON.parse(oneData.author);
                    }
                    // if (oneData.id == "post"){
                    //   oneData.author =  JSON.parse(oneData.author);
                    // }
                    if (oneData.type == "follow"){
                      oneData.actor =  JSON.parse(oneData.actor);
                      oneData.object =  JSON.parse(oneData.object);
                    }
                  }
                  console.log(data)
                  setMessages(data);
                }
                
            })
              .catch(e =>{
                console.log(e)
              })
    }, [])
    

    function deleteInbox(){
      axios.delete(
        `${base_url}/author/${id}/inbox/`,
      {
        headers: {
          Authorization: "token " + token,
        },
      })    
      axios.get(
        `${base_url}/author/${id}/inbox/`,
      {
        headers: {
          Authorization: "token " + token,
        },
      })
      window.location.reload(false);

    }
    function renderMessage(){

              
      return messages.length === 0
      ? (<Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >you do not have any message!</Stack>)
      : (messages.map((message, index) => (
        <Card key = {index}
          sx={{
            align: "center",
            padding: "50px",
            borderRadius: 7,
          }}
        variant="outlined"
        >
          <Box sx={{ width: "90%" }}>
            <InboxList
              item = {message}
            />
          </Box>
        </Card>))
        )

    }

    return (
      <Box
      sx={{
        bgcolor: 'background.paper',
        width: "100%",
        position: 'relative',
        minHeight: 500,
      }}
    >
      <ThemeProvider>

        {renderMessage()}


      </ThemeProvider>
            <Fab size="medium" color="secondary" aria-label="add" style={{width: 60,  
              height: 60,   
              borderRadius: 30,            
              backgroundColor: '#ee6e73',                                    
              position: 'absolute',                                          
              bottom: 10,                                                    
              right: 10,
              alignSelf:'flex-end' }} onClick = {deleteInbox}>
        <RestoreFromTrashIcon/>
      </Fab> </Box>
    );
}