import React, { useState, useEffect } from 'react'
import styled from 'styled-components';
import { firebase_db } from "../firebaseConfig.js"
import { useTodoState, useTodoDispatch, useUID } from '../ContextApi';


const PostBlock = styled.div`
   width: 100%;
   height: 100%;

   position: relative; /* 추후 박스 하단에 추가 버튼을 위치시키기 위한 설정 */
   background: white;
   box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.04);

   margin: 0 auto; /* 페이지 중앙에 나타나도록 설정 */
   display: flex;
   flex-direction: column;
`;


const ProflieZone = styled.div`
display: flex;
padding: 5px;
align-items: center;
position: relative;

`;
const ProflieImg = styled.img`
width: 35px;
height: 35px;
border-radius: 50%;
border: 2px #64bfed  solid;

`;
const ProflieName = styled.p`
margin:0px;
font-weight: bold;
padding-left: 10px;
font-size: 16px;
flex: 1;
`;

const ProfileEdit = styled.p`
margin: 0;
font-size: 16px;
padding-right: 10px;
font-weight:600;
&:hover {
   color: #339af0;
}

`;

const PostImg = styled.img`
width: 100%;
height: 300px;
padding: 5px;
`;

const PostText = styled.p`
   margin: 0px;
   padding: 20px;
   border-bottom: 1px #e0e0e0 solid;
   font-size: 15px;
`;


function MyPost({ posts, profile }) {
   const dispatch = useTodoDispatch();

   const postDelete = async (posts) => {

      const confirm = window.confirm('포스트를 삭제하시겠습니까?')
      if (confirm) {
         // const updates = {
         //    ['/posts/' + postKey]:null,
         //    ['/users/' + profile.Uid + '/UserPost/' + postKey]:null
         //    };
            await firebase_db.ref(`users/${profile.Uid}/UserPost/${posts.postKey}`).remove();
            await firebase_db.ref('/posts/' + posts.postKey).remove();
            
            alert("포스트 삭제완료");
      }
      // console.log(posts.postKey)
      // console.log(profile.Uid)
   }


   return (
      <div>
         {posts && (
            Object.values(posts).reverse().map((posts) => (
               <PostBlock key={posts.postKey}>
                  <ProflieZone>
                     <ProflieImg src={posts.userPhoto}></ProflieImg>
                     <ProflieName>{profile.Username}</ProflieName>
                     <ProfileEdit onClick={() => postDelete(posts)} >삭제</ProfileEdit>
                  </ProflieZone>

                  <PostImg src={posts.postPic} />
                  <PostText>{posts.postContent}</PostText>
               </PostBlock>
            ))
         )}
      </div>
   );
};

export default React.memo(MyPost);

