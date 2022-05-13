
import React, { useState, useEffect } from 'react';
import { authService, firebaseInstance } from '../firebaseConfig';
import { useSetUID, useTodoDispatch } from '../ContextApi';
import { firebase_db } from "../firebaseConfig";
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import FullLoading from '../components/TimeLoading';

function Login({ setReady, ready }) {
   const navigate = useNavigate();
   const setuid = useSetUID();
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [newAccount, setNewAccount] = useState(true);
   const dispatch = useTodoDispatch();
   const [loading, setLoading] = useState(true);
   const[isReactLoading, setIsReactLoading]= useState(false)

   // 페이지 마운트시 로그인 검사
   // useEffect(() => {
   //    authService.onAuthStateChanged( async(user) => {
   //       if (user) {
   //          await firebase_db.ref(`/users/${user.uid}/`).once('value').then((snapshot) => {
   //             console.log("로그인 검사 로그인회원 파이어베이스 유저데이터 조회 성공")
   //             dispatch({
   //                type: 'LOGIN_USER',
   //                user: snapshot.val(),
   //             })
   //          });
   //          setuid(user.uid);
   //          console.log("user is signed in:" + user.uid)
   //          navigate('/Home');

   //       } else {
   //          navigate('/Login');
   //          console.log("user is signed out")
   //       }
   //    });
   // },[]);



   // 로그인시 이벤트 
   const onChange = (event) => {
      const { target: { name, value } } = event;
      if (name === 'email') { setEmail(value) }
      else if (name === "password") { setPassword(value); }
   }

   const onSubmit = async (event) => {
      event.preventDefault();
      setIsReactLoading(true)
      try {
         let data;
         if (newAccount) {
            /// 새로운 유저 생성 
            await authService.createUserWithEmailAndPassword(email, password).then((load) => {
               data = load;
               console.log('이메일 패스워드 등록')
            }).catch((error) => {
                  var errorMessage = error.message;
                  alert(`회원가입에 문제가 있습니다.\n이메일과 비밀번호를 확인해주세요\n${errorMessage}`)
               });

               console.log(data)
               const uid = data.user._delegate.uid;
               await firebase_db.ref(`/users/${uid}/`).set({
                  Profile: {
                     Uid: `${uid}`,
                     Username: `익명`,
                     Userphoto: 'https://file.namu.moe/file/105db7e730e1402c09dcf2b281232df07cfd8577675ab05e4c269defaefb6f38c54eade7a465fd0b0044aba440e0b6b77c4e742599da767de499eaac22df3317',
                     Introduce: '소개없음',
                     Email:data.user._delegate.email,
                  },
                  UserPost: {
                  },
               });
               alert("회원가입 성공");
               navigate('/Home');
         } else { // 회원가입 한 유저가 로그인시 이벤트
            data = await authService.signInWithEmailAndPassword(email, password);
            console.log(data)
            setuid(data.user._delegate.uid);
            await firebase_db.ref(`/users/${data.user._delegate.uid}/`).once('value').then((snapshot) => {
               console.log("로그인회원 파이어베이스 조회 성공")
               dispatch({
                  type: 'LOGIN_USER',
                  user: snapshot.val(),
               })
            }).catch((error) => {
               var errorMessage = error.message;
               alert(`로그인에 문제가 있습니다.\n${errorMessage}`)
            });
            navigate('/Home');
         }
      } catch (error) {
         console.log(error)
      }
   }


   // const onSubmit = async (event) => {
   //    event.preventDefault();
   //    try {
   //       let data; 
   //       if (newAccount) {
   //          / 새로운 유저 생성 
   //          data = await authService.createUserWithEmailAndPassword(email, password);
   //       } else { // 회원가입 한 유저가 로그인시 이벤트
   //          data = await authService.signInWithEmailAndPassword(email, password);
   //       } console.log(data);
   //    } catch (error) {
   //       console.log(error)
   //    }
   // }

   const toggleAccount = () => setNewAccount((prev) => !prev);

   const onGoggleClick = async (event) => {
      const { target: { name } } = event;
      let provider;
      if (name === 'google') {
         provider = new firebaseInstance.auth.GoogleAuthProvider();
      }
      const data = await authService.signInWithPopup(provider);
      console.log(data);
   }



   return ( 
      <Block>
         <FullLoading isReactLoading={isReactLoading}></FullLoading>
         <HeaderTitle>Reactstagram</HeaderTitle>
         <div className='loginBlock'>
            <form onSubmit={onSubmit}>
               <p>이메일</p>
               <input name="email" type="email" placeholder="Email" required value={email} onChange={onChange} />
               <p>비밀번호</p>
               <input name="password" type="password" placeholder="password" required value={password} onChange={onChange} />
               {/* 로그인 했다 ?? 하면 회원가입 유저와 기존 유저가 로그인할때를 구분해줌 */}
               <input type="submit" value={newAccount ? "회원가입" : "로그인"} />
            </form>
            <div className='toggleAccountZone'>
               <span onClick={toggleAccount}>회 원 가 입</span>
               <span onClick={toggleAccount}>로 그 인</span>
            </div>
         </div>
         {/* <button onClick={onGoggleClick} name='google'>구글로그인</button> */}

      </Block>);


}
export default Login;




const Block = styled.div`
.loginBlock{
   padding: 0px 20px 20px 20px;
}
form{
   display: flex;
   flex-direction: column;
}
form input{    
   align-items: center;
   border: 1px solid rgba(0, 0, 0, 0.1);
   background: #FFFFFF;
   box-sizing: border-box;
   border-radius: 10px;
   padding: 13px 15px;
   margin-bottom: 20px;
}
form input:last-child{
   
   background-color: #61dafb;
   color: #FFFFFF;
   font-size: 18px;
   font-weight: bold;
   &:hover{
      background-color: #39c7ee;
   }
}

form p{
   font-size: 14px;
   font-weight: bold;
   line-height: 21px;
   letter-spacing: -0.5px;
   color: #222222;
   margin-bottom: 5px;
   margin-left: 10px;
}
.toggleAccountZone{
   display: flex;
   flex-direction: row;
   justify-content: space-around;
   align-items: center;
}

.toggleAccountZone span{
   font-size: 13px;
   color: #7e7e7e;
}
`;

const HeaderTitle = styled.div`
cursor: pointer;
   font-size: 35px;
   font-weight: bold;
   font-family: auto;
   height: 140px;
   display: flex;
   color: #61dafb;
   flex-direction: row;
   align-items: center;
   justify-content: center;
`;

