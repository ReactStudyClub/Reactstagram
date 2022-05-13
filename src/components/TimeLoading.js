import React from 'react'
import styled,{css} from 'styled-components';
import ReactLoading from 'react-loading';

function TimeLoading({isReactLoading}) {
   return (
      <>
      <FullLoading isReactLoading={isReactLoading}>
         <ReactLoading className='ReactLoading' type={"spin"} />
      </FullLoading>

      </>
   )
}


export const FullLoading = styled.div`
   position: fixed;
   width: 100%;
   height: 100%;
   top: 0;
   left: 0;
   z-index: 10;
   background: #00000030;
   flex-direction: row;
   align-items: center;
   justify-content: space-around;
   display: none;
   ${props =>
      props.isReactLoading &&
      css`
      display: flex;
      `}
   .ReactLoading{
   fill: rgb(255, 255, 255);
   height: 64px;
   width: 64px;
}
`

export const CheckLoading = styled.div`
   
   ${props =>
      props.isReactLoading &&
      css`
      display: flex;
      `}
   .ReactLoading{
   fill: rgb(255, 255, 255);
   height: 45px;
   width: 45px;
}
`

export default TimeLoading