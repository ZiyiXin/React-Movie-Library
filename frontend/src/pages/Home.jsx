import MovieCard from "../components/MovieCard"
import { useState, useEffect } from "react"
import { getPopularMovies } from "../services/api";
import { searchMovies } from "../services/api";
import "../css/Home.css"

function Home() {

    const [searchQuery, setSearchQuery] = useState('');
    const [movies, setMovies] = useState([])
    const [err, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadPopularMovies = async () => {
            try {
                const popularMoives = await getPopularMovies()
                setMovies(popularMoives)
            } catch (err) {
                console.log(err)
                setError('Fail to load the movies...')
            }
            finally {
                setLoading(false)
            }
        }
        loadPopularMovies()
    }, [])



    const handleSearch = async (e) => {
        e.preventDefault()

        if (!searchQuery.trim()) return
        if (loading) return

        setLoading(true)
        try {
            const searchResult = await searchMovies(searchQuery)
            setMovies(searchResult)
            setError(null)
        } catch (err) {
            console.log(err);
            setError("failed to search movies...")
        } finally {
            setLoading(false)
        }
        setSearchQuery('')
    }

    return (
        <div className="home">

            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    placeholder="Search for movies..."
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="search-button">Search</button>
            </form>

            {err && <div className="error-message">{err}</div>}

            {loading ? <div className="loading">Loading...</div> :
                <div className="movies-grid">
                    {movies.map(
                        (movie) =>
                        (
                            <MovieCard movie={movie} key={movie.id} />
                        )
                    )}
                </div>}
        </div>
    )
}

export default Home