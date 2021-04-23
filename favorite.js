const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const movies = JSON.parse(localStorage.getItem('favoriteMovies')) // NOTE: 改

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

function renderMovieList(data) {
  let rawHTML = ''

  data.forEach(item => {
    rawHTML += `
      <div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img
              src="${POSTER_URL + item.image}"
              class="card-img-top"
              alt="Movie Poster"
            />
            <!-- Card Body -->
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <!-- Card Footer -->
            <div class="card-footer">
              <button
                type="button"
                class="btn btn-primary btn-show-movie"
                data-toggle="modal"
                data-target="#movie-modal"
                data-id="${item.id}"
              >
                More
              </button>
              <button
                type="button"
                class="btn btn-danger btn-remove-favorite"
                data-id="${item.id}"
                >
                  X
              </button>
            </div>
          </div>
        </div>
      </div>
    `
  })

  dataPanel.innerHTML = rawHTML
}

/* 顯示電影詳細資訊於 modal 上 */
function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')

  axios.get(INDEX_URL + id).then(response => {
    const data = response.data.results
    modalTitle.innerText = data.title
    modalDate.innerText = 'Release date: ' + data.release_date
    modalDescription.innerText = data.description
    modalImage.innerHTML = `
      <img
        src="${POSTER_URL + data.image}"
        alt="movie-poster"
        class="img-fluid"
      />
    `
  })
}

function removeFromFavorite(id) {
  const movieIndex = movies.findIndex(movie => movie.id === id) // 找出想移除之電影的 id

  if (!movies) return // 如果收藏清單內沒有任何電影的話，直接結束此函式

  if (movieIndex === -1) return // 如果要刪除的電影清單不存在於 local storage，則直接 return 結束這個函式

  movies.splice(movieIndex, 1) // 刪掉要移除最愛的電影清單
  localStorage.setItem('favoriteMovies', JSON.stringify(movies))

  renderMovieList(movies)
}

dataPanel.addEventListener('click', () => {
  if (event.target.matches('.btn-show-movie')) {
    // console.log(event.target.dataset.id)
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
})

renderMovieList(movies)
