import * as React from 'react';
import Grid from "@mui/material/Grid";
import Like from "./postActionComponents/Like";
import Share from "./postActionComponents/Share";
import Comment from "./postActionComponents/CommentButton";
import CommentList from "./postActionComponents/Comment";
import LikeList from "./postActionComponents/LikeList";
import AddComment from "./postActionComponents/AddComment";

import FavoriteIcon from '@mui/icons-material/Favorite';
import axios from "axios";
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import ForumIcon from '@mui/icons-material/Forum';
import { getUserInfo } from "./baseElement/toolFuntions";
import DialogFriendlist from "./Friend/index";

const base_url = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const token = localStorage.getItem('jwtToken');
const URL = window.location.href;
const userID = localStorage.getItem('userID');

export default class PostAction extends React.Component{
    constructor(props){
        super(props);
        console.log(props);

        this.state = {
            // commentClicked: false,
            alreadyLiked: false,
            likes: [],
            comments: [],
            showAddComment: false,
            friendListOpen: false
        }
    }

    componentDidMount() {
        const authorId = this.props.post.author.author_id;
        const postId = this.props.post.post_id;
        console.log(authorId)
        console.log(postId)
        axios.get(`${base_url}/author/${authorId}/posts/${postId}/likes/`,
        {
          headers: {
            Authorization: "Token " + token,
          },
        })
          .then(res => {
            const temp = res.data;
            console.log(temp);

            this.setState((prevState, props) => {
              prevState.likes = temp
              return prevState;
           });
            for(let item of temp){

                console.log(userID);
                console.log(item.author.author_id);

                if (item.author.author_id === userID){
 
                    this.setState((prevState, props) => {
                      prevState.alreadyLiked = true;
                      return prevState;
                   });
                    break;
                }
            }
        })

        axios.get(`${base_url}/author/${authorId}/posts/${postId}/comments/`,
        {
          headers: {
            Authorization: "Token " + token,
          },
        })
          .then(res => {
            const temp2 = res.data.comments;
            console.log(temp2);

            this.setState((prevState, props) => {
              prevState.comments = temp2
              return prevState;
           });
            
        })
      }

    onClickLike = async () => {
        console.log("like clicked")
        const authorId = this.props.post.author.author_id;
        var temp = await getUserInfo().catch(err=>{
          console.log("bugbugbug")
        });
        var user = temp.data;

        console.log(user);
        const summaryTxt = user.displayName + " Likes your post";
        const postData = {
            type: "like",
            summary: summaryTxt,
            context: "http://127.0.0.1:8000/",
            author: user,
            object: this.props.post.source,
        }
        axios.post(`${base_url}/author/${authorId}/inbox`, postData,
        {
          headers: {
            Authorization: "Token " + token,
            "X-CSRFToken":  token,

          },
        })
          .then(res => {
            const like = res.data;
            console.log(like);

          this.setState((prevState, props) => {
            prevState.alreadyLiked = true
            return prevState;
         });
        })
      
    }

    onClickComment = () => {

        if (this.state.showAddComment){
          this.setState((prevState, props) => {  
            prevState.showAddComment = false;

            return prevState;
         });  
        

        }
        else{
          this.setState((prevState, props) => {  
            prevState.showAddComment = true;
  
            return prevState;
         });  
        }


    }

    handleShare = (friend) =>{
      let postData =this.props.post
      postData.author = JSON.stringify(postData.author);
      

      console.log(friend);
      axios.post(`${base_url}/author/${friend.author.author_id}/inbox`, postData,
      {
        headers: {
          Authorization: "Token " + token,
          "X-CSRFToken":  token,

        },
      })
        .then(res => {
          const like = res.data;
          console.log(like);

        this.setState((prevState, props) => {
          prevState.alreadyLiked = !prevState.alreadyLiked
          return prevState;
       });
      })
    }

    onClickShare = () => {
        console.log("share clicked")
        this.setState((prevState, props) => {
          prevState.friendListOpen = true
          return prevState;
       });  

    }
  
    cancelFriendList = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }

      this.setState((prevState, props) => {
        prevState.friendListOpen = false
        return prevState;
     }); 
  };

    onClickClose = () =>{

      this.setState((prevState, props) => {
        prevState.showAddComment = false
        // prevState.commentClicked = !prevState.commentClicked
        
        return prevState;
     }); 
    }
    renderAddComment = () =>{
      const postId = this.props.post.post_id;
      const authorId = this.props.post.author.author_id;

      if (this.state.showAddComment){

        return (
        <AddComment onClickClose = {this.onClickClose}  postId = {postId} authorId = {authorId}/>
        )
      }
      return null;

    }

    render(){
        console.log(this.state);
        return (
              <Stack
              direction="column"
              divider={<Divider orientation="horizontal"/>}
              spacing={2}
              className='actions'
              >
            <DialogFriendlist open = {this.state.friendListOpen}  onClickEnd = {this.cancelFriendList} handleShare = {this.handleShare}/>

            <Grid
            container
            direction="row"
            justifyContent="start"
            alignItems="start"
            >
            <Like onClickLike = {this.onClickLike} alreadyLiked = {this.state.alreadyLiked} />
            <Comment onClickComment = {this.onClickComment} />
            <Share onClickShare = {this.onClickShare} />
            </Grid>
            {this.renderAddComment()}


            <Stack
                direction="row"
                divider={<Divider orientation="vertical" flexItem />}
                spacing={1}
                >
            
            <FavoriteIcon size = "large" />
            <LikeList likes = {this.state.likes}/>

            </Stack>


            <Stack
                direction="row"
                divider={<Divider orientation="vertical" flexItem />}
                spacing={1}
                >
            
            <ForumIcon size = "large" />
            <CommentList comments = {this.state.comments}/>
            </Stack>
                </Stack>




        )
    }

}