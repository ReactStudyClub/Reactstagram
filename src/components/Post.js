import React, { useState, useEffect } from 'react'
import styled from 'styled-components';
import { firebase_db } from "../firebaseConfig"
import { NavLink } from 'react-router-dom';
import useInputs from './useInputs'
import { useTodoState,  useUID } from '../ContextApi';
import { MdFavoriteBorder} from 'react-icons/md';
import { BiMessageRounded,BiNavigation,BiUserPlus} from 'react-icons/bi';

function Post() {
   const [posts, setPosts] = useState();
   const uid = useUID();
   const state = useTodoState();
   const [{ comment }, onChange] = useInputs({})

   useEffect(() => {
      firebase_db.ref('posts').orderByChild('date').startAfter(1).once('value').then((snapshot) => {
         setPosts(snapshot.val());
         console.log(posts)
      });
   }, []);

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
      } catch (error) {
         console.log(error)
         console.log(comment)
      }
   }

   return (
      <div>
         {posts && (
            Object.values(posts).reverse().map((posts) => (
               <PostBlock key={posts.postKey}>
                  <NavLink to={`/${posts.uid}`} style={({ isActive }) => ({ color: isActive ? 'blue' : 'black' })}>
                     <ProflieZone>
                        <ProflieImg src={posts.userPhoto}></ProflieImg>
                        <ProflieName>{posts.userName}</ProflieName>
                        <BiUserPlus></BiUserPlus>
                     </ProflieZone>
                  </NavLink>
                  <PostImg src={posts.postPic} />
                  <div className='iconblock'>
                     <MdFavoriteBorder />
                     <NavLink to={`/Comments/${posts.postKey}`}><BiMessageRounded/></NavLink>
                     <BiNavigation/>
                  </div>
                  <PostText><strong>{posts.userName}</strong>{" "}{posts.postContent}</PostText>
                  {(()=>{  let comLength = posts.comment;
                           if(comLength){
                           let commentLength = Object.values(comLength).length;
                           return <NavLink to={`/Comments/${posts.postKey}`}><Postdate >{`댓글 ${commentLength}개 모두보기`}</Postdate></NavLink>}})()
                  }
                  {(()=>{
                           let time = posts.newDate
                           let realtime = time.substr(0, 10);
                           return<Postdate >{realtime}</Postdate>
                  })()
                  }

                  {/* {posts.comment && Object.values(posts.comment).map((comment) => (
                     <ProflieZone key={comment.key}>
                        <ProflieImg src={comment.userPhoto}></ProflieImg>
                        <ProflieName>{comment.userName}</ProflieName>
                        <p>{comment.text}</p>
                     </ProflieZone>
                  ))}
                  <input name='comment' onChange={onChange} value={comment}></input>
                  <button onClick={() => writeNewComment(posts.postKey, posts.uid)}>댓글 등록</button> */}

               </PostBlock>
            ))
         )}
      </div>

   );
};

const PostBlock = styled.div`
   width: 100%;

   position: relative; /* 추후 박스 하단에 추가 버튼을 위치시키기 위한 설정 */
   background: white;
   box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.04);

   margin: 0 auto; /* 페이지 중앙에 나타나도록 설정 */
   display: flex;
   flex-direction: column;
   font-size: 20px;
   .iconblock{
      flex-direction: row;
      padding: 5px 10px;
      svg{
      height: 22px;
      width: 22px;
      margin-right: 15px;
   }
   }
`;
const ProflieZone = styled.div`
display: flex;
padding: 10px 5px 10px 5px;
align-items: center;
position: relative;
`;
const ProflieImg = styled.img`
width: 35px;
height: 35px;
border-radius: 50%;
`;
const ProflieName = styled.p`
margin:0px;
font-weight: bold;
padding-left: 10px;
font-size: 16px;
flex: 1;
`;
const PostImg = styled.img`
width: 100%;
`;
const PostText = styled.p`
   margin: 0px;
   padding: 10px 15px;
   font-size: 15px;
   font-weight: 500;
`;
const Postdate = styled.div`
font-size: 13px;
padding: 0px 15px;
color: #626161;;
`

export default React.memo(Post);

