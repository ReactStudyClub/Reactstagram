import React from 'react'
import styled, { css } from 'styled-components';
import {MdSearch,MdHome,MdAccountCircle,MdShoppingCart} from 'react-icons/md';
import {NavLink } from "react-router-dom";


const BottomTebBlock =  styled.div`
z-index: 10;
display:flex;
background:#fff;
width: 100%;
min-height: 60px;
position: fixed;
bottom:0px;
left: 0;
border-top: 1px #0000002e solid;

`;

const Bottom =  styled.div`
display:flex;
background:#fff;
width: 100%;
min-height: 60px;
position: relative;
bottom:0px;
left: 0;

`;

const Text = styled.div`
cursor: pointer;
display: flex;
justify-content: center;
align-items: center;
flex: 1;
font-size:25px;

   /* ${props =>
      props.done &&
      css
         `color:#ced4da;
         `} */
`;


function BottomTeb() {

   return (
      <>
      <Bottom></Bottom>
      <BottomTebBlock>
         <Text><NavLink to="/Home" style={({ isActive }) => ({ color: isActive ? '#61dafb;' : '#0000005c' })}><MdHome></MdHome></NavLink></Text>
         <Text><NavLink to="/About" style={({ isActive }) => ({ color: isActive ? '#61dafb;' : '#0000005c' })}><MdSearch></MdSearch></NavLink></Text>
         <Text><NavLink to="/ChatList" style={({ isActive }) => ({ color: isActive ? '#61dafb;' : '#0000005c' })}><MdShoppingCart/></NavLink></Text>
         <Text><NavLink to="/MyPage" style={({ isActive }) => ({ color: isActive ? '#61dafb;' : '#0000005c' })}><MdAccountCircle/></NavLink></Text>
      </BottomTebBlock>
         </>
   )
}

export default React.memo(BottomTeb);