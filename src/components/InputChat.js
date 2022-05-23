import React, { useCallback} from 'react'
import useInputs from './useInputs';
import styled from 'styled-components';

const InputChat = ({ Username, saveMessages }) => {
   const [{ text }, onChange, reset,] = useInputs({ text: '' });


   const onEnterKey = function (e) {
      if (e.key === 'Enter') {
         //엔터키 키코드가 입력이 되면 
         e.preventDefault(); saveMessages(text);  reset(); 
      }
   }


   return (
      <InputBlock >
         <textarea rows={20}  onKeyPress={onEnterKey}
            placeholder={`${Username} (으)로 메시지 전송`}
            name='text' onChange={onChange} value={text}></textarea>
         <button onClick={(e) => {
            e.preventDefault();
            saveMessages(text);
             reset();
  }}>전송</button>
      </InputBlock>
   );
};



const InputBlock = styled.div`
   width: 100%;
    position: fixed;
    text-align: center;
    bottom: 0;
    min-height: 30px;
    max-height: 30px;
    font-size: 15px;
    font-weight: 500;
    border-top: 0.5px #acacac solid;
    display: flex;
    background: #fff;
    textarea{
      border:none;
      flex: 1;
   }
   button{
   background: #fff;
   border: none;
   color: #6683fe;
   font-weight: bold;
   font-size: 15px;
   }
`;
export default React.memo(InputChat);