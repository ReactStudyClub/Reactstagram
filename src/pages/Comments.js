import React, { useState, useEffect } from 'react'
import styled from 'styled-components';
import { firebase_db } from "../firebaseConfig"
import { useTodoState, useUID } from '../ContextApi';
import { useParams } from "react-router-dom";
import useInputs from '../components/useInputs'
import PageHeader from '../components/PageHeader';

function Comments() {
   const { postKey } = useParams();
   const [posts, setPosts] = useState();
   const [comments, setComment] = useState();
   const uid = useUID();
   const state = useTodoState();
   const [{ comment }, onChange, reset,setForm] = useInputs({})
   console.log(postKey)

   useEffect(() => {
      firebase_db.ref('/posts/' + postKey).on('value', (snapshot) => {
         setPosts(snapshot.val());
         setComment(snapshot.val().comment);
      });
   }, []);

   console.log(posts)


   const writeNewComment = async (postKey, postuid) => {
      try {
         let newCommentKey = firebase_db.ref().child('posts').push().key;
         let newComment =
         {
            userName: state.User[uid].Profile.Username,
            key: newCommentKey,
            uid: uid,
            date: Date.now(),
            newDate: new Date(),
            userPhoto: state.User[uid].Profile.Userphoto,
            text: comment
         };
         // Write the new post's data simultaneously in the posts list and the user's post list.
         let updates = {};
         updates['/posts/' + postKey + '/comment/' + newCommentKey] = newComment;
         updates['/users/' + postuid + '/UserPost/' + postKey + '/comment/' + newCommentKey] = newComment;

         await firebase_db.ref().update(updates).then(() => console.log("댓글 작성완료")).catch((error) => {
            console.log(error);
            console.log(updates);
         });
         setForm({comment:''})
      } catch (error) {
         console.log(error)
         console.log(comment)
      }
      return 
   }


   return (
      <>
      <PageHeader title={'안녕'} check={null}></PageHeader>
         {posts && (
            <ProflieZone>
               <ProflieImg src={posts.userPhoto}></ProflieImg>
               <ProflieName><strong>{posts.userName}</strong>{" "}{posts.postContent}</ProflieName>
            </ProflieZone>
         )}

         {comments && Object.values(posts.comment).map((comment) => (
            <ProflieZone key={comment.key}>
               <ProflieImg src={comment.userPhoto}></ProflieImg>
               <ProflieName><strong>{comment.userName}</strong>{" "}{comment.text}</ProflieName>
            </ProflieZone>
         ))}
            <InputComment>
               <ProflieImg src={state.User[uid].Profile.Userphoto}></ProflieImg>
               <input autoFocus placeholder={` ${state.User[uid].Profile.Username} (으)로 댓글 달기...`} name='comment' value={comment} onChange={onChange}></input>
               <button onClick={() => writeNewComment(posts.postKey, posts.uid)}>게시</button>
            </InputComment>
                  
      </>
   )
}

export default Comments

const ProflieZone = styled.div`
display: flex;
padding: 10px 5px 10px 5px;
align-items: flex-start;
position: relative;

`;
const ProflieImg = styled.img`
width: 35px;
height: 35px;
border-radius: 50%;


`;
const ProflieName = styled.p`
margin:0px;
font-weight: 500;
padding-left: 10px;
font-size: 15px;

`;

const InputComment = styled.div`
   margin: 0px;
   padding: 8px 8px;
   font-size: 15px;
   font-weight: 500;
   border-top: 0.5px #acacac solid;
   display: flex;
   input{
      border:none;
      flex: 1;
   }
   button{
   background: #fff;
   border: none;
   color: #6683fe;
   font-weight: bold;
   font-size: 15px;
   }
`;
