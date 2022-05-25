import React, { useCallback,useRef,forwardRef} from 'react'
import useInputs from './useInputs';
import styled from 'styled-components';

const InputChat = ({ Username, saveMessages ,inputRef,scrollView }) => {
   const [{ text }, onChange, reset,] = useInputs({ text: '' });


   const onEnterKey = function (e) {
      if (e.key === 'Enter') {
         //엔터키 키코드가 입력이 되면 
         e.preventDefault(); saveMessages(text);  reset(); 
      }
   }
   console.log('inputRef.current.focus() :>> ', inputRef.current);
   
  // onFocus={null}
  //onFocus={()=> setTimeout(() => scrollView(),500) }


   return (
      <InputBlock >
         <textarea ref={inputRef} rows={20} onFocus={()=> setTimeout(() => scrollView(),100) }
            placeholder={`${Username} (으)로 메시지 전송`}
            name='text' onChange={onChange} value={text}></textarea>
         <button onClick={(e) => {
           console.clear();
           inputRef.current.focus();
            saveMessages(text);
             reset();        
  }}>전송</button>
      </InputBlock>
   );
};



const InputBlock = styled.div`
   left: 0;
   width: 100%;
    position: fixed;
    text-align: center;
    bottom: 0;
    min-height: 60px;
    max-height: 60px;
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