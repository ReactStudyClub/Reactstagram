import styled,{css} from 'styled-components';
import React, { useEffect, useState, useRef, useLayoutEffect } from 'react'
import PageHeader from '../components/PageHeader'
import { NavLink, useLocation } from 'react-router-dom';
import { useTodoState, useUID } from '../ContextApi';
import { firebase_db } from "../firebaseConfig"
import Inner from '../components/Inner';
import InputChat from '../components/InputChat';
import { async } from '@firebase/util';

function ChatRoom() {
   console.log('리랜더링 시작')
   const uid = useUID();
   const userState = useTodoState();
   const { state } = useLocation();
   const { roomId, roomTitle, roomUserlist, roomUserName } = state;
   const [messageList, setMessageList] = useState(null);
   const scrollRef = useRef(null);
   const inputRef = useRef(null);

   //기본설정 변수
   const SPLIT_CHAR = '@spl@';
   const ONE_VS_ONE = 'ONE_VS_ONE';
   const MULTI = 'MULTI';

   useEffect(() => {
      loadMessageList(roomId)
      console.log('첫번째 리랜더링:useEffect 부분')
      console.log(messageList)
   }, [roomId])

   useEffect(() => {
      const inputfocus = async() =>{
      // await inputRef.current.focus();
       await scrollView();
       console.log('inputRef.current.height :>> ', scrollRef.current.clientHeight);
       console.log('inputRef.scroll위치 :>> ', document.clientHeight);
       console.log('inputRef.scroll위치 :>> ', inputRef.current.scrollTop);
       
      
      }
      inputfocus();
      
      console.log('messageList 변경 재랜더링')
     // window.addEventListener("resize",inputfocus)
      
   },[messageList])

   useEffect(() => {
      // const scrollView = () => {
      //    scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
      //  }
      //  window.addEventListener("resize",scrollView)
      // return ()=> window.removeEventListener("resize",scrollView)
    }, []);


    const scrollView = async() => {
      const mainroot =document.getElementById('main-root');
      scrollRef.current.scrollIntoView({ behavior: 'auto', block: 'end', inline: 'nearest' });
      console.log('=======스크롤 다운 ================')

    }


   // scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });


   const loadMessageList = function (roomId) {
      console.log('리랜더링:loadMessageList 메세지 로드 ')
      let userdata = []
      if (roomId) {
         const messageRef = firebase_db.ref('Messages/' + roomId);
         messageRef.limitToLast(20).on('child_added', (data) => {
            let val = data.val();
            userdata = userdata.concat({
               key: data.key
               , profileImg: val.profileImg
               , userName: val.userName
               , time: val.timestamp
               , message: val.message
               , sendUid: val.uid
            })
            setMessageList(userdata);
            console.log('리랜더링:child_added ')
            
           
            
         });
      }
    
   }




   const saveMessages = function (text) {
      
      console.log('리랜더링:saveMessages')

      if (text.length > 0) {
         let multiUpdates = {};
         let messageRefKey = firebase_db.ref().child('Messgaes').push().key; // 메세지 키값 구하기



         if (messageList === null) { //메세지 처음 입력 하는 경우
            let roomUserlistLength = roomUserlist.length;
            for (let i = 0; i < roomUserlistLength; i++) {
               multiUpdates['RoomUsers/' + roomId + '/' + roomUserlist[i]] = true;
            }


         }


         //메세지  저장
         multiUpdates['Messages/' + roomId + '/' + messageRefKey] = {
            uid: uid,
            userName: userState.User[uid].Profile.Username,
            message: text, // 태그 입력 방지
            profileImg: userState.User[uid].Profile.Userphoto,
            timestamp: Date.now() //서버시간 등록하기
         }

         //유저별 룸리스트 저장
         let roomUserListLength = roomUserlist.length;
         if (roomUserlist && roomUserListLength > 0) {
            for (let i = 0; i < roomUserListLength; i++) {
               multiUpdates['UserRooms/' + roomUserlist[i] + '/' + roomId] = {
                  roomId: roomId,
                  roomUserName: roomUserName.join(SPLIT_CHAR),
                  roomUserlist: roomUserlist.join(SPLIT_CHAR),
                  roomType: roomUserListLength > 2 ? MULTI : ONE_VS_ONE,
                  roomOneVSOneTarget: roomUserListLength === 2 && i === 0 ? roomUserlist[1] :  // 1대 1 대화이고 i 값이 0 이면
                     roomUserListLength === 2 && i === 1 ? roomUserlist[0]   // 1대 1 대화 이고 i값이 1이면
                        : '', // 나머지
                  lastMessage: text,
                  profileImg: userState.User[uid].Profile.Userphoto,
                  timestamp: Date.now() //서버시간 등록하기

               };
            }
         }
   
         firebase_db.ref().update(multiUpdates);
      }
      
    
   }






   /**
    * timestamp를 날짜 시간 으로 변환
    */
   const timestampToTime = function (timestamp) {
      let date = new Date(timestamp),
         year = date.getFullYear(),
         month = date.getMonth() + 1,
         day = date.getDate(),
         hour = date.getHours(),
         minute = date.getMinutes(),
         week = new Array('일', '월', '화', '수', '목', '금', '토');

      let convertDate = year + "년 " + month + "월 " + day + "일 (" + week[date.getDay()] + ") ";
      let convertHour = "";
      if (hour < 12) {
         convertHour = "오전 " + pad(hour) + ":" + pad(minute);
      } else if (hour === 12) {
         convertHour = "오후 " + pad(hour) + ":" + pad(minute);
      } else {
         convertHour = "오후 " + pad(hour - 12) + ":" + pad(minute);
      }

      //convertDate
      return convertHour;
   }

   /**
    *  10미만 숫자 앞에 0 붙이기
    */
   const pad = function (n) {
      return n > 9 ? "" + n : "0" + n;
   }

  

   return (
         <ChatRoomListContainer   >
         <div  className='asd' ref={scrollRef}>
         <PageHeader  title={roomTitle} checkstyle={{ display: 'none' }} ></PageHeader>
            <div className='chatRoomListBlock' id='main-root' >
               {messageList &&
                  Object.values(messageList).map((msg) => (
                     msg.sendUid === uid ?
                        <NavLink key={msg.key} to={`/${msg.sendUid}`} style={{ color: '#000' }}>
                           <div className='chatRoom'>
                              <ProflieZone reverse={false}>
                                 <ProflieImg src={msg.profileImg}></ProflieImg>
                                 <div>
                                    <Message>{msg.message}</Message>
                                 </div>
                                 <span>{timestampToTime(msg.time)}</span>
                              </ProflieZone>
                           </div>
                        </NavLink> :
                        <NavLink    key={msg.key} to={`/${uid}`} style={{ color: '#000' }}>
                           <div className='chatRoom'>
                              <ProflieZone reverse={true}>
                                 <ProflieImg src={msg.profileImg}></ProflieImg>
                                 <div>
                                    <ProflieName>{msg.userName}</ProflieName>
                                    <Message>{msg.message}</Message>
                                 </div>
                                <span>{timestampToTime(msg.time)}</span>
                              </ProflieZone>
                           </div>
                        </NavLink> 
                  ))
               }
            </div>
            <InputChat 
            Username={userState.User[uid].Profile.Username}
            scrollView={scrollView}
            saveMessages={saveMessages}
            inputRef={inputRef} >
         </InputChat>
            </div>
         </ChatRoomListContainer>
   )
}



const ChatRoomListContainer = styled.div`
height: 100%;
.asd{
overflow-y: scroll;
}

.chatRoomListBlock{
   margin-bottom: 60px;
}
`
const ProflieZone = styled.div`
display: flex;
padding: 10px 5px 10px 5px;
align-items: center;
position: relative;
flex-direction: ${props => props.reverse ? 'row' : 'row-reverse'};
div{
padding-left: 5px;
padding-right: 5px;
font-weight: 500;
font-size: 14px;
//text-align: ${props => props.reverse ? 'right' : 'none'};
}
span{
   font-size:13px;
   color: #656565;
   }
`;
const ProflieImg = styled.img`
width: 40px;
height: 40px;
border-radius: 50%;

`;
const Message = styled.p`
   background: #eaeaeaf2;
   padding: 8px;
   border-radius: 18px;
`;

const ProflieName = styled.p`
margin:0px;
font-size: 13px;
font-weight: 600;
`;


export default ChatRoom;




