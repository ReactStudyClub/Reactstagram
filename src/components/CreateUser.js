import React, { useRef, useCallback, useState, } from 'react';
import { useTodoState, useTodoDispatch, useUID } from '../ContextApi';
import useInputs from './useInputs';
import { firebase_db, imageStorage } from "../firebaseConfig"
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { MdKeyboardBackspace, MdPhotoCamera, MdCheck } from 'react-icons/md';





const CreateUser = () => {

  const [url, setUrl] = useState();
  const dispatch = useTodoDispatch();
  const state = useTodoState();
  const uid = useUID();
  const navigate = useNavigate();
  const [attachment, setAttachment] = useState(state.User[uid].Profile.Userphoto);


  const goBack = () => {
    const confirm = window.confirm('프로필편집을 취소하시겠습니까??')
    if (confirm) {
      navigate(-1);
    }
  };

  const [{ username, text }, onChange,] = useInputs({
    username: `${state.User[uid].Profile.Username}`,
    text: `${state.User[uid].Profile.Introduce}`
  });
  const onSubmit = async () => {

    let attachmentUrl = ""
    if (attachment !== "") {
      const attachmentRef = imageStorage.ref().child(`${uid}/profile/photo`)
      const response = await attachmentRef.putString(attachment, 'data_url')
      attachmentUrl = await response.ref.getDownloadURL()
    }
    setUrl(attachmentUrl)


  }

  const onFileChange = async (event) => {
    const { target: { files } } = event;
    const theFile = files[0];
    const reader = new FileReader();

    reader.onloadend = (finishedEvent) => {
      const { currentTarget: { result } } = finishedEvent
      setAttachment(result)
    }
    reader.readAsDataURL(theFile)



  }



  const onClearAttachment = () => {
    setAttachment(null);
  };


  const profileEditBtn = () => {
    firebase_db.ref(`/users/${uid}/Profile/`).set({
      Uid: `${uid}`,
      Username: `${username}`,
      Userphoto: `${url}`,
      Introduce: `${text}`,
    });

    firebase_db.ref(`/users/${uid}/`).once('value').then((snapshot) => {
      console.log("로그인회원 파이어베이스 조회 성공")
      dispatch({
        type: 'CREATE_USER',
        user: snapshot.val(),
      })
    });
    alert("프로필편집 완료");
  }





  return (
    <ProfileEditBlock>
      <div className='ProfileEditHeader'>
        <MdKeyboardBackspace className='MdKeyboardBackspace' onClick={goBack} />
        <p>프로필 편집</p>
        <MdCheck className='MdCheck' onClick={profileEditBtn}></MdCheck>
      </div>

      <div className='imgBlock'>
        <img src={attachment} alt=""></img>
        <label htmlFor="imageLoader" className="button">프로필 사진 변경</label>
        <input id='imageLoader' type='file' accept='image/*' onChange={onFileChange} />
      </div>
      <p>사용자 이름</p>
      <input className='username' name="username" placeholder="이름" onChange={onChange} value={username} />
      <p>소개</p>
      <input className='text' name="text" placeholder="text" onChange={onChange} value={text} />
    </ProfileEditBlock>
  );
};



const ProfileEditBlock = styled.div`
width: 100%;
overflow: hidden;
padding: 10px;
p{
  font-size: 13px;
  margin: 0;
  padding: 10px 0 0 10px;
}

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

.imgBlock{
  height: 230px;
    display: flex;
    position: relative;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
}
.imgBlock img{
  width: 110px;
  height: 110px;
  border-radius: 50%;
}
.imgBlock .button{    
    display: flex;
    cursor: pointer;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    color: #5a77f3;
    font-weight: bold;
    font-size: 18px;

}

.imgBlock input{
    position: absolute!important;
    overflow: hidden;
    clip: rect(0,0,0,0);
}

input{
  width: 100%;
  font-size: 14px;
  font-weight: bold;
  padding: 10px;
  height: 40px;
  border: none;
  border-bottom: 1px #aaa solid;
}
.username{

}



`;



export default React.memo(CreateUser);