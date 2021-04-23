const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const MOVIES_PER_PAGE = 12
const movies = [] // 所有電影清單
const numOfFavorite = document.querySelector('#num-of-favorite')
const favoriteLists = JSON.parse(localStorage.getItem('favoriteMovies')) || []
let moviesMap = {}
let filteredMovies = [] // 搜尋時符合關鍵字的電影清單
let mode = 'grid' // default mode
let onPage = 0

const dataPanel = document.querySelector('#data-panel')
const displayCard = document.querySelector('#display-card')
const displayList = document.querySelector('#display-list')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')
const displayMode = document.querySelector('#display-mode')

/* Render Movie (Grid) */
function renderMovieGrid(data) {
  console.log('card')
  let rawHTML = ''

  data.forEach(item => {
    rawHTML += `
      <div class="col-lg-3 col-sm-6">
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
                class="btn btn-info btn-add-favorite favorite-button"
                data-id="${item.id}"
                >
                  <i class="${onClick(item.id)}" data-id="${item.id}"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `
  })

  displayCard.innerHTML = rawHTML
}

/* Render Movie (List) */
function renderMovieList(data) {
  console.log('list')
  let rawHTML = ''

  data.forEach(item => {
    rawHTML += `
      <li class="list-group-item d-flex justify-content-between align-items-center">
        ${item.title}
        <div>
          <button
            type="button"
            class="btn btn-primary btn-show-movie"
            data-toggle="modal"
            data-target="#movie-modal"
            data-id="${item.id}"
          >
            More
          </button>
          <button type="button" class="btn btn-info btn-add-favorite favorite-button" data-id="${
            item.id
          }">
            <i class="${onClick(item.id)}" data-id="${item.id}"></i>
          </button>
        </div>
      </li>
    `
  })

  displayList.innerHTML = rawHTML
}

/* Distinguish Mode */
function renderMovie(page) {
  if (mode === 'grid') {
    // grid mode
    displayCard.style.display = 'flex'
    displayList.style.display = 'none'
    renderMovieGrid(getMovieByPage(page))
  } else if (mode === 'list') {
    // list mode
    displayCard.style.display = 'none'
    displayList.style.display = 'flex'
    renderMovieList(getMovieByPage(page))
    console.log(onPage)
  }
}

/* Show Info on Modal */
function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')

  modalTitle.innerText = moviesMap[id].title
  modalDate.innerText = 'Release date: ' + moviesMap[id].release_date
  modalDescription.innerText = moviesMap[id].description
  modalImage.innerHTML = `
      <img
        src="${POSTER_URL + moviesMap[id].image}"
        alt="movie-poster"
        class="img-fluid"
      />
    `
}

/* Add to Favorite */
function addToFavorite(id) {
  const movie = movies.find(movie => movie.id === id)

  favoriteLists.push(movie)
  numOfFavorite.innerText = favoriteLists.length
  localStorage.setItem('favoriteMovies', JSON.stringify(favoriteLists))
}

/* Remove from Favorite */
function removeFromFavorite(id) {
  const movieIndex = favoriteLists.findIndex(movie => movie.id === id)

  if (!favoriteLists) return
  if (movieIndex === -1) return

  favoriteLists.splice(movieIndex, 1)
  numOfFavorite.innerText = favoriteLists.length
  localStorage.setItem('favoriteMovies', JSON.stringify(favoriteLists))
}

/* Render Movies by Specified Page */
function getMovieByPage(page) {
  const data = filteredMovies.length ? filteredMovies : movies
  const startIndex = (page - 1) * MOVIES_PER_PAGE

  activePage(page)
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}

/* Render Pagination */
function renderPaginator(amount) {
  const numberOfPage = Math.ceil(amount / MOVIES_PER_PAGE)
  let rawHTML = ''

  for (let page = 1; page <= numberOfPage; page++) {
    rawHTML += `
      <li class="page-item" data-page="${page}"><a class="page-link" href="#" data-page="${page}">${page}</a></li>
    `
  }

  // 只有一頁的話就不顯示頁數按鈕
  if (numberOfPage === 1) {
    paginator.innerHTML = ''
  } else {
    paginator.innerHTML = rawHTML
  }
}

/* Toggle Heart */
function toggleHeart(target) {
  if (target.matches('.far')) {
    target.className = 'fas fa-heart heart'
    addToFavorite(Number(target.dataset.id))
  } else if (target.matches('.fas')) {
    target.className = 'far fa-heart heart'
    removeFromFavorite(Number(target.dataset.id))
  }
}

/* 是否已加入最愛清單，重整畫面才不會出錯 */
function onClick(id) {
  if (favoriteLists.some(user => user.id === id)) {
    return 'fas fa-heart heart'
  } else {
    return 'far fa-heart heart'
  }
}

/* Active Page */
function activePage(targetPage) {
  const pageItems = document.querySelectorAll('.page-item')
  // console.log('更改前：' + onPage)
  if (targetPage === onPage) return

  for (const page of pageItems) {
    if (Number(page.dataset.page) === onPage) {
      // 當前頁面的 active 關掉
      page.classList.toggle('active')
      // console.log('關掉：' + page.dataset.page)
    } else if (Number(page.dataset.page) === targetPage) {
      // 點選的頁面 active 打開
      page.classList.toggle('active')
      // console.log('打開：' + page.dataset.page)
    }
  }
  onPage = targetPage
  // console.log('當頁：' + onPage)
}

dataPanel.addEventListener('click', () => {
  const target = event.target
  if (target.matches('.btn-show-movie')) {
    // console.log(event.target.dataset.id)
    showMovieModal(Number(target.dataset.id))
  } else if (target.matches('.favorite-button')) {
    toggleHeart(target.firstElementChild)
    console.log(target.firstElementChild)
  }
})

/* Search Listener */
searchForm.addEventListener('submit', () => {
  event.preventDefault() // 避免瀏覽器預設行為(這裡為刷新頁面)
  onPage = 0

  const keyword = searchInput.value.trim().toLowerCase()

  filteredMovies = movies.filter(movie => movie.title.toLowerCase().includes(keyword))

  // 沒有找到符合關鍵字的的電影，維持原畫面
  if (filteredMovies.length === 0) return alert(`您輸入的關鍵字：${keyword}\n沒有符合條件的電影`)

  renderPaginator(filteredMovies.length)
  renderMovie(1)
})

/* Pagination Listener */
paginator.addEventListener('click', () => {
  const target = event.target

  if (target.tagName !== 'A') return
  renderMovie(Number(target.dataset.page))
})

/* Mode Listener */
displayMode.addEventListener('click', () => {
  const target = event.target
  const gridMode = document.querySelector('#grid-mode')
  const listMode = document.querySelector('#list-mode')

  if (target.matches('#grid-mode')) {
    // render grid mode
    if (mode === 'grid') return
    mode = 'grid'
    gridMode.classList.toggle('gray')
    listMode.classList.toggle('gray')
    renderMovie(onPage)
  } else if (target.matches('#list-mode')) {
    // render list mode
    if (mode === 'list') return
    mode = 'list'
    gridMode.classList.toggle('gray')
    listMode.classList.toggle('gray')
    renderMovie(onPage)
  }
})

/* Main */
axios
  .get(INDEX_URL)
  .then(response => {
    movies.push(...response.data.results)
    movies.forEach(movie => (moviesMap[movie.id] = movie))
    const gridMode = document.querySelector('#grid-mode').classList.toggle('gray')

    renderPaginator(movies.length)
    renderMovieGrid(getMovieByPage(1)) // default mode = Grid
    numOfFavorite.innerText = favoriteLists.length
  })
  .catch(error => console.log(error))
