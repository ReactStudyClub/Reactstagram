import React from 'react'
import { useNavigate } from 'react-router-dom';
import CreateUser from '../components/CreateUser';
import BottomTeb from '../components/BottomTeb';
function ProfileEdit() {
  const navigate = useNavigate();

  const goBack = () => {
    const confirm = window.confirm('편집을 완료하셨습니까?')
    if (confirm) {
      navigate(-1);
    }
  };
  
  return (
    <>
    <CreateUser></CreateUser>
    <BottomTeb></BottomTeb>
    </>
  )
}

export default ProfileEdit