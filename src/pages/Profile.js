import React, { useEffect, useState } from 'react';
import { useParams,useNavigate } from "react-router-dom";
import { firebase_db } from "../firebaseConfig.js";
import BottomTeb from '../components/BottomTeb'
import styled from 'styled-components';
import MyPost from '../components/MyPost';
import Header from '../components/Header';

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
margin: 5px;
background-color: #fff;
border: #aaa 1px solid;
`

const Profile = () => {

  // 파라미터를 받아올 땐 match 안에 들어있는 params 값을 참조합니다.
  const { uid } = useParams();
  console.log(uid);
  const [user, setUser] = useState()

  useEffect(() => {
    const userCheck = async () => {
      await firebase_db.ref(`/users/${uid}/`).on('value', (snapshot) => {
        console.log("로그인 검사 로그인회원 파이어베이스 유저데이터 조회 성공")
        setUser(snapshot.val())
      });
    }

    userCheck()

  }, [])


  return (user &&
  <>
  <Header></Header>
    <ProfileZone>
      <UserImg src={user.Profile.Userphoto} />
      <UserDataSec>
        <UserDataBlock>게시물 0</UserDataBlock>
        <UserDataBlock>팔로워 0</UserDataBlock>
        <UserDataBlock>팔로잉 0</UserDataBlock>
      </UserDataSec>
    </ProfileZone>
    <UserZoen>
      <strong>{user.Profile.Username}</strong>
      <div style={{whiteSpace:'pre'}}>{user.Profile.Introduce}</div>

    </UserZoen>
    <MyPost posts={user.UserPost} profile={user.Profile}></MyPost>
    <BottomTeb></BottomTeb>
  </>
  //  <button onClick={() => navigate('/')}>홈으로</button>
);
};


export default Profile;