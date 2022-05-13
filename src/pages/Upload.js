import React, { useEffect, useState } from 'react';
import { firebase_db, imageStorage } from "../firebaseConfig"
import { useTodoState, useTodoDispatch, useUID } from '../ContextApi';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { MdKeyboardBackspace, MdPhotoCamera, MdCheck } from 'react-icons/md';
import ReactLoading from 'react-loading';



const Loading = styled.div`
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 10;
    background: #386cae30;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;


    .ReactLoading{
    fill: rgb(255, 255, 255);
    height: 64px;
    width: 64px;
}
`


function Upload() {
    const navigate = useNavigate();
    const uid = useUID();
    const dispatch = useTodoDispatch();
    const state = useTodoState();



    const [view, setView] = useState([]);
    const [file, setFile] = useState('');
    const [attachment, setAttachment] = useState("");
    const [url, setUrl] = useState("https://2.bp.blogspot.com/-7fdJ0sJ_QrI/U4W-v8caIpI/AAAAAAAABxo/e7_hvfnNVFU/s1600/img.gif");

    const[isReactLoading, setIsReactLoading]= useState(false)



    const goBack = () => {
        const confirm = window.confirm('업로드를 취소하시겠습니까??')
        if (confirm) {
            navigate(-1);
        }
    };

       
    useEffect(() => {
        
        const onSubmit = async () => {
            let attachmentUrl = ""
            
            if (attachment !== "") {
                const attachmentRef = imageStorage.ref().child(`${uid}/posts/${Date()}`)
                const response = await attachmentRef.putString(attachment, 'data_url')
                attachmentUrl = await response.ref.getDownloadURL()
                setUrl(attachmentUrl)
                setIsReactLoading(false)
                console.log(url)
            }
        }
        onSubmit();
    }, [attachment])

    // const onSubmit = async (event) => {
    //     //사진 등록 함수 버튼

    //     let attachmentUrl = ""
    //     if (attachment !== "") {
    //         const attachmentRef = imageStorage.ref().child(`${uid}/posts/${Date()}`)
    //         const response = await attachmentRef.putString(attachment, 'data_url')
    //         attachmentUrl = await response.ref.getDownloadURL()
    //     }
    //     setUrl(attachmentUrl)
    //     setFile('')
    // }



    const onFileChange = (event) => {
        //사진 등록 함수
        const { target: { files, value } } = event;
        const theFile = files[0];
        const reader = new FileReader();
        setIsReactLoading(true)
        reader.onloadend = (finishedEvent) => {
            const { currentTarget: { result } } = finishedEvent
            setAttachment(result)
        }
        reader.readAsDataURL(theFile)
    }

    const onClearAttachment = () => {
        setAttachment("")
        setUrl("")
        setFile('')
    }

    const [content, setContent] = useState({
        postContent: '',
    })
    const { postContent } = content;

    const getValue = e => {
        const { name, value } = e.target;
        setContent({ ...content, [name]: value })
        console.log(content)
    }

    const writeNewPost = async (event) => {
        setIsReactLoading(true)
        event.preventDefault();
        try {
            // Get a key for a new Post.
            let newPostKey = firebase_db.ref().child('posts').push().key;
            // A post entry.
            let postData = {
                userName: state.User[uid].Profile.Username,
                uid: uid,
                postContent: postContent,
                postKey: newPostKey,
                starCount: 0,
                postPic: url,
                date: Date.now(),
                newDate:new Date(),
                userPhoto:state.User[uid].Profile.Userphoto,
                hashtag:null
            };
            // Write the new post's data simultaneously in the posts list and the user's post list.
            let updates = {};
            updates['/posts/' + newPostKey] = postData;
            updates['/users/' + uid + '/UserPost/' + newPostKey] = postData;

            firebase_db.ref().update(updates).then(() => console("게시물 작성완료")).catch((error) => {
                console.error(error);
                console.log(updates);
            });
        } catch (error) {
            console.log(error)
        }
    
        navigate('/Home');

    }

    return (
        <>
        {isReactLoading && (<Loading>
        <ReactLoading className='ReactLoading' type={"spin"} />
        </Loading>)}
        <UploadBlock>
            <div className='upLoadHeader'>
                <MdKeyboardBackspace className='MdKeyboardBackspace' onClick={goBack} />
                <p>새 게시물</p>
                <MdCheck className='MdCheck' onClick={writeNewPost}></MdCheck>
            </div>
            <div className='imageBox'>
                <form >
                    <label htmlFor="imageLoader" className="button"><MdPhotoCamera style={{ width: '40px', height: '40px' }} /></label>
                    <input id='imageLoader' type='file' accept='image/*' onChange={onFileChange} value={file} />
                    {attachment && (
                        <div>
                            <img src={attachment} style={{ width: '80px', height: '80px', marginLeft: '20px' }} alt="attachment" />
                            <button className='picDelete' onClick={onClearAttachment}>x</button>
                        </div>
                    )}
                </form>
            </div>

            <textarea type="text"
                placeholder='내용을 입력해주세요'
                onChange={getValue}
                name='postContent' />
            <p className='uploadbtn'>작성 완료</p>
        </UploadBlock>
        </>
    )
}



const UploadBlock = styled.div`




textarea{
    width: 100%;
    height: 150px;
    padding: 20px;
    display: flex;
    border: none;
    
    &:focus { outline: none; }
}
.upLoadHeader{
    display: flex;
    height: 65px;
    width: 100%;
    border-bottom: 1px #aaa solid;
    align-items: center;
    p{
        margin: 0;
        font-size: 21px;
        font-weight: bold;
        flex:2;
    }
    .MdKeyboardBackspace{
        height: 35px;
        width: 35px;
        margin: 0 10px 0 20px
    }
    .MdCheck{
        width: 35px;
        height: 35px;
        margin-right: 20px;
        color: #5a77f3;
        &:hover{
            color: #000;
        }
        
    }
}
.imageBox form{
    width: 100%;
    height: 120px;
    padding: 20px;
    display: flex;
    border-bottom: 1px #aaa solid;
}
.imageBox form div{
    position: relative;
}
.imageBox .picDelete{
    background: #151414;
    border: none;
    color: #fff;
    border-radius: 53%;
    font-weight: 700;
    top: 0;
    position: absolute;
    /* left: 10px; */
    right: 0;
    /* padding: 0px; */
    width: 21px;
    font-size: 14px;
}
.imageBox form .button{    
    display: flex;
    text-align: center;
    cursor: pointer;
    -webkit-appearance: none;
    -webkit-transition: all .25s ease-out;
    transition: all .25s ease-out;
    border: 2px solid #8c8c8c;
    border-radius: 10px;
    font-size: .9rem;
    background: #fff;
    color: #000;
    height: 100%;
    width: 80px;
    align-items: center;
    flex-direction: column;
    justify-content: center;
}

.imageBox form input{
    position: absolute!important;
    overflow: hidden;
    clip: rect(0,0,0,0);
}
.uploadbtn{
    font-size: 21px;
    text-align: center;
    padding: 10px;
    font-weight: bold;
    display: none;
}

`;

export default Upload;