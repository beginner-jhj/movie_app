import { useState, useEffect,useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import HomeStyle from '../styles/Home.module.css'
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styled from "styled-components";

function Home(){
    const [keyword, setKeyWord] = useState('')
    const [KrPopularMovies, setKrPopularMovies] = useState([])
    const [ForeignPopularMovies, setForeignPopularMovies] = useState([])
    const [KrNowPlaying, setKrNowPlaying] = useState([])
    const [BestMovies, setBestMovies] = useState([])
    const [UpcomingMovies, setUpcomingMovies] = useState([])

    const key = process.env.REACT_APP_MY_API_KEY
    
    return (
        <div className={HomeStyle.main_home}>
            <div>
            <Link to={'/'} className={HomeStyle.noUnderline}><h1>POPMOVIE</h1></Link>
                <SearchBlock setKeyWord={setKeyWord} keyword={keyword}></SearchBlock>
            </div>
            <span/>
            <div className={HomeStyle.container}>
                <span>국내 인기 영화</span>
                <div className={HomeStyle.show_box}>
                    <MovieSlider movies={KrPopularMovies} endpoint={'popular'} region='KR' setMovies={setKrPopularMovies} api_key={key}></MovieSlider>
                </div>
            </div>
            <span/>
            <div className={HomeStyle.container}>
                <span>해외 인기 영화</span>
                <div className={HomeStyle.show_box}>
                    <MovieSlider movies={ForeignPopularMovies} endpoint={'popular'} region={'US'} setMovies={setForeignPopularMovies} api_key={key}></MovieSlider>
                </div>
            </div>
            <span/>
            <div className={HomeStyle.container}>
                <span>국내 상영 영화</span>
                <div className={HomeStyle.show_box}>
                    <MovieSlider movies={KrNowPlaying} endpoint={'now_playing'} region={'KR'} setMovies={setKrNowPlaying} api_key={key}></MovieSlider>
                </div>
            </div>
            <span/>
            <div className={HomeStyle.container}>
                <span>최고 평점 영화</span>
                <div className={HomeStyle.show_box}>
                    <MovieSlider movies={BestMovies} endpoint={'top_rated'} region={'US'} setMovies={setBestMovies} api_key={key}></MovieSlider>
                </div>
            </div>
            <span/>
            <div className={HomeStyle.container}>
                <span>개봉 예정 영화</span>
                <div className={HomeStyle.show_box}>
                    <MovieSlider movies={UpcomingMovies} endpoint={'upcoming'} region={'KR'} setMovies={setUpcomingMovies} api_key={key}></MovieSlider>
                </div>
            </div>
        </div>
    )
}

export function SearchBlock({setKeyWord, keyword}){
    const navigate = useNavigate()
    const HandleSubmit = (e) => {
        e.preventDefault()
        e.target.reset()
        navigate(`/search_result/${keyword}`)
    }

    const updateKeyWord = (e) => {
        if ((e.target.value.length)>=1){
            setKeyWord(e.target.value)
        }
    }
    return (
        <form onSubmit={HandleSubmit}>
            <input
            className={HomeStyle.input_box} 
            onChange={updateKeyWord}
            placeholder="이곳에서 검색하세요."
            ></input>
        </form>
    )
}

function MovieSlider({movies, endpoint,region, setMovies, api_key}){
    const baseUrlPopularMovies = `https://api.themoviedb.org/3/movie/${endpoint}?api_key=${api_key}`
    const regionParameter = `&language=ko-KR&region=${region}`

    const getMovies = useCallback(async () => {
        const response = await fetch(`${baseUrlPopularMovies}${regionParameter}`)
        const data = await response.json()
        setMovies(data.results)
    }, [baseUrlPopularMovies, regionParameter, setMovies])

    useEffect(()=>{getMovies()}, [getMovies])

    const settings = {
        dots: false,
        infinite: true,
        speed: 160,
        slidesToShow: 3,
        slidesToScroll: 1,
        swipe:true,
        swipeToSlide:true
    }

    const StyledSlider = styled(Slider)`
        width:100%;
        height:100%;
    `
    return (
        <div className={HomeStyle.slider_container}>
            <StyledSlider {...settings}>
                {movies.map((movie)=>(
                    <div key={movie.id} className={HomeStyle.movies_container}>
                        <MovieBox poster_path={movie.poster_path} title={movie.title} id={movie.id}/>
                    </div>
                ))}
            </StyledSlider>
        </div>
    )
}


export function MovieBox({poster_path, title,id}){
    const baseUrl = 'https://image.tmdb.org/t/p/'
    const size = 'w154'
    return (
        <div className={HomeStyle.movie_box}>
        <Link to={`/movie_detail/${id}`}><img src={`${baseUrl}${size}${poster_path}`} alt='' title={title}/></Link>
        </div>
    )
}

export default Home;