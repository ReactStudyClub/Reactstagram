
import React, { useEffect } from 'react';
import { authService} from '../firebaseConfig.js';
import { useSetUID, useTodoDispatch } from '../ContextApi';
import { firebase_db } from "../firebaseConfig.js";
import { useNavigate } from 'react-router-dom';
import FullLoading from '../components/TimeLoading';


function Loading() {
   const setuid = useSetUID();
   const dispatch = useTodoDispatch();
   const navigate = useNavigate();

   console.log('로딩');
      // 페이지 마운트시 로그인 검사
      useEffect(() => {
         authService.onAuthStateChanged( async(user) => {
            if (user) {
               // await firebase_db.ref(`/users/${user.uid}/`).once('value').then((snapshot) => {
               //    console.log("로그인 검사 로그인회원 파이어베이스 유저데이터 조회 성공")
               //    dispatch({
               //       type: 'LOGIN_USER',
               //       user: snapshot.val(),
               //    })
               // });
               await firebase_db.ref(`/users/${user.uid}/`).on('value',(snapshot) => {
                  console.log("로그인 검사 로그인회원 파이어베이스 유저데이터 조회 성공")
                  dispatch({
                     type: 'LOGIN_USER',
                     user: snapshot.val(),
                  })
               });
               //유저 데이터 변경시 감지하여 자동 트리거

               setuid(user.uid);
               console.log("접속유저 :" + user.uid)
               navigate('/Home');
            
            } else {
               navigate('/Login');
               console.log("로그아웃 유저")
            }
         });
      },[]);
   






   return (
  <FullLoading isReactLoading={true}/>
   )
}

export default Loading