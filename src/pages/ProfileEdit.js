import React,{useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import CreateUser from '../components/CreateUser';
import BottomTeb from '../components/BottomTeb';
import { useTodoState, useTodoDispatch, useUID } from '../ContextApi';

function ProfileEdit() {
  const state = useTodoState();
  const navigate = useNavigate()



  return (state.User.default===null ? <div>404</div> :
    <>
    <CreateUser></CreateUser>
    </>
  )
}

export default ProfileEdit