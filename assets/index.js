import i18n from './i18n.js'
import appendTemplateData from "./appendToTemplateData.js"

const API_KEY = '57205cb960b17f17a00da319a5e855e1'
let lang = localStorage.getItem('language') || 'en'
let sliderBackgroundImage = document.querySelector('.slider')
let currentSlide = 0
let popularMovies
let popularTvShows
let popularPeople
let topRatedMovies
let sliderData = []
let sliderTitle = document.querySelector('.slider-title')
let sliderRating = document.querySelector('.slider-rating')
let sliderOverview = document.querySelector('.slider-overview')
let sliderElementIndicator = document.querySelectorAll('.slider-element')
let sliderPrevBtn = document.querySelector('.arrow-up')
let sliderNextBtn = document.querySelector('.arrow-down')
let sliderTrailerBtn = document.querySelector('.slider-trailer')

let searchInput = document.querySelector('.search')
let searchDelete = document.querySelector('.delete-search')
let searchSubmit = document.querySelector('.search-submit')
let searchResultsDisplays = false
let noData = document.querySelector('.no-data')

let moviesWrapper = document.querySelector('.movie-cards-wrapper')
let moviesHeader = document.querySelector('.movie-header')
let tvWrapper = document.querySelector('.tv-cards-wrapper')
let tvHeader = document.querySelector('.tv-header')
let personWrapper = document.querySelector('.people-cards-wrapper')
let personHeader = document.querySelector('.people-header')

let movieSwitchWrapper = document.querySelector('.data-switch-wrapper')
let switchTopRatedMovie = document.querySelector('.top-rated')
let switchPopularMovie = document.querySelector('.popular')
let seeMoreMovie = document.querySelector('.see-more')

let langSwitch = document.querySelector('.lang-button')


// START OF SCROLL BUTTON
let scrollTopButton = document.querySelector(".return-top");
window.onscroll = () => {onScroll()};
const onScroll = () => {
  if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
    scrollTopButton.style.display = "flex";
  } else {
    scrollTopButton.style.display = "none";
  }
}
const returnTop = () => {
  document.body.scrollTop = 0; 
  document.documentElement.scrollTop = 0;
}
scrollTopButton.addEventListener('click', returnTop)
// END OF SCROLL BUTTON
// START OF LANGUAGE SWITCH
window.addEventListener('load', getLocalStorage)

langSwitch.addEventListener('click', () => {
    if (localStorage.getItem('language')) {
        localStorage.getItem('language') == 'en'? localStorage.setItem('language', 'ru'): localStorage.setItem('language', 'en')
    } else {
        localStorage.setItem('language', 'ru')
    }
    lang = localStorage.getItem('language')
    langSwitch.src = `./assets/img/svg/${lang}.svg`
    window.location.reload()
})

function getLocalStorage() {
    if(!localStorage.getItem('language')) {
        localStorage.setItem('language', 'en')
        lang = localStorage.getItem('language')
    }
    lang = localStorage.getItem('language');
    langSwitch.src = `./assets/img/svg/${lang}.svg`
    translate(lang)
}
const translate = (lang) => {
    let translateNodeList = document.querySelectorAll('[data-i18]')
    translateNodeList.forEach(el => {
        if (el.placeholder) {
            el.placeholder = i18n[`${lang}`][`${el.dataset.i18}`]
        } else {
            el.textContent = i18n[`${lang}`][`${el.dataset.i18}`]
        }
    })
}
// END OF LANGUAGE SWITCH

const preloadSliderImages = (data) => {
    for (let i = 0; i < 10; i++) {
        const img = new Image()
        img.src = `https://image.tmdb.org/t/p/original${data[i].backdrop_path}`
    }
}
const getSliderData = (data) => {
    sliderData = data.results.slice(0, 10)
    preloadSliderImages(sliderData)
    changeSliderData(sliderData, 0)
}

const changeSliderData = (data, i) => {
    sliderBackgroundImage.style.setProperty('background-image', `url("https://image.tmdb.org/t/p/original${data[i].backdrop_path}")`)
    sliderTitle.textContent = data[i].title 
    sliderRating.textContent = `${data[i].vote_average * 10} / 100`
    sliderOverview.textContent = data[i].overview
    currentSlide = i
    sliderElementIndicator.forEach(el => el.classList.remove('active'))
    document.querySelector(`[data-slide-number="${i}"]`).classList.add('active')
    if (data[i].trailerList) {
        sliderTrailerBtn.style.setProperty('display', 'flex')
        sliderTrailerBtn.href = `https://youtu.be/${data[i].trailerList[0].key}`
    } else {
        sliderTrailerBtn.style.setProperty('display', 'none')
    }
}

const sliderInterval = setInterval(() => {
    currentSlide == 9? currentSlide = 0: currentSlide++
    changeSliderData(sliderData, currentSlide)
}, 10000)

// SLIDER BUTTONS
sliderPrevBtn.addEventListener('click', () => {
    currentSlide? --currentSlide: currentSlide = 9
    changeSliderData(sliderData, currentSlide)
})
sliderNextBtn.addEventListener('click', () => {
    currentSlide == 9? currentSlide = 0: ++currentSlide
    changeSliderData(sliderData, currentSlide)
})
sliderElementIndicator.forEach(el => el.addEventListener('click', (e) => {
    changeSliderData(sliderData, e.target.dataset.slideNumber) 
}))

// END
// SEARCH
searchInput.addEventListener('input', () => {
    if (searchInput.value) {
        searchInput.classList.add('not-empty')
        searchDelete.classList.add('active')
    } else {
        searchInput.classList.remove('not-empty')
        searchDelete.classList.remove('active')
        if (searchResultsDisplays) {
            returnToDefault()
        }

    }
})
searchInput.addEventListener('keydown', (e) => {
    if (e.key == 'Enter' && searchInput.value) {
        noData.style.setProperty('display', 'none')
        getSearchData(searchInput.value)
    }
})
searchSubmit.addEventListener('click', () => {if (searchInput.value) {
    noData.style.setProperty('display', 'none')
    getSearchData(searchInput.value)

}})

searchDelete.addEventListener('click', () => {
    searchInput.value = ''
    searchInput.classList.remove('not-empty')
    searchDelete.classList.remove('active')
    if (searchResultsDisplays) {
        returnToDefault()
    }
})
// END OF SEARCH
const returnToDefault = () => {
    displaysCardsWrappers()
    moviesHeader.textContent = i18n[lang]['popular-movie']
    tvHeader.textContent = i18n[lang]['popular-tv']
    personHeader.textContent = i18n[lang]['popular-people']
    movieSwitchWrapper.style.setProperty('display', 'initial')
    appendTemplateData(popularMovies, 'movie')
    appendTemplateData(popularTvShows, 'tv')
    appendTemplateData(popularPeople, 'people')
    searchResultsDisplays = false
    noData.style.setProperty('display', 'none')
}

async function getPopularMovies() {
    const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=${lang}&page=1`)
    const data = await response.json()
    popularMovies = data.results
    getSliderData(data)
    appendTemplateData(data.results, 'movie')
    for (let i = 0; i < 10; i++) {
        getListOfTrailers(popularMovies[i].id, i)
    }
}

getPopularMovies()
async function getListOfTrailers(movieId, i) {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`)
    const data = await response.json()
    sliderData[i].trailerList = data.results
}
async function getPopularTVShows() {
    const response = await fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=${lang}&page=1`)
    const data = await response.json()
    popularTvShows = data.results
    appendTemplateData(data.results, 'tv')
}
getPopularTVShows()

const displaysCardsWrappers = () => {
    moviesWrapper.style.setProperty('display', 'block')
    tvWrapper.style.setProperty('display', 'block')
    personWrapper.style.setProperty('display', 'block')
}

const setSearchData = (data) => {
    searchResultsDisplays = true
    displaysCardsWrappers()
    let searchMovieList = data.filter(el => el.media_type == 'movie')
    let searchTVList = data.filter(el => el.media_type == 'tv')
    let searchPeopleList = data.filter(el => el.media_type == 'person')
    if (searchMovieList.length || searchTVList.length || searchPeopleList.length) {
        moviesHeader.textContent = lang == 'en'? 'Movie': 'Фильмы'
        tvHeader.textContent = lang == 'en'? 'TV Show': 'Сериалы'
        personHeader.textContent = lang == 'en'? 'People': 'Люди'
        movieSwitchWrapper.style.setProperty('display', 'none')
        searchMovieList.length? appendTemplateData(searchMovieList, 'movie'): moviesWrapper.style.setProperty('display', 'none')
        searchTVList.length? appendTemplateData(searchTVList, 'tv'): tvWrapper.style.setProperty('display', 'none')
        searchPeopleList.length? appendTemplateData(searchPeopleList, 'people'): personWrapper.style.setProperty('display', 'none')
    } else {
        moviesWrapper.style.setProperty('display', 'none')
        tvWrapper.style.setProperty('display', 'none')
        personWrapper.style.setProperty('display', 'none')
        noData.style.setProperty('display', 'block')
    }
    document.querySelector('.only-scroll').scrollIntoView()
}

async function getSearchData(searchString) {
    const response = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&language=${lang}&query=${searchString}&page=1&include_adult=false`)
    const data = await response.json()
    setSearchData(data.results)
}

async function getPopularPeople() {
    const response = await fetch(`https://api.themoviedb.org/3/person/popular?api_key=${API_KEY}&language=${lang}&page=1`)
    const data = await response.json()
    popularPeople = data.results
    appendTemplateData(data.results, 'people')
}

getPopularPeople()

async function getTopRatedMovies() {
    const response = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=${lang}&page=1`)
    const data = await response.json()
    topRatedMovies = data.results
    appendTemplateData(data.results, 'movie')
}
// MOVIE SWITCH
switchTopRatedMovie.addEventListener('click', () => {
    document.querySelector('.cards-header').textContent = i18n[lang]['top-rated-switch'] + ` ${lang == 'en'? 'Movie': 'Фильмы'}`
    document.querySelectorAll('.movie-switch').forEach(el => el.classList.remove('active'))
    switchTopRatedMovie.classList.add('active')
    topRatedMovies? appendTemplateData(topRatedMovies, 'movie'): getTopRatedMovies()
    seeMoreMovie.href = './seemore.html#movie-top-rated'
})
switchPopularMovie.addEventListener('click', () => {
    document.querySelector('.cards-header').textContent = i18n[lang]['popular-switch'] + ` ${lang == 'en'? 'Movie': 'Фильмы'}`
    document.querySelectorAll('.movie-switch').forEach(el => el.classList.remove('active'))
    switchPopularMovie.classList.add('active')
    popularMovies? appendTemplateData(popularMovies, 'movie'): getPopularMovies()
    seeMoreMovie.href = './seemore.html#movie-popular'
})
// END OF MOVIE SWITCH


console.log(`WELL DONE: 70 / 60
+ slider on main page (with directly and automaticaly switch)
+ search errors handled 
+ lang switch
+ main page
+ movie top rated / popular switch
+ see more page (with load more) for all pages(movie, tv, people)
+ Movie / TV / People details pages
+ People crew switch (All, Movie, TV)
+ responsive
+ without any libraries`)