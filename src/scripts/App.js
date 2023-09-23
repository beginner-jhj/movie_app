import { Routes, Route, BrowserRouter } from "react-router-dom";
import ResultPage from './search_result'
import Home from './home'
import Detail from "./detail";

function App() {
    return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home/>}></Route>
            <Route path="/movie_detail/:id" element={<Detail/>}></Route>
            <Route path="/search_result/:search_term" element={<ResultPage/>}></Route>
        </Routes>
    </BrowserRouter>
    )
}

export default App;
