import React from 'react'
import styled from 'styled-components';
import {MdFavoriteBorder,MdSend,MdAddCircleOutline} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const HeaderBlock = styled.header`
   z-index: 9999;
   padding: 0 15px 0 15px;
   background: #fff;
   border-bottom: 1px #d8d7d7 solid;
   height: 60px;
   position: fixed;
   width: 100%;
   display: flex;
   justify-content: space-between;
   align-items: center;
   
`;
const HeaderBlocknone = styled.header`
    height: 60px;
    width: 100%;
`;
const HeaderTitle = styled.div`
cursor: pointer;
font-size: 22px;
font-weight: bold;
font-family: auto;
color: #61dafb;
`;

const HeaderRigthZone = styled.div`
   display: flex;
   flex-direction: row;
   font-size: 22px;
`;

const HeaderAdd = styled.div`
cursor: pointer;
margin-left: 12px;
&:hover{
   color:#e03c8f;
}
`;


const HeaderLike = styled.div`
cursor: pointer;
margin-left: 12px;
&:hover{
   color:#e03c8f;
}

`;

const Headerchat = styled.div`
cursor: pointer;
margin-left: 12px;
&:hover{
   color:#e03c8f;
}
`;



function Header() {
   
   const navigate = useNavigate();
   
   const goUpload = () =>{
      navigate("/Upload");
   }

   console.log("헤더 랜더링");
   return (
      <>
         <HeaderBlocknone></HeaderBlocknone>
         <HeaderBlock>
            <HeaderTitle>Reactstagram</HeaderTitle>
            <HeaderRigthZone>
               <HeaderAdd><MdAddCircleOutline onClick={goUpload}></MdAddCircleOutline></HeaderAdd>
               <HeaderLike><MdFavoriteBorder></MdFavoriteBorder></HeaderLike>
               <Headerchat><MdSend></MdSend></Headerchat>
            </HeaderRigthZone>
         </HeaderBlock>
      </>
   )
}

export default React.memo(Header);