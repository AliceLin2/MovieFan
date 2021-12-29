// write your code here
const EMPTY_HEART = '♡'
const FULL_HEART = '♥'

document.addEventListener('DOMContentLoaded',()=>{
    let pageNum = 1
    const list = document.querySelector('#movie-list')
    const back = document.querySelector('#back')
    const forward = document.querySelector('#forward')
    const collectedMovies = list.getElementsByTagName('img')
    const movieDetail = document.querySelector('#movie-detail')
    const searchForm = document.querySelector('#search-form')
    const controlBtn = document.getElementById('control-button')
    let categories = document.getElementById('categories')
    let selected = categories.options[categories.selectedIndex].value

    fetchCollection()
    fetchData(selected) 

    categories.addEventListener('change', (e)=>{
        selected = e.target.value
        movieDetail.innerHTML=''
        fetchData(selected)
    })
    
    back.addEventListener('click',(e)=>{
        if(pageNum>1){
            pageNum -= 1
            movieDetail.innerHTML=''
            fetchData(selected,pageNum)          
        }
    })

    forward.addEventListener('click',(e)=>{
        pageNum += 1
        movieDetail.innerHTML=''
        fetchData(selected,pageNum)
    })

    searchForm.addEventListener('submit', (e)=>{
        e.preventDefault()
        movieDetail.innerHTML=''
        searchByKeyword(e.target.elements['keyword'].value)
        searchForm.reset()
    })
    
    function searchByKeyword(keyword){
        fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&page=1&query=${keyword}`,{
            method: 'GET',
            header: {
                'Content-Type': 'application/json'
            }
        })
        .then(res=>res.json())
        .then(data=>{
            if(data.results.length === 0){
                alert("Keyword didn't return any result, please enter an valid keyword")
            } else {
                data.results.forEach(movie=>{
                    fetchMovieDetail(movie.id)
                })
            }
        })
    }

    function fetchData(movieCategory,pageNum){
        fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&with_genres=${movieCategory}&page=${pageNum}`,{
            method: 'GET',
            header: {
                'Content-Type': 'application/json'
            }
        })
        .then(res=>res.json())
        .then(data=>{
            controlBtn.style.display = 'block'
            data.results.forEach(movie=>{
                fetchMovieDetail(movie.id)
            })
        })
    }
    
    function fetchMovieDetail(movieId){
        fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`,{
            method: 'GET',
            header: {
                'Content-Type': 'application/json'
            }
        })
        .then(res=>res.json())
        .then(data=>{
            createMovieDetail(data)
        })
    }
    
    function createMovieDetail(movieObj){
        const imgSrc = movieObj.poster_path === null?'No_image_available.jpg':`https://image.tmdb.org/t/p/original${movieObj.poster_path}`
        const producerName = movieObj.production_companies.length === 0?'':`${movieObj.production_companies[0].name}`
        const movie = document.createElement('div')
        const imgPart = document.createElement('div')
        const img = document.createElement('img')
        const descPart = document.createElement('div')
        const h2 = document.createElement('h2')
        const overview = document.createElement('p')
        const imdbId = document.createElement('p')
        const releaseDate = document.createElement('p')
        const producer = document.createElement('p')
        const link = document.createElement('a')
        const like = document.createElement('div')
        const likeGlyph = document.createElement('span')

        imgPart.className = 'detail-parts'
        img.className = 'detail-image'
        img.src = imgSrc
        img.alt = "Movie Poster"
        imgPart.appendChild(img)
        descPart.classList.add('detail-parts','detail-description')
        h2.innerText = `Title: ${movieObj.title}`
        overview.innerText = `Overview: ${movieObj.overview}`
        imdbId.innerText = `IMDB ID: ${movieObj.imdb_id}`
        releaseDate.innerText = `Release date: ${movieObj.release_date}`
        producer.innerText = `Produced by: ${producerName}`
        link.innerText = 'Home Page'
        link.href = movieObj.homepage
        like.classList.add('like')
        like.innerText = 'Like! '
        likeGlyph.classList.add('like-glyph')
        likeGlyph.innerText = Array('\u2661')
        like.appendChild(likeGlyph)
        descPart.append(h2, overview, imdbId, releaseDate, producer, link, like)
        movie.append(imgPart, descPart)
        movieDetail.appendChild(movie)
        likeGlyph.addEventListener('click',(e)=>{
            clickLikeGlyph(e)
        })
    }

    function clickLikeGlyph(e){
        const commentForm = document.getElementById('comment-movie')
        if(e.target.innerText !== FULL_HEART){
            const newObj = {
                'title': e.target.parentNode.parentNode.querySelector('h2').innerText.slice(7), 
                'overview': e.target.parentNode.parentNode.querySelector('p').innerText.slice(10),
                'src': e.target.parentNode.parentNode.parentNode.querySelector('img').src
            }
            e.target.classList.add('activated-heart')
            e.target.innerText = FULL_HEART
            showCommentForm(e)
            addComment(newObj)
            } else {
            e.target.classList.remove('activated-heart')
            e.target.innerText = EMPTY_HEART
            commentForm.remove()
            }
    }

    function addComment(movieObj){
        const commentForm = document.getElementById('comment-movie')
        commentForm.addEventListener('submit',(e)=>{
            e.preventDefault()
            movieObj.rating = commentForm.elements['rating'].value,
            movieObj.comment = commentForm.elements['comment'].value
            postLikedMovie(movieObj)
            commentForm.reset()
            commentForm.remove()
        })
    }

    function showCommentForm(e){
        const formContainer = document.createElement('form')
        formContainer.id = 'comment-movie'
        formContainer.style.display = 'flex'
        formContainer.innerHTML = `
                                    <label for="rating">Rating: </label>
                                    <input type="number" name="rating" id="rating" placeholder='can be skipped to save'/>
                                    <label for="new-comment">Comment: </label>
                                    <textarea name="comment" id="comment" placeholder='can be skipped to save'></textarea>
                                    <input type="submit" value="Save"/>
                                  `
        e.target.parentNode.parentNode.appendChild(formContainer)               
    }

    function postLikedMovie(movieObj){
        fetch('http://localhost:3000/movies',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(movieObj)
        })
        .then(res=>res.json())
        .then(data=>{
            createMovieList(data)
        })
    }

    function fetchCollection(){
        fetch('http://localhost:3000/movies')
        .then(res=>res.json())
        .then(data=>{
            Array.from(data).forEach(movie=>{
                createMovieList(movie)
            })
        })
    }

    function createMovieList(movieObj){
        const img = document.createElement('img')
        img.src = movieObj.src
        img.id = movieObj.id
        list.append(img)
        Array.from(collectedMovies).forEach((movie)=>{
            movie.addEventListener('click',(e)=>{
                displayCollectedMovieDetail(e)
            })
        })
    }

    function displayCollectedMovieDetail(e){
        fetch(`http://localhost:3000/movies/${e.target.id}`)
        .then(res=>res.json())
        .then(data=>{
            const movie = document.createElement('div')
            movieDetail.innerHTML=''
            movie.innerHTML =  `<div class="detail-parts">
                                    <img class="detail-image" src=${data.src} alt="Movie Poster"/>
                                </div>
                                <div class="detail-parts detail-description">
                                    <h2>Title: ${data.title}</h2>
                                    <p>Overview: ${data.overview}</p>
                                    <p id='new-rating'>Rating: ${data.rating}</p>
                                    <p id='new-comment'>Comment: ${data.comment}</p>
                                    <button id='edit' class=${e.target.id}>Edit</button>
                                    <button id='delete' class=${e.target.id}>Delete</button>
                                </div>
                                `
            movieDetail.appendChild(movie)
            controlBtn.style.display = 'none'
            updateComment()
            deleteMovie()
        })
    }

    function updateComment(){
        const editBtn = document.getElementById('edit')
        const ratingInput = document.createElement('input')
        const commentInput = document.createElement('input')
        const newRating = document.getElementById('new-rating')
        const newComment = document.getElementById('new-comment')
        ratingInput.placeholder='Please update rating'
        commentInput.placeholder='Please update comment'
        editBtn.addEventListener('click',(e)=>{
            editBtn.innerText = 'Save'
            newRating.appendChild(ratingInput)
            newComment.appendChild(commentInput)
            editBtn.addEventListener('click', (e)=>{
                postUpdatedComment({
                    "rating": ratingInput.value,
                    "comment": commentInput.value,
                    "id": parseInt(e.target.className)
                })
                ratingInput.remove()
                commentInput.remove()
                newRating.innerText = `Rating: ${ratingInput.value}`
                newComment.innerText = `Comment: ${commentInput.value}`
            })
        })
    }

    function deleteMovie(){
        const deleteBtn = document.getElementById('delete')
        deleteBtn.addEventListener('click',(e)=>{
            deleteFromServer({
                "id": parseInt(e.target.className)
            })
        })
    }

    function postUpdatedComment(movieObj){
        fetch(`http://localhost:3000/movies/${movieObj.id}`,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(movieObj)
        })
    }

    function deleteFromServer(movieObj){
        fetch(`http://localhost:3000/movies/${movieObj.id}`,{
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(movieObj)
        })
        .then(res=>res.json())
        .then(data=>{
            list.innerHTML=''
            movieDetail.innerHTML=''
            fetchCollection()
        })
    }
})

