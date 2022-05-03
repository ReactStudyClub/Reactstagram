import React from 'react';
import Post from '../components/Post';
import BottomTeb from '../components/BottomTeb';
import Header from '../components/Header';

const Home = () => {
  return (
    <>
    <Header></Header>
    <Post></Post>
    <BottomTeb></BottomTeb>
    </>

  );
};

export default React.memo(Home);