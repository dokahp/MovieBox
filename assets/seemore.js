import i18n from './i18n.js';
import appendTemplateData from './appendToTemplateData.js';

let tv
let people
let langSwitch = document.querySelector('.lang-button')
let lang = localStorage.getItem('language') || 'en'
let loadMore = document.querySelector('.load-more')
const API_KEY = '57205cb960b17f17a00da319a5e855e1'
let cards = []
let popular = false



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

// LANG SWITCH 
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

async function getPopularMovies(page = 1) {
    const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=${lang}&page=${page}`)
    const data = await response.json()
    cards.push(...data.results)
    appendTemplateData(data.results, 'movie', false)
}
async function getTopRatedMovies(page = 1) {
    const response = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=${lang}&page=${page}`)
    const data = await response.json()
    cards.push(...data.results)
    appendTemplateData(data.results, 'movie', false)
}
async function getPopularTVShows(page = 1) {
    const response = await fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=${lang}&page=${page}`)
    const data = await response.json()
    cards.push(...data.results)
    appendTemplateData(data.results, 'tv' , false)
}
async function getPopularPeople(page = 1) {
    const response = await fetch(`https://api.themoviedb.org/3/person/popular?api_key=${API_KEY}&language=${lang}&page=${page}`)
    const data = await response.json()
    cards.push(...data.results)
    appendTemplateData(data.results, 'people', false)
}

loadMore.addEventListener('click', () => {
    if (tv) {getPopularTVShows((cards.length / 20) + 1)}
    if (people) {getPopularPeople((cards.length / 20) + 1)}
    popular? getPopularMovies((cards.length / 20) + 1): getTopRatedMovies((cards.length / 20) + 1)
})

if (window.location.href.split('#')[1] == 'movie-popular') {
    popular = true
    document.querySelector('.people-cards-wrapper').style.setProperty('display', 'none')
    document.querySelector('.tv-cards-wrapper').style.setProperty('display', 'none')
    getPopularMovies()
} else if (window.location.href.split('#')[1] == 'movie-top-rated') {
    document.querySelector('.people-cards-wrapper').style.setProperty('display', 'none')
    document.querySelector('.tv-cards-wrapper').style.setProperty('display', 'none')
    getTopRatedMovies()
    document.querySelector('.cards-header').dataset.i18 = 'top-rated'
} else if (window.location.href.split('#')[1] == 'tv') {
    document.querySelector('.people-cards-wrapper').style.setProperty('display', 'none')
    document.querySelector('.movie-cards-wrapper').style.setProperty('display', 'none')
    tv = true
    getPopularTVShows()
    document.querySelector('.cards-header').dataset.i18 = 'popular-tv'
} else {
    document.querySelector('.tv-cards-wrapper').style.setProperty('display', 'none')
    document.querySelector('.movie-cards-wrapper').style.setProperty('display', 'none')
    people = true
    getPopularPeople()
    document.querySelector('.cards-header').dataset.i18 = 'popular-people'
}