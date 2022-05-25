import React, { useRef, useCallback, useState, useEffect } from 'react';
import { useTodoState, useTodoDispatch, useUID } from '../ContextApi';
import useInputs from './useInputs';
import { firebase_db, imageStorage } from "../firebaseConfig.js"
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import FullLoading from './TimeLoading'
import PageHeader from '../components/PageHeader';
import Inner from '../components/Inner';




const CreateUser = () => {

  const navigate = useNavigate();
  const [isReactLoading, setIsReactLoading] = useState(false)
  const dispatch = useTodoDispatch();
  const state = useTodoState();
  const uid = useUID();
  
  const [attachment, setAttachment] = useState(state.User[uid].Profile.Userphoto);
  const [url, setUrl] = useState(state.User[uid].Profile.Userphoto);

  const goBack = () => {
    const confirm = window.confirm('프로필편집을 취소하시겠습니까??')
    if (confirm) {
      navigate(-1 ,);
    }
  };

  const [{ username, text }, onChange,] = useInputs({
    username: `${state.User[uid].Profile.Username}`,
    text: `${state.User[uid].Profile.Introduce}`
  });
  // const onSubmit = async () => {

  //   let attachmentUrl = ""
  //   if (attachment !== "") {
  //     const attachmentRef = imageStorage.ref().child(`${uid}/profile/photo`)
  //     const response = await attachmentRef.putString(attachment, 'data_url')
  //     attachmentUrl = await response.ref.getDownloadURL()
  //   }
  //   setUrl(attachmentUrl)
  //   console.log('onSubmit')
  // }

  const onFileChange = async (event) => {
    setIsReactLoading(true)
    const { target: { files } } = event;
    const theFile = files[0];
    const reader =  new FileReader();

    reader.readAsDataURL(theFile)

    reader.onloadend = (finishedEvent) => {
      const { currentTarget: { result } } = finishedEvent
      setAttachment(result)
    }
  }

  useEffect( ()=>{
  
    const onSubmit = async () => {

      let attachmentUrl = ""
      if (attachment !== state.User[uid].Profile.Userphoto) {
        const attachmentRef = imageStorage.ref().child(`${uid}/profile/photo`)
        const response = await attachmentRef.putString(attachment, 'data_url')
        attachmentUrl = await response.ref.getDownloadURL()
        setUrl(attachmentUrl)
        console.log(attachmentUrl)
        console.log(url)
        console.log('프로필사진 변경 완료')
        setIsReactLoading(false)
        
      }
    }
    onSubmit();

  }, [attachment]) 



  const profileEditBtn = async() => {
    setIsReactLoading(true)
    console.log(url)
    await firebase_db.ref(`/users/${uid}/Profile/`).set({
      Uid: `${uid}`,
      Username: `${username}`,
      Userphoto: `${url}`,
      Introduce: `${text}`,
    });

    await firebase_db.ref(`/users/${uid}/`).once('value').then((snapshot) => {
      console.log("로그인회원 파이어베이스 조회 성공")
      dispatch({
        type: 'CREATE_USER',
        user: snapshot.val(),
      })
    });

    navigate(-1);
  }





  return (
    <>
    <FullLoading isReactLoading={isReactLoading} ></FullLoading>
    <PageHeader title={'프로필 편집'} check={profileEditBtn}></PageHeader>
    <ProfileEditBlock>
      <div className='imgBlock'>
        <img src={attachment} alt=""></img>
        <label htmlFor="imageLoader" className="button">프로필 사진 변경</label>
        <input id='imageLoader' type='file' accept='image/*' onChange={onFileChange} />
      </div>
      <p>사용자 이름</p>
      <input autoFocus  className='username' name="username" placeholder="이름" onChange={onChange} value={username} />
      <p>소개</p>
      <textarea className='text' name="text" placeholder="text" onChange={onChange} value={text} />
    </ProfileEditBlock>
    </>
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
textarea{
  width: 100%;
  font-size: 14px;
  font-weight: bold;
  padding: 10px;
  height: 300px;
  border: none;
  border-bottom: 1px #aaa solid;
}
.username{

}



`;



export default React.memo(CreateUser);