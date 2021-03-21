import React, { useState } from 'react'
import { Button, Form } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import Axios from 'axios';
import { useSelector } from 'react-redux';
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';

function Comment(props) {

    const movieId = props.movieId;

    const user = useSelector(state => state.user);
    const [commentValue, setcommentValue] = useState("")

    const handleClick = (event) => {
        setcommentValue(event.currentTarget.value)
    }

    const onSubmit = (event) => {
        event.preventDefault();

        const variables = {
            content: commentValue,
            writer : user.userData._id,
            movieId : props.movieId,
        }
        console.log(variables);

        Axios.post('/api/comment/saveComment', variables)
        .then(response => {
            if(response.data.success) {
                setcommentValue("")
                props.refreshFunction(response.data.result)
            } else {
                alert('코멘트를 저장하지 못했습니다.')
            }
        })
    }

    return (
        <div>
            <br />
            <p>Replies</p>
            <hr />

            {/* Comment Lists */}
            {props.commentLists && props.commentLists.map((comment, index) => (
                (!comment.responseTo &&
                    <React.Fragment>
                        <SingleComment refreshFunction={props.refreshFunction} comment={comment} movieId={movieId} />
                        <ReplyComment refreshFunction={props.refreshFunction} parentCommentId={comment._id} movieId={movieId} commentLists={props.commentLists} />
                    </React.Fragment>
                    
                    )
                
            ))}

            {/* Root Commment Form */}

            <Form style={{ display: 'flex' }} onSubmit={onSubmit} >
                <TextArea
                    style={{ width: '100%', borderRadius: '5px' }}
                    onChange={handleClick}
                    value={commentValue}
                    placeholder="코멘트를 작성 해주세요"
                />
                <br />
                <Button type="primary" style={{ width: '20%', height: '52px' }} onClick={onSubmit}>Submit</Button>
            </Form>
        </div>
    )
}

export default Comment
