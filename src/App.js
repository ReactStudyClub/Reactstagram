import React from 'react';
import { Routes, Route ,Redirect} from  "react-router-dom";
import About from './pages/About';
import Home from './pages/Home';
import Login from './pages/Login';
import Profiles from './pages/Profiles';
import MyPage from './pages/MyPage';
import ProfileEdit from './pages/ProfileEdit'
import Loading from './pages/Loading';
import MainBlock from './components/MainBlock';
import { useState } from "react";
import Upload from "./pages/Upload"
import { TodoProvider } from './ContextApi';

const App = () => {

  return(
    <TodoProvider>
      <MainBlock>
        <Routes>
          <Route path="/" element={<Loading />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/Profiles/*" element={<Profiles />} />
          <Route path="/Upload" element={<Upload />} />
          <Route path="/MyPage" element={<MyPage />} />
          <Route path="/ProfileEdit" element={<ProfileEdit />} />
          <Route path='/*' element={<h1>이 페이지는 존재하지 않습니다. - </h1>} />
        </Routes>
      </MainBlock>
    </TodoProvider>
  );
};

export default React.memo(App);