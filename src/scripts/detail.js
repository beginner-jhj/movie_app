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
    const [isPosterPath, setIsPosterPath] = useState(true)
    const [isMainCharacters, setIsMainCharacters] = useState(true)
    const [isDirector, setIsDirector] = useState(true)
    const [mainCharacters, setMainCharacters] = useState([])
    const [director, setDirector] = useState('')
    
    const getDetailsOfMovie = useCallback(async () => {
        const videoRes = await fetch(videoUrl)
        const videoJson = await videoRes.json()
        
        const planeRes = await fetch(planeUrl)
        const planeJson = await planeRes.json()
        
        const credditRes = await fetch(credditUrl)
        const credditJson = await credditRes.json()
        
        const youtubeKey =  videoJson.results && videoJson.results[0] && videoJson.results[0].key;
        const poster_path = planeJson.poster_path;
        const main_characters = credditJson.cast && credditJson.cast.slice(0,3);
        const director = credditJson.crew && credditJson.crew.find((member)=>member.job === 'Director')
        
        youtubeKey ? setVideoKey(videoJson.results[0].key) : setIsYouTube(false);
        poster_path ? setPosterPath(planeJson.poster_path) : setIsPosterPath(false);
        main_characters ? setMainCharacters(credditJson.cast.slice(0,3)) : setIsMainCharacters(false);
        director ? setDirector(credditJson.crew.find((member)=>member.job === 'Director')) : setIsDirector(false);
        
        setGenres(planeJson.genres)
        setTitle(planeJson.title)
        setOverview(planeJson.overview)
        setReleaseDate(planeJson.release_date)
        setScore(planeJson.vote_average)
        setRuntime(planeJson.runtime)
    }, [videoUrl, planeUrl, credditUrl])

    useEffect(()=>{getDetailsOfMovie()}, [getDetailsOfMovie])

    return (
        <div className={DetailStyles.movie_detail_box}>
            <div className={DetailStyles.title_box}>
                <Link className={DetailStyles.noUnderline} to={'/'}><h1>POPMOVIE</h1></Link>
            </div>
            <div className={DetailStyles.head_box}>
                <SearchBlock setKeyWord={setKeyWord} keyword={keyword}/>
                <h1>{title}</h1>
            </div>
            <div className={DetailStyles.video_box}>
                {isYouTube ? <ShowVideo videoKey={videoKey} /> : <AlteringVideo posterPath={posterPath} isPosterPath={isPosterPath}/>}            
            </div>
            <div className={DetailStyles.overview_container}>
                <p>{overview}</p>
            </div>
            <div className={DetailStyles.information_container}>
                <h2>출연진</h2>
                <div className={DetailStyles.cast_container}>
                    {mainCharacters.map((mainCharacter)=>(
                    <ShowActor 
                    profilePath={
                        isMainCharacters ? mainCharacter.profile_path:<p>프로필 정보 없음</p>
                    } 
                    character={isMainCharacters ? mainCharacter.character : <p>배역 정보 없음</p>} 
                    name={isMainCharacters ?  mainCharacter.name : <p>이름 정보 없음</p>}/>))}
                </div>
                <h2>감독</h2>
                <div className={DetailStyles.cast_container}>
                    <ShowActor 
                    profilePath={isDirector ? director.profile_path : <p>프로필 정보 없음</p>} 
                    character='Director' 
                    name={isDirector ? director.name : <p>이름 정보 없음</p>}/>
                </div>
                <div className={DetailStyles.details_container}>
                    <p>{genres.map(genre=>(genre.name+' '))}</p>
                    <p>상영시간: {runtime}분</p>
                    <p>개봉일: {releaseDate}</p>
                    <p>평점: {score}(TMDB)</p>
                </div>
            </div>
        </div>
    )
}

function ShowVideo({videoKey}){
    return (
        <iframe title="영화 예고편 영상" width='100%' height="100%" src={`https://www.youtube.com/embed/${videoKey}`} frameBorder="0"></iframe>
    )
}


function AlteringVideo({posterPath, isPosterPath}){
    const posterBaseUrl = 'https://image.tmdb.org/t/p/'
    const posterSize = 'w154'
    return (
        <div className={DetailStyles.exception}>
            {isPosterPath ? <img alt="" src={`${posterBaseUrl}${posterSize}${posterPath}`}></img> : <p>영화 포스터가 없습니다.</p>}
            <p>예고편을 가져올 수 없습니다.</p>
        </div>
    )
}

function ShowActor({profilePath, character,name}){
    const posterBaseUrl = 'https://image.tmdb.org/t/p/'
    const posterSize = 'w154'
    return (
        <div className={DetailStyles.cast_box}>
            <img src={`${posterBaseUrl}${posterSize}${profilePath}`} alt=""/>
            <p>{character} /</p>
            <p>{name}</p>
        </div>
    )
}

export default Detail;