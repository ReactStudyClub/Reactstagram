import React from 'react';
import styled from 'styled-components';
import Div100vh from 'react-div-100vh'

const Block = styled.div`
  @media screen and (min-width: 800px) {
    width: 520px;
    //align-items: center;
    }
  width: 100%;
  height: 100%;
  padding: 60px 0 0px 0;
  box-sizing: border-box;
  text-decoration: none;
  white-space: pre-wrap;
  overflow: hidden;
  a{color: #000;
    text-decoration: none;
    /* &:hover {
    color: #e03c8f;
  } */
  }
  p{
    margin: 0;
  }
  

  position: relative; /* 추후 박스 하단에 추가 버튼을 위치시키기 위한 설정 */
  background: white;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.04);

  margin: 0 auto; /* 페이지 중앙에 나타나도록 설정 */
  /* padding-top: 60px; */




`;

function MainBlock({ children }) {
  return <Block>{children}</Block>;
}

export default MainBlock;