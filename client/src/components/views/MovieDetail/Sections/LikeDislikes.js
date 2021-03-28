import React, { useEffect, useState } from 'react'
import { Tooltip, Icon } from 'antd';
import { LikeOutlined, DislikeOutlined } from '@ant-design/icons'
import Axios from 'axios';


function LikeDislikes(props) {

    const [Likes, setLikes] = useState(0)
    const [LikeAction, setLikeAction] = useState(null)
    const [DisLikes, setDislikes] = useState(0)
    const [DisLikeAction, setDislikesAction] = useState(null)

    let variable = {}

    if(props.movie) {
        variable = { movieId: props.movieId , userId: props.userId }

    } else {
        variable = { commentId: props.commentId, userId: props.userId }
    }

    useEffect(() => {
        Axios.post('/api/like/getLikes', variable)
            .then(response => {
                console.log('getLikes', response.data)
                if (response.data.success) {

                    // 얼마나 많은 좋아요를 받았는지
                    setLikes(response.data.likes.length)

                    // 내가 이미 그 좋아요를 눌렀는지
                    response.data.likes.map(like => {
                        if(like.userId === props.userId) {
                            setLikeAction('liked')
  
                        }
                    })
                } else {
                    alert('Likes에 정보를 가져오지 못했습니다.')
                }
            })

            Axios.post('/api/like/getDisLikes', variable)
            .then(response => {

                if (response.data.success) {

                    // 얼마나 많은 좋아요를 받았는지
                    setDislikes(response.data.dislikes.length)

                    // 내가 이미 그 좋아요를 눌렀는지
                    response.data.dislikes.map(dislike => {
                        if(dislike.userId === props.userId) {
                            setDislikesAction('disliked')
                        }
                    })
                } else {
                    alert('DisLikes에 정보를 가져오지 못했습니다.')
                }
            })
    }, [])

    const onLike = () => {
        if(LikeAction === null) {
            Axios.post('/api/like/upLike', variable)
                .then(response => {
                    if (response.data.success) {
                        setLikes(Likes + 1)
                        setLikeAction('liked')

                        if(DisLikeAction !== null) {
                            setDislikesAction(null)
                            setDislikes(DisLikes - 1)
                        }
                    } else {
                        alert('Like를 올리지 못하였습니다.')
                    }
                })
        } else {
            Axios.post('/api/like/unLike', variable)
                .then(response => {
                    if (response.data.success) {
                        setLikes(Likes -1)
                        setLikeAction(null)
                    } else {
                        alert('Like를 올리지 못하였습니다.')
                    }
                })
        }
    }

    const onDislike= () => {
        if(DisLikeAction !== null) {
            Axios.post('/api/like/unDislike', variable)
            .then(response => {
                if (response.data.success) {
                    setDislikes(DisLikes - 1)
                    setDislikesAction(null)
                } else {
                    alert('dislike를 지우지 못했습니다.')
                }
            })
        } else {

            Axios.post('/api/like/upDisLike', variable)
                .then(response => {
                    if (response.data.success) {

                        setDislikes(DisLikes + 1)
                        setDislikesAction('disliked')

                        //If dislike button is already clicked
                        if(LikeAction !== null ) {
                            setLikeAction(null)
                            setLikes(Likes - 1)
                        }

                    } else {
                        alert('Failed to increase dislike')
                    }
            })
        }
    }

    return (
        <React.Fragment>
            <span key="comment-basic-like">
                <Tooltip title="Like">
                    <Icon type="like"
                        theme={LikeAction === 'liked' ? 'filled' : 'outlined'}
                        onClick={onLike}
                    />
                </Tooltip>
                <span style={{ paddingLeft: '8px', cursor: 'auto' }}>{ Likes }</span>
            </span>&nbsp;&nbsp;&nbsp;
            <span key="comment-basic-dislike">
                <Tooltip title="Dislike">
                    <Icon type="dislike"
                        theme={DisLikeAction === 'disliked' ? 'filled' : 'outlined'}
                        onClick={onDislike}
                    />
                </Tooltip>
                <span style={{ paddingLeft: '8px', cursor: 'auto' }}>{ DisLikes }</span>
            </span>
        </React.Fragment>
    )
}

export default LikeDislikes
