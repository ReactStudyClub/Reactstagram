import React, { useEffect } from 'react';
import Post from '../components/Post';
import BottomTeb from '../components/BottomTeb';
import Header from '../components/Header';
import Profile from './Profile';
import { Route,Routes,NavLink  } from 'react-router-dom';

import { authService } from '../firebaseConfig';
import { useSetUID, useTodoDispatch ,useTodoState} from '../ContextApi';
import { firebase_db } from "../firebaseConfig";
import { useNavigate ,useLocation} from 'react-router-dom';
import Inner from '../components/Inner';
const Home = () => {

  const { state } = useLocation();
  console.log('네비게이트' + state);

  return (
      <>
      <Header></Header>
      <Post></Post>
      <BottomTeb></BottomTeb>
      </>

  );
};

export default React.memo(Home);