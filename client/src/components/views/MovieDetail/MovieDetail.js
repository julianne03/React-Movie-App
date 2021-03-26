import React, { useEffect, useState } from 'react'
import { API_URL, API_KEY, IMAGE_BASE_URL } from '../../Config'
import MainImage from '../LandingPage/Sections/MainImage'
import MovieInfo from '../MovieDetail/Sections/MovieInfo'
import GridCards from '../commons/GridCards'
import Favorite from '../../views/MovieDetail/Sections/Favorite'
import { Row, Button } from 'antd';
import Comment from './Sections/Comment'
import LikeDislikes from './Sections/LikeDislikes'
import Axios from 'axios'

function MovieDetail(props) {

    let movieId = props.match.params.movieId
    // state
    const [ Movie, setMovie ] = useState([]);
    const [ Casts, setCasts ] = useState([]);
    const [ActorToggle, setActorToggle] = useState(false)
    const [Comments, setComments] = useState("")

    const movieVariable = {
        movieId: movieId
    }

    useEffect(() => {
        
        let endpointCrew = `${API_URL}movie/${movieId}/credits?api_key=${API_KEY}`

        let endpointInfo = `${API_URL}movie/${movieId}?api_key=${API_KEY}`

        fetch(endpointInfo)
        .then(response => response.json())
        .then(response => {
            console.log(response)
            setMovie(response)
        })

        fetch(endpointCrew)
        .then(response => response.json())
        .then(response => {
            console.log('responseForCrew', response)
            setCasts(response.cast)
        })

        Axios.post('/api/comment/getComments', movieVariable)
            .then(response => {
                if(response.data.success) {
                    setComments(response.data.comments)

                } else {
                    alert('코멘트 정보를 가져오는 데 실패하였습니다.')
                }
            })

    }, [])

    const refreshFunction = (newComment) => {
        setComments(Comments.concat(newComment))
    }

    const toggleActorView = () => {
        setActorToggle(!ActorToggle)
    }

    return (
        <div>
            {/* Header */}
            <MainImage
                image={`${IMAGE_BASE_URL}w1280${Movie.backdrop_path}`}
                title={Movie.original_title}
                text={Movie.overview}
            />

            {/* Body */}
            <div style={{ width: '85%', margin: '1rem auto' }}>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Favorite movieInfo={Movie} movieId={movieId} userFrom={localStorage.getItem('userId')} />
                </div>

                {/* Movie Info */}
                <MovieInfo
                    movie={Movie}
                />

                <br />
                {/* Actors Grid */}

                <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem' }}>
                    <Button type="primary" onClick={ toggleActorView }>Toggle Actor View</Button>
                </div>

                {ActorToggle &&
                    <Row gutter={[16,16]}>
                    {Casts && Casts.map((cast, index) => (
                        <React.Fragment key={index}>
                            <GridCards
                                image={cast.profile_path ?
                                    `${IMAGE_BASE_URL}w500${cast.profile_path}` : null}
                                charactorName={cast.name}
                            />
                        </React.Fragment>
                    ))}
                    </Row>
                }

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <LikeDislikes movie movieId={movieId} userId={localStorage.getItem('userId')} />
                </div>

                {/* Comment */}
                <Comment refreshFunction={refreshFunction} commentLists={Comments} movieId={movieId} />
                




            </div>
        </div>
    )
}

export default MovieDetail
