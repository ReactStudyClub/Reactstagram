import React, { useEffect, useState } from 'react';
import { firebase_db, imageStorage } from "../firebaseConfig"
import { useTodoState, useTodoDispatch, useUID } from '../ContextApi';
import { useNavigate } from 'react-router-dom';

function Upload() {
    const navigate = useNavigate();
    const uid = useUID();
    const dispatch = useTodoDispatch();
    const state = useTodoState();



    const [view, setView] = useState([]);
    const [file, setFile] = useState('');
    const [attachment, setAttachment] = useState();
    const [url, setUrl] = useState();

    const goHome = () => {
        navigate('/');
      }

    const onSubmit = async (event) => {
        event.preventDefault()
        let attachmentUrl = ""
        if (attachment !== "") {
            const attachmentRef = imageStorage.ref().child(`${uid}/posts/0`)
            const response = await attachmentRef.putString(attachment, 'data_url')
            attachmentUrl = await response.ref.getDownloadURL()
        }

        setUrl(attachmentUrl)
        setFile('')

    }
    const onFileChange = (event) => {
        const { target: { files, value } } = event;
        const theFile = files[0];
        const reader = new FileReader();
        setFile(value)
        reader.onloadend = (finishedEvent) => {
            const { currentTarget: { result } } = finishedEvent
            setAttachment(result)
        }
        reader.readAsDataURL(theFile)
    }

    const onClearAttachment = () => {
        setAttachment(null)
        setFile('')
    }

    const [content, setContent] = useState({
        //post_hashtag:'',
        post_content: '',
        post_id: '',
        post_picture: '',
        user_id: '',
        post_like: 0
    })

    const getValue = e => {
        const { name, value } = e.target;
        setContent({ ...content, [name]: value })
        console.log(content)
    }

    const submitValue = () => {

        firebase_db.ref('/posts/10/').push({
            //post_hashtag:content.post_hashtag,
            post_content: content.post_content,
            post_id: content.post_id,
            post_picture: url,
            user_id: content.user_id,
            user_name: state.User[uid].Username,
            post_like: parseInt(content.post_like)
        }).then(() => alert("제출되었습니다"))

    }

    const writeNewPost = () => {
        // A post entry.
        var postData = {
            author: state.User[uid].Username,
            uid: uid,
            body: "body",
            title: "title",
            starCount: 0,
            authorPic: url,
        };

        // Get a key for a new Post.
        var newPostKey = firebase_db.ref().child('posts').push().key;

        // Write the new post's data simultaneously in the posts list and the user's post list.
        var updates = {};
        updates['/posts/' + newPostKey] = postData;
        updates['/users/' + uid + '/UserPost/' + newPostKey] = postData;

        firebase_db.ref().update(updates).then(() => alert("제출되었습니다"))
        return goHome();
        ;
    }

    return (
        <div>
            <h1>upload</h1>
            <div>
                <form onSubmit={onSubmit}>
                    <input type='file' accept='image/*' onChange={onFileChange} value={file} />
                    <input type='submit' value='사진등록하기' />
                    {attachment && (
                        <div>
                            <img src={attachment} width="50px" height="50px" alt="attachment" />
                            <button onClick={onClearAttachment}>Clear</button>
                        </div>
                    )}
                </form>
            </div>
            <div>
                {view.map((element) =>
                    <div key={element.index}>
                        <h2>{element.title}</h2>
                        <div>{element.content}</div>
                    </div>)}
            </div>

            <input type="text"
                placeholder='내용'
                onChange={getValue}
                name='post_content' />

            <input type="text"
                placeholder='포스트 아이디'
                onChange={getValue}
                name='post_id' />

            <input type="text"
                placeholder='유저 아이디'
                onChange={getValue}
                name='user_id' />

            <button onClick={writeNewPost}>제출</button>
        </div>
    )
}

export default Upload;