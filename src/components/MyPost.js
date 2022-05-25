import React, { useState, useEffect } from 'react'
import styled, { css } from 'styled-components';
import { firebase_db, imageStorage } from "../firebaseConfig.js"
import { useTodoState, useTodoDispatch, useUID } from '../ContextApi';
import useInputs from './useInputs'
import { MdKeyboardBackspace, MdPhotoCamera, MdCheck } from 'react-icons/md';
import { MdFavoriteBorder} from 'react-icons/md';
import { BiMessageRounded,BiNavigation,BiUserPlus} from 'react-icons/bi';
import { NavLink } from 'react-router-dom';


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



const PostEditBlock = styled.div`
  @media screen and (min-width: 800px) {
   z-index: 5;
   top: 60px;
   }
z-index:5;
display: flex;
position: absolute;
top: 0;
left: 0;
width: 100%;
background: #fff;
flex-direction: column;


.ProfileEditHeader{
   display: flex;
      height: 65px;
      width: 100%;
      border-bottom: 1px #aaa solid;
      align-items: center;
      p{
         margin: 0;
         font-size: 21px;
         font-weight: bold;
         flex:2;
      }
      .MdKeyboardBackspace{
         height: 35px;
         width: 35px;
         margin: 0 10px 0 20px;        
      }
      .MdCheck{
         margin-right: 20px;
         width: 35px;
         height: 35px;
         color: #5a77f3;
         &:hover{
            color: #000;
         }
      }
}

.textdiv{
   border: none;
   height: 300px;
   padding: 15px 30px 15px 30px;
   

}
`


function MyPost({ posts, profile }) {
   const [isPostDelete, setIsPostDelete] = useState(false)
   const [editPostData, setEditPostData] = useState({ postContent: '1' })
   const state = useTodoState();
   const loginUID = useUID();

   const [{ text }, onChange] = useInputs({ text: editPostData.postContent });

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

         var desertRef = imageStorage.refFromURL(posts.postPic)

         // Delete the file
         await desertRef.delete().then(() => {
            // File deleted successfully
            console.log('deleted successfully')
         }).catch((error) => {
            console.log(error)
            // Uh-oh, an error occurred!
         });
      }
      // console.log(posts.postKey)
      // console.log(profile.Uid)
   }

   const postEditOpen = async (posts) => {
      setEditPostData(posts)
      setIsPostDelete(true)
   }

   const postEdit = async (text, posts) => {


      var updates = {};
      updates[`users/${profile.Uid}/UserPost/${posts.postKey}/postContent`] = text;
      updates[`/posts/${posts.postKey}/postContent`] = text;
      await firebase_db.ref().update(updates).then(() => console.log("수정완료")).catch((error) => {
         console.error(error);
         console.log(updates);
      });
      setIsPostDelete(false)

   }


   return (
      <div>
         {posts && (
            Object.values(posts).reverse().map((posts) => (
               <PostBlock key={posts.postKey}>
                  <ProflieZone>
                     <ProflieImg src={profile.Userphoto}></ProflieImg>
                     <ProflieName>{profile.Username}</ProflieName>
                     {loginUID === posts.uid && (
                        <>
                           <ProfileEdit onClick={() => postEditOpen(posts)} >수정</ProfileEdit>
                           <ProfileEdit onClick={() => postDelete(posts)} >삭제</ProfileEdit>
                        </>
                     )}
                     {loginUID === "xjAOeGhwVPMt4tY8zGNUEtjxqLr2" && (
                        <>
                           <ProfileEdit onClick={() => postEditOpen(posts)} >수정</ProfileEdit>
                           <ProfileEdit onClick={() => postDelete(posts)} >삭제</ProfileEdit>
                        </>
                     )}
                  </ProflieZone>
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
               </PostBlock>
               
            ))

         )}
         {isPostDelete && (
            <PostEditBlock>
               <div className='ProfileEditHeader'>
                  <MdKeyboardBackspace className='MdKeyboardBackspace' onClick={() => setIsPostDelete(false)} />
                  <p>게시물 수정</p>
                  <MdCheck type='button' className='MdCheck' onClick={() => postEdit(text, editPostData)} ></MdCheck>
               </div>
               <ProflieZone>
                  <ProflieImg src={editPostData.userPhoto}></ProflieImg>
                  <ProflieName>{editPostData.userName}</ProflieName>
               </ProflieZone>
               <PostImg src={editPostData.postPic} />
               <textarea autoFocus className='textdiv' name="text" onChange={onChange} value={text} autofocus />

            </PostEditBlock>
         )}
      </div>
   );
};



export default React.memo(MyPost);



