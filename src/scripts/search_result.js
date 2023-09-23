import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ResultPageStyle from "../styles/SearchResult.module.css"
import { SearchBlock, Movie_box } from "./home";
import {Link} from "react-router-dom";

function ResultPage(){
    const {search_term} = useParams()
    const [Results, setResults] = useState([])
    const [keyword, setKeyWord] = useState('')
    const key = process.env.REACT_APP_MY_API_KEY
    const getResults = async () => {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${search_term}&language=ko-KR
        `)
        const data = await response.json()
        setResults(data.results)
    }
    useEffect(()=>{getResults()}, [search_term])
    return (
        <div className={ResultPageStyle.search_result_home}>
            <div className={ResultPageStyle.search_box_container}>
                <Link to={'/'} className={ResultPageStyle.noUnderline}><h1>POPMOVIE</h1></Link>
                <SearchBlock keyword={keyword} setKeyWord={setKeyWord}/>
                <h3>'{search_term}'에 대한 검색결과</h3>
            </div>
            <span/>
            <ShowResults movies={Results}/>
        </div>
    )
}

function ShowResults({movies}){
    return (
    <div className={ResultPageStyle.movies_container}>
        {movies.map((movie)=>(
            <Movie_box poster_path={movie.poster_path} title={movie.title} id={movie.id}/>
        ))}
    </div>
    )
}

export default ResultPage;