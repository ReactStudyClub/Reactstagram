import React from 'react';
import styled from 'styled-components';

const Block = styled.div`
  @media screen and (min-width: 800px) {
  
    }
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  

  position: relative; /* 추후 박스 하단에 추가 버튼을 위치시키기 위한 설정 */
  background: white;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.04);

  margin: 0 auto; /* 페이지 중앙에 나타나도록 설정 */
  display: flex;
  flex-direction: column;
  padding-bottom: 56px;
  /* padding-top: 60px; */




`;

function MainBlock({ children }) {
  return <Block>{children}</Block>;
}

export default MainBlock;