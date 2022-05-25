
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
               console.log(user)
               
               await firebase_db.ref(`/users/${user.uid}/`).once('value').then(async(snapshot) => {
                  console.log("로딩페이지 : 로그인 검사  유저데이터 조회")
                  if(snapshot.val()){
                     dispatch({
                        type: 'LOGIN_USER',
                        user: snapshot.val(),
                     })
                  }else{
                     await firebase_db.ref(`/users/${user.uid}/`).set({
                        Profile: {
                           Uid: `${user.uid}`,
                           Username: `익명`,
                           Userphoto: 'https://file.namu.moe/file/105db7e730e1402c09dcf2b281232df07cfd8577675ab05e4c269defaefb6f38c54eade7a465fd0b0044aba440e0b6b77c4e742599da767de499eaac22df3317',
                           Introduce: '구글로그인유저',
                           Email: `${user.email}`,
                        },
                        UserPost: {
                        },
                     });
                  
                     await firebase_db.ref(`/users/${user.uid}/`).once('value').then((snapshot) => {
                        console.log("로딩페이지 : 구글로그인 검사  유저데이터 조회")
                        if(snapshot.val()){
                           dispatch({
                              type: 'LOGIN_USER',
                              user: snapshot.val(),
                           })
                        }
                     });
                  }
            

               setuid(user.uid);
               console.log("접속유저 :" + user.uid)
               navigate('/Home',{ state: user.uid});
               });
            
            } else {
               navigate('/Login');
               console.log("로그아웃 유저")
            }
            
         });


      },[]);
   






   return (
  <FullLoading isReactLoading={true}/>
   )
};

export default Loading