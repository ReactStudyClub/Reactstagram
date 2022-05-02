import React, { useState, useReducer, createContext, useContext, useRef, useEffect } from 'react'
import { firebase_db } from "./firebaseConfig"



const initialTodos = {
  User: {
    userId: {
            Profile: {
              Introduce: "소개없음",
              Uid: "2WAF3CdAj0XdB2gN5qszar1ApvJ3",
              Username: "이름없음",
              Userphoto: "https://file.namu.moe/file/105db7e730e1402c09dcf2b281232df07cfd8577675ab05e4c269defaefb6f38c54eade7a465fd0b0044aba440e0b6b77c4e742599da767de499eaac22df3317"
            },
            UserPost: {
              "-N0sbeuUtsj4JINTUf9C": {
              date: 1651291106864,
              postContent: "리액트 공부합시다",
              postKey: "-N0sbeuUtsj4JINTUf9C",
              postPic: "https://firebasestorage.googleapis.com/v0/b/reactstagram-13fac.appspot.com/o/2WAF3CdAj0XdB2gN5qszar1ApvJ3%2Fposts%2FSat%20Apr%2030%202022%2012%3A58%3A12%20GMT%2B0900%20(%ED%95%9C%EA%B5%AD%20%ED%91%9C%EC%A4%80%EC%8B%9C)?alt=media&token=d065bcf0-d150-45a2-92cc-bdd7a2ab256d",
              starCount: 0,
              uid: "2WAF3CdAj0XdB2gN5qszar1ApvJ3",
              userName: "이름없음"
              },
            }
          }
        }
};

function todoReducer(state, action) {

  switch (action.type) {
    case 'LOGIN_USER':
      return {
        ...state,
        User: { [action.user.Profile.Uid]:action.user},
      };
    case 'CREATE_USER':
      return {
        ...state,
        User: { [action.user.Profile.Uid]:action.user},
            };
    

    case 'CREATE':
      return firebase_db.ref('/users').set(state.users);
    case 'TOGGLE':
      return state.map(todo =>
        todo.id === action.id ? { ...todo, done: !todo.done } : todo);
    case 'REMOVE':
      return state.filter(todo => todo.id !== action.id);
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }

}
const TodoNextIdContext = createContext();


const TodoStateContext = createContext();
const TodoDispatchContext = createContext();
const UIDContext = createContext();
const SetUIDContext = createContext();

export function TodoProvider({ children }) {
  const [state, dispatch] = useReducer(todoReducer, initialTodos);
  const nextId = useRef(5);
  const [UID, SetUID] = useState('유저데이터없음');

  console.log(state)


  return (
    <SetUIDContext.Provider value={SetUID}>
      <UIDContext.Provider value={UID}>
        <TodoStateContext.Provider value={state}>
          <TodoDispatchContext.Provider value={dispatch}>
            <TodoNextIdContext.Provider value={nextId}>
              {children}
            </TodoNextIdContext.Provider>
          </TodoDispatchContext.Provider>
        </TodoStateContext.Provider>
      </UIDContext.Provider>
    </SetUIDContext.Provider>
  );
}


// 커스텀 hook 과 에러처리 구문
export function useTodoState() {
  const context = useContext(TodoStateContext);
  if (!context) {
    throw new Error('Cannot find TodoProvider');
  }
  return context;
}

export function useTodoDispatch() {
  const context = useContext(TodoDispatchContext);
  if (!context) {
    throw new Error('Cannot find TodoProvider');
  }
  return context;
}

export function useTodoNextId() {
  const context = useContext(TodoNextIdContext);
  if (!context) {
    throw new Error('Cannot find TodoProvider');
  }
  return context;
}

export function useUID() {
  const context = useContext(UIDContext);
  if (!context) {
    throw new Error('Cannot find TodoProvider');
  }
  return context;
}

export function useSetUID() {
  const context = useContext(SetUIDContext);
  if (!context) {
    throw new Error('Cannot find TodoProvider');
  }
  return context;
}