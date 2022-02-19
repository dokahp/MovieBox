import i18n from './i18n.js';

let langSwitch = document.querySelector('.lang-button')
let lang = localStorage.getItem('language') || 'en'
let mediaQuery = new URLSearchParams(window.location.search)
const API_KEY = '57205cb960b17f17a00da319a5e855e1'



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

const setRecCrewData = (data, templateName) => {
    let template = document.querySelector(`#${templateName}`)
    let parentBlock = template.parentElement
    for (let i = 0; i < data.length; i++) {
        const item = template.content.cloneNode(true)
        let poster
        if (templateName == 'people-media') {
            poster = item.querySelector('.people-poster-media').src = `https://image.tmdb.org/t/p/w500${data[i].profile_path}`
        } else {
            poster = item.querySelector('.people-poster-media').src = `https://image.tmdb.org/t/p/w500${data[i].poster_path}`
        }
        if (!poster.includes('null')) {
            if (templateName == 'people-media') {
                item.querySelector('.people-media-card-link').href = `./people.html?id=${data[i].id}`
                item.querySelector('.people-poster-media').src = `https://image.tmdb.org/t/p/w500${data[i].profile_path}`
                item.querySelector('.people-media-link').textContent = data[i].name
                item.querySelector('.people-media-link').href = `./people.html?id=${data[i].id}`
                item.querySelector('.media-character').textContent = data[i].character
            } else {
                item.querySelector('.people-media-card-link').href = `./media.html?id=${data[i].id}&type=${data[i].media_type}`
                item.querySelector('.people-poster-media').src = `https://image.tmdb.org/t/p/w500${data[i].poster_path}`
                item.querySelector('.people-media-link').textContent = data[i].title
                item.querySelector('.people-media-link').href = `./media.html?id=${data[i].id}&type=${data[i].media_type}`
            }
            parentBlock.append(item)
        }
    }
}

const timeFormatter = (time) => {
    return `${Math.floor(time / 60) > 0? Math.floor(time / 60) + 'h': ''} 
    ${time > 60? time - Math.floor(time / 60) * 60: time}m`
}


const setMediaData = (data) => {
    let time = timeFormatter(data.runtime)
    document.documentElement.style.setProperty('--backgroundURL', `url(https://image.tmdb.org/t/p/original/${data.backdrop_path})`)
    if (data.poster_path) {
        document.querySelector('.media-profile_path').src = `https://image.tmdb.org/t/p/w500${data.poster_path}`
    } else {
        document.querySelector('.media-profile_path').style.setProperty('display', 'none')
    }
    
    if (mediaQuery.get('type') == 'movie') {
        document.querySelector('.media-name-header').textContent = `${data.title} (${data.release_date.slice(0, 4)})`
    } else {
        document.querySelector('.media-name-header').textContent = `${data.name} (${data.first_air_date.slice(0, 4)})`
        time = ''
    }
    document.querySelector('.media-description').textContent = `${data.release_date || data.first_air_date} ⋅
    ${data.genres.map(el => el.name[0].toUpperCase() + el.name.slice(1)).join(', ')} ⋅ ${time}`
    
    document.querySelector('.media-overview').textContent = data.overview? data.overview: 'Unfortunately no data'
    document.querySelector('.tagline').textContent = data.tagline
    document.querySelector('.card-rating').textContent = `${data.vote_average * 10} / 100`
    setRecCrewData(data.credits.cast, 'people-media')
}

async function getRecomendations () {
    const response = await fetch(`https://api.themoviedb.org/3/${mediaQuery.get('type')}/${mediaQuery.get('id')}/recommendations?api_key=${API_KEY}&language=${lang}&page=1`)
    const data = await response.json()
    setRecCrewData(data.results, 'recommendations')
}

async function getMovieTVData () {
    const response = await fetch(`https://api.themoviedb.org/3/${mediaQuery.get('type')}/${mediaQuery.get('id')}?api_key=${API_KEY}&language=${lang}&append_to_response=credits`)
    const data = await response.json()
    getRecomendations()
    setMediaData(data)
}

getMovieTVData()