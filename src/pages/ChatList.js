import styled, { css } from 'styled-components';
import React, { useState, useEffect } from 'react'
import PageHeader from '../components/PageHeader'
import { useNavigate, NavLink } from 'react-router-dom';
import { firebase_db, authService } from "../firebaseConfig"
import { useTodoState, useTodoDispatch, useUID } from '../ContextApi';
import BottomTeb from '../components/BottomTeb';
import Inner from '../components/Inner';


function ChatList() {
   const navigate = useNavigate();

   const state = useTodoState();
   const uid = useUID();
   const [roomList, setRoomList] = useState()
   const SPLIT_CHAR = '@spl@';


   useEffect(() => {

      loadRoomList()
      console.log('roomList :>> ', roomList);

   }, []);


   const loadRoomList = function () {

      const roomRef = firebase_db.ref('UserRooms/' + uid);
      roomRef.orderByChild('timestamp').on('value', (snapshot) => {
         const val = snapshot.val()
         console.log('val :>> ', val);
         console.log('val.key :>> ', snapshot.key);
         console.log('val.data :>> ', val.data);


         const cbDisplayRoomList = function (data) {
            let val = data[1]
            let arrRoomUserName = val.roomUserName.split(SPLIT_CHAR);
            arrRoomUserName.splice(arrRoomUserName.indexOf(state.User[uid].Profile.Username), 1); // 방 제목 타이틀에서는 자신의 이름을 제외합니다.
            const eachRoomTitle = arrRoomUserName.length > 1 ?
               arrRoomUserName[0] + " 외 " + (arrRoomUserName.length - 1) + "명" : arrRoomUserName[0];

            let arr = {
               roomId: data[0],
               lastMessage: val.lastMessage,
               profileImg: val.profileImg, 
               roomTitle: eachRoomTitle,
               roomUserName: val.roomUserName,
               roomUserlist: val.roomUserlist,
               roomType: val.roomType, 
               roomOneVSOneTarget: val.roomOneVSOneTarget,
               datetime: timestampToTimeForRoomList(val.timestamp)
            }

            return arr;
         }
         let newList = [];
         Object.entries(val).forEach((data) => newList.push(cbDisplayRoomList(data)))
         console.log('newList :>> ', newList);
         setRoomList(newList)

      })
   }

   const timestampToTimeForRoomList = function (timestamp) {
      var date = new Date(timestamp),
         year = date.getFullYear(),
         month = date.getMonth() + 1,
         day = date.getDate(),
         hour = date.getHours(),
         minute = date.getMinutes();
      var nowDate = new Date(),
         nowYear = nowDate.getFullYear(),
         nowMonth = nowDate.getMonth() + 1,
         nowDay = nowDate.getDate(),
         nowHour = nowDate.getHours(),
         nowMinute = nowDate.getMinutes();
      var result;
      if (year === nowYear && month === nowMonth && day === nowDay) {
         result = pad(hour) + ":" + pad(minute);
      } else {
         result = pad(year) + "-" + pad(month) + "-" + pad(day);
      }

      return result;
   }

   /**
    *  10미만 숫자 앞에 0 붙이기
    */
   const pad = function (n) {
      return n > 9 ? "" + n : "0" + n;
   }

   const onUserRoomsClick = (room) => {
      const roomUserlist = room.roomUserlist.split(SPLIT_CHAR)// 챗방 유저리스트
      const roomId = room.roomId;
      const roomTitle = room.roomTitle;
      const roomUserName = room.roomUserName.split(SPLIT_CHAR) // 챗방 유저 이름

      console.log('roomUserlist :>> ', roomUserlist);
      console.log('roomUserName :>> ', roomUserName);

     navigate('/ChatRoom',{ state: {roomId,roomTitle,roomUserlist,roomUserName}})
   }

   return (
      <>
         <PageHeader title={'채팅방 리스트'} ></PageHeader>
         <ChatRoomListContainer>
            <div className='chatRoomListBlock'>
               {roomList && roomList.map((room) => (
                  <div className='chatRoom' key={room.roomId} onClick={ ()=> onUserRoomsClick(room)}>
                  <ProflieZone>
                     <ProflieImg src={room.profileImg}></ProflieImg>
                     <div>
                        <ProflieName>{room.roomTitle}</ProflieName>
                        <p>{room.lastMessage}</p>
                     </div>
                     <span>{room.datetime}</span>
                  </ProflieZone>
               </div>
               ))}
            </div>
         </ChatRoomListContainer>
         <BottomTeb></BottomTeb>
      </>
   )
}


const ChatRoomListContainer = styled.div`

`
const ProflieZone = styled.div`
display: flex;
padding: 10px 5px 10px 5px;
align-items: center;
position: relative;
div{
padding-left: 15px;
font-weight: bold;
font-size: 14px;
flex: 1;
}
span{
   font-size:13px;
   color: #656565;
   }
`;
const ProflieImg = styled.img`
width: 55px;
height: 55px;
border-radius: 50%;

`;
const ProflieName = styled.p`
margin:0px;
flex: 1;
font-size: 16px;
`;

export default ChatList