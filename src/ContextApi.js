import React, { useState, useReducer, createContext, useContext, useRef, useEffect } from 'react'
import { firebase_db } from "./firebaseConfig.js"
import { useNavigate } from 'react-router-dom';


const initialTodos = {
  User: {
    default: null
  },
  // User: {
  //   userId: {
  //           Profile: {
  //             Introduce: "소개없음",
  //             Uid: "없음",
  //             Username: "이름없음",
  //             Userphoto: "https://file.namu.moe/file/105db7e730e1402c09dcf2b281232df07cfd8577675ab05e4c269defaefb6f38c54eade7a465fd0b0044aba440e0b6b77c4e742599da767de499eaac22df3317",
  //             Email:'ex@naver.com',
  //           },
  //           UserPost: {
  //             "-N0sbeuUtsj4JINTUf9C": {
  //             date: 1651291106864,
  //             postContent: "리액트 공부합시다",
  //             postKey: "-N0sbeuUtsj4JINTUf9C",
  //             postPic: "d",
  //             starCount: 0,
  //             uid: "2WAF3CdAj0XdB2gN5qszar1ApvJ3",
  //             userName: "이름없음"
  //             },
  //           }
  //         }
  //       }
};

function todoReducer(state, action) {

  switch (action.type) {
    case 'LOGIN_USER':
      return {
        ...state,
        User: { [action.user.Profile.Uid]: action.user },
      };
    // case 'CREATE_USER':
    //   return {
    //     ...state,
    //     User: { [action.user.Profile.Uid]: action.user },
    //   };
    // case 'POST_DELETE':
    //   console.log(action.posts.postKey)
    //         const UserPosts = {...state.User[action.posts.uid].UserPost}
    //   delete UserPosts[`${action.posts.postKey}`]
    //   return {
    //     ...state,
    //     User:{[action.posts.uid]:
    //       {...state.User[action.posts.uid],UserPost:UserPosts
    //     }}
    //   }

      // return {
      //   state.post:'1',
      //   asdas:'asd',

      //   post:{...state.post, name:'aasdfasf'},
        
      // }
    // case 'CREATE':
    //   return firebase_db.ref('/users').set(state.users);
    // case 'TOGGLE':
    //   return state.map(todo =>
    //     todo.id === action.id ? { ...todo, done: !todo.done } : todo);
    // case 'REMOVE':
    //   return state.filter(todo => todo.id !== action.id);
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
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(todoReducer, initialTodos);
  const nextId = useRef(5);
  const [UID, SetUID] = useState('유저데이터없음');
  useEffect(() => {

    if (state === initialTodos) {
      navigate('/');
      console.log('스테이트에 유저 데이터가 없습니다 로딩페이지로 이동합니다.')
    }

  }, [initialTodos])


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