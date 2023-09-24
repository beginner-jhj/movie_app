import { useParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import DetailStyles from '../styles/Detail.module.css'
import {SearchBlock} from './home'
import { Link } from "react-router-dom";

function Detail(){
    const {id} = useParams()
    const key = process.env.REACT_APP_MY_API_KEY
    const videoUrl = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${key}&language=ko-KR`
    const planeUrl = `https://api.themoviedb.org/3/movie/${id}?api_key=${key}&language=ko-KR`
    const credditUrl = `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${key}`
    const [keyword, setKeyWord] = useState('')
    const [genres, setGenres] = useState([])
    const [title, setTitle] = useState('')
    const [overview, setOverview] = useState('')
    const [releaseDate, setReleaseDate] = useState('')
    const [score, setScore] = useState('')
    const [runtime, setRuntime] = useState('')
    const [posterPath, setPosterPath] = useState('')
    const [videoKey, setVideoKey] = useState('')
    const [isYouTube, setIsYouTube] = useState(true)
    const [mainCharacters, setMainCharacters] = useState([])
    const [director, setDirector] = useState('')
    const posterBaseUrl = 'https://image.tmdb.org/t/p/'
    const posterSize = 'w154'
    const firstMainCharacter = mainCharacters[0]
    const secondMainCharacter = mainCharacters[1]
    const thirdMainCharacter = mainCharacters[2]
    
    const getDetailsOfMovie = useCallback(async () => {
        const videoRes = await fetch(videoUrl)
        const videoJson = await videoRes.json()
        
        const planeRes = await fetch(planeUrl)
        const planeJson = await planeRes.json()
        
        const credditRes = await fetch(credditUrl)
        const credditJson = await credditRes.json()
        
        setMainCharacters(credditJson.cast.slice(0,3))
        setDirector(credditJson.crew.find((member)=>member.job === 'Director'))
        const youtubeKey =  videoJson.results && videoJson.results[0] && videoJson.results[0].key;
        
        if (youtubeKey){
            setVideoKey(videoJson.results[0].key)
        }else{
            setIsYouTube(false)
        }
        setGenres(planeJson.genres)
        setTitle(planeJson.title)
        setOverview(planeJson.overview)
        setReleaseDate(planeJson.release_date)
        setScore(planeJson.vote_average)
        setRuntime(planeJson.runtime)
        setPosterPath(planeJson.poster_path)
    }, [videoUrl, planeUrl, credditUrl])

    useEffect(()=>{getDetailsOfMovie()}, [getDetailsOfMovie])

    return (
        <div className={DetailStyles.movie_detail_box}>
            <div>
            <Link to={'/'} className={DetailStyles.noUnderline}><h1>POPMOVIE</h1></Link>
            <SearchBlock keyword={keyword} setKeyWord={setKeyWord}/>
            </div>
            <h1 className={DetailStyles.title}>{title}</h1>
            {isYouTube ? <ShowVideo videoKey={videoKey}/> : <AlteringVideo posterPath={posterPath}/>}
            <div className={DetailStyles.overview_container}>
                <p className={DetailStyles.overview}>{overview}</p>
            </div>
            <div className={DetailStyles.information_container}>
                <div className={DetailStyles.genre_container}>{genres.map((genre)=><span key={genre.name} className={DetailStyles.genre}>{genre.name}</span>)}</div>
                <div className={DetailStyles.date_score_container}>
                    <span>개봉일: {releaseDate}</span>
                    <span>평점(TMDB): {score}</span>
                    <span>상영시간: {runtime}분</span>
                </div>
            </div>
            <h3 className={DetailStyles.cast}>출연진</h3>
            {firstMainCharacter &&(<div className={DetailStyles.creddits_container}>
                <div className={DetailStyles.profile_container}>
                    <img className={DetailStyles.profile_img} alt="" src={`${posterBaseUrl}${posterSize}${firstMainCharacter.profile_path}`}></img>
                    <span className={DetailStyles.profile}>{firstMainCharacter.character}</span>
                    <span className={DetailStyles.profile}>{firstMainCharacter.name}</span>
                </div>
                <div className={DetailStyles.profile_container}>
                    <img className={DetailStyles.profile_img} alt="" src={`${posterBaseUrl}${posterSize}${secondMainCharacter.profile_path}`}></img>
                    <span className={DetailStyles.profile}>{secondMainCharacter.character}</span>
                    <span className={DetailStyles.profile}>{secondMainCharacter.name}</span>
                </div>
                <div className={DetailStyles.profile_container}>
                    <img className={DetailStyles.profile_img} alt="" src={`${posterBaseUrl}${posterSize}${thirdMainCharacter.profile_path}`}></img>
                    <span className={DetailStyles.profile}>{thirdMainCharacter.character}</span>
                    <span className={DetailStyles.profile}>{thirdMainCharacter.name}</span>
                </div>
            </div>)}
            <h3 className={DetailStyles.director}>감독</h3>
            <div className={DetailStyles.director_container}>
                <div className={DetailStyles.director_profile_container}>
                    <img className={DetailStyles.profile_img} alt="" src={`${posterBaseUrl}${posterSize}${director.profile_path}`}></img>
                    <span className={DetailStyles.profile}>Director</span>
                    <span className={DetailStyles.profile}>{director.name}</span>
                </div>
            </div>
        </div>
    )
}

function ShowVideo({videoKey}){
    return (
        <iframe title="영화 예고편 영상" width="100%" height="100%" src={`https://www.youtube.com/embed/${videoKey}`} frameBorder="0"></iframe>
    )
}


function AlteringVideo({posterPath}){
    const posterBaseUrl = 'https://image.tmdb.org/t/p/'
    const posterSize = 'w154'
    return (
        <div className={DetailStyles.exception}>
            <img alt="" src={`${posterBaseUrl}${posterSize}${posterPath}`}></img>
            <p>예고편을 가져올 수 없습니다.</p>
        </div>
    )
}

export default Detail;