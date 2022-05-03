
//버전 v6 
//withRouter, useRouteMatch, match, 사라짐
//기존 history의 모든 기능은 useNavigate로 통합되었다
// match 는 useParams 로 변경
import BottomTeb from '../components/BottomTeb'
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import userimg from '../imgs/kawai.jpg';
import { useTodoState, useTodoDispatch, useUID } from '../ContextApi';
import MyPost from '../components/MyPost'
import {authService} from "../firebaseConfig"
import Login from '../pages/Login';

const ProfileZone = styled.div`
width: 100%;
height: 100px;
display: flex;
align-items: center;
`;
const UserImg = styled.img`
width: 100px;
height: 100px;
border-radius: 50%;
padding: 10px;

`;
const UserZoen = styled.div`
padding: 10px;
strong{font-size:20px;}
div{
  color: #000;
}
.asd{color:#000;}
`;


const UserDataSec = styled.div`
display: flex;
`
const UserDataBlock = styled.p`
margin: 10px;
font-weight: bold;

`;
const ProfileBtn = styled.button`
width: 100%;
background-color: #fff;
`

const MyPage = () => {

  const [login, setLogin] =useState(false);
  const navigate = useNavigate();
  const state = useTodoState();
  const uid = useUID();

  const goProfileEdit = () => {
    navigate('/ProfileEdit');
  }

  const signOut = () =>{ 
    authService.signOut().then(() => {
    console.log('Sign-out successful');
    navigate('/');
  }).catch((error) => {
    console.log(error.message );
  });
  }


  return ( 
    <>
      <ProfileZone>
        <UserImg src={state.User[uid].Profile.Userphoto} />
        <UserDataSec>
          <UserDataBlock>게시물 0</UserDataBlock>
          <UserDataBlock>팔로워 0</UserDataBlock>
          <UserDataBlock>팔로잉 0</UserDataBlock>
        </UserDataSec>
      </ProfileZone>
      <UserZoen>
        <strong>{state.User[uid].Profile.Username}</strong>
        <div>{state.User[uid].Profile.Introduce}</div>

      </UserZoen>
      <ProfileBtn onClick={goProfileEdit}>프로필 편집</ProfileBtn>
      <ProfileBtn onClick={signOut}>로그아웃</ProfileBtn>
      <MyPost posts={state.User[uid].UserPost} profile={state.User[uid].Profile}></MyPost>
      <BottomTeb></BottomTeb>
    </>
    //  <button onClick={() => navigate('/')}>홈으로</button>
  );
};

export default MyPage;