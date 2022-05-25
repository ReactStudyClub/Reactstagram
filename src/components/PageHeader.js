import React from 'react'
import styled from 'styled-components';
import { MdKeyboardBackspace, MdPhotoCamera, MdCheck } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';



function PageHeader({title,check,checkstyle}) {
   const navigate = useNavigate();

   const goBack = () => {
         navigate(-1);
   };



   return (
      <PageHeaderBlock>
      <MdKeyboardBackspace className='MdKeyboardBackspace' onClick={goBack} />
      <p>{title}</p>
      <MdCheck type='button' style={checkstyle} className='MdCheck' onClick={check}></MdCheck>
      </PageHeaderBlock>
   )
}

export default PageHeader


const PageHeaderBlock = styled.div`
   display: flex;
   position: fixed;
   top: 0;
   z-index: 10;
   left: 0;
   background: #fff;
   min-height: 60px;
   width: 100%;
   border-bottom: 1px #aaa solid;
   align-items: center;
      p{
         margin: 0;
         font-size: 18px;
         font-weight: bold;
         flex:2;
      }
      .MdKeyboardBackspace{
         height: 29px;
         width: 29px;
         margin: 0 7px 0 13px;
      }
      .MdCheck{
         margin-right: 18px;
         width: 30px;
         height: 30px;
         color: #5a77f3;
         &:hover{
            color: #000;
         }
      }
`;