import { async } from '@firebase/util';
import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import { firebase_db, authService } from "../firebaseConfig"
import { useNavigate, NavLink } from 'react-router-dom';
import { useTodoState, useTodoDispatch, useUID } from '../ContextApi';

function UserLIst() {
   const [userList, setUserList] = useState([]);
   const navigate = useNavigate();
   const [isReactLoading, setIsReactLoading] = useState(false)
   const dispatch = useTodoDispatch();
   const state = useTodoState();
   const uid = useUID();
   

   useEffect(() => {
      const getUserList = async () => {
         let userdata = []
         const userRef = firebase_db.ref('users')
         userRef.on('child_added', (data) => {
            userdata = userdata.concat(data.val().Profile)
            setUserList(userdata)
            
         })
      }
      getUserList()
   }, []);
   console.log(userList)

      const auth = authService;
      const liGoogleBtn = document.getElementById('liGoogleBtn');
      const liFacebookBtn = document.getElementById('liFacebookBtn');
      const liEmailJoin = document.getElementById('liEmailJoin');
      const dvLogin = document.getElementById('dvLogin');
      const dvJoin = document.getElementById('dvJoin');
      const liEmailJoinSubmit = document.getElementById('liEmailJoinSubmit');
      const liEmailBtn = document.getElementById('liEmailBtn');
      const dvAuth = document.getElementById('dvAuth');
      const liLogOut = document.getElementById('liLogOut');
      const INDEXDB_DB_NAME = "USER";
      const INDEXDB_VERSION = 1;
      const INDEXDB_STORE = "Users";
      const ulUserList = document.getElementById('ulUserList');
      const tabMessageList = document.getElementById('tabMessageList');
      const aBackBtn = document.getElementById('aBackBtn');
      const aInvite = document.getElementById('aInvite');
      const MAKEID_CHAR = '@make@';
      const DATETIME_CHAR = '@time@';
      const spTitle = document.getElementById('spTitle');
      const ulMessageList = document.getElementById('ulMessageList');
      const SPLIT_CHAR = '@spl@';

   const onUserListClick = async(user) => {
      
      let targetUserUid = user.Uid;
      let targetUserName = user.Username
      const roomTitle = targetUserName + '님';
      const roomUserlist = [targetUserUid, uid]; // 챗방 유저리스트
      const roomUserName = [targetUserName, state.User[uid].Profile.Username] // 챗방 유저 이름
      

    
      const UserRoomsRef = firebase_db.ref('UserRooms/'+ uid).orderByChild('roomOneVSOneTarget').equalTo(targetUserUid)
      await UserRoomsRef.once('value').then((snapshot)=>{
         const val = snapshot.val();
         //console.log(snapshot.val().roomId)
         console.log(val)
         if(val ===null){
            const roomId =  MAKEID_CHAR + uid + DATETIME_CHAR + yyyyMMddHHmmsss();
          navigate('/ChatRoom',{ state: {roomId,roomTitle,roomUserlist,roomUserName}})
           console.log('신규방'+roomId)
         }else{
            const roomId =  Object.values(val)[0].roomId;
           navigate('/ChatRoom',{ state: {roomId,roomTitle,roomUserlist,roomUserName}})
           console.log('기존방'+roomId)
         }

      })
   }



   /**
    * 현재날짜 yyyyMMddHHmmsss형태로 반환
    */
   const yyyyMMddHHmmsss = function () {
      let vDate = new Date();
      let yyyy = vDate.getFullYear().toString();
      let MM = (vDate.getMonth() + 1).toString();
      let dd = vDate.getDate().toString();
      let HH = vDate.getHours().toString();
      let mm = vDate.getMinutes().toString();

      let ss = vDate.getSeconds().toString();
      let sss = vDate.getMilliseconds().toString();
      return yyyy + (MM[1] ? MM : '0' + MM[0]) + (dd[1] ? dd : '0' + dd[0]) + (HH[1] ? HH : '0' + HH[0])
         + (mm[1] ? mm : '0' + mm[0]) + (ss[1] ? ss : '0' + ss[0]) + sss;
   };







   return (
<>{
      userList && <UserLIstContainer >
         {userList.map((user) => (
               <ProflieZone key={user.Uid} onClick={()=> onUserListClick(user)}>
                  <ProflieImg src={user.Userphoto}></ProflieImg>
                  <ProflieName>{user.Username}</ProflieName>
               </ProflieZone>
         ))}


      </UserLIstContainer>
}</>
   )
}

const UserLIstContainer = styled.div`

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





export default UserLIst