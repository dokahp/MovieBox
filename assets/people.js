import i18n from './i18n.js';

let langSwitch = document.querySelector('.lang-button')
let lang = localStorage.getItem('language') || 'en'
let peopleId = window.location.search.substring(4)
const API_KEY = '57205cb960b17f17a00da319a5e855e1'
let peopleData


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

const setPeopleData = (data) => {
    let parentBlock = document.querySelector('.people-page-cards-wrapper')
    if (data.profile_path) {
        document.querySelector('.people-profile_path').src = `https://image.tmdb.org/t/p/w500${data.profile_path}`
    } else {
        document.querySelector('.people-profile_path').src = './assets/img/svg/no-image.svg'
    }
    document.querySelector('.people-name-header').textContent = data.name
    if (data.biography) {
        document.querySelector('.biography-content').textContent = data.biography
    } else {
        document.querySelector('.biography-content').textContent = i18n[`${lang}`]['biography-error']
    }
    let casts = data.combined_credits.cast.sort((a, b) => b.popularity - a.popularity)
    let template = document.querySelector('#people-media')
    for (let i = 0; i < casts.length; i++) {
        const item = template.content.cloneNode(true)
        let poster = item.querySelector('.people-poster-media').src = `https://image.tmdb.org/t/p/w500${casts[i].poster_path}`
        console.log(poster)
        if (!poster.includes('null')) {
            if (casts[i].media_type == 'movie') {
                item.querySelector('.people-media-link').href = `./media.html?id=${casts[i].id}&type=movie`
                item.querySelector('.people-media-card-link').href = `./media.html?id=${casts[i].id}&type=movie`
            } else {
                item.querySelector('.people-media-link').href = `./media.html?id=${casts[i].id}&type=tv`
                item.querySelector('.people-media-card-link').href = `./media.html?id=${casts[i].id}&type=tv`
            }
            item.querySelector('.people-media-link').textContent = casts[i].title || casts[i].name
            parentBlock.append(item)
        }
    }
    // INSERTING CASTS
    insertCasts(data)
}

const insertCasts = (data, remove = false, type = 'all') => {
    let parentBlock = document.querySelector('.cast-ul')
    if (remove) {parentBlock.querySelectorAll('li').forEach(el => parentBlock.removeChild(el))}
    let template = document.querySelector('#media-date-list')
    let castSerials = data.combined_credits.cast.filter(el => el.media_type == 'tv' && el.first_air_date)
    .sort((a, b) => new Date(b.first_air_date).getFullYear() - new Date(a.first_air_date).getFullYear())
    let castMovie = data.combined_credits.cast.filter(el => el.media_type == 'movie' && el.release_date)
    .sort((a, b) => new Date(b.release_date).getFullYear() - new Date(a.release_date).getFullYear())
    let casts
    if (type == 'all') {
        casts = [...castMovie, ...castSerials]
    } else if (type == 'movie') {
        casts = [...castMovie]
    } else if (type == 'tv') {
        casts = [...castSerials]
    }
    document.querySelector('.movie-count').textContent = i18n[lang]['movie-count'] + castMovie.length
    document.querySelector('.tv-count').textContent = i18n[lang]['tv-count'] + castSerials.length
    for (let i = 0; i < casts.length; i++) {
        let castData = template.content.cloneNode(true)
        let castDate = castData.querySelector('.cast-year')
        let castLink = castData.querySelector('.cast-link')
        casts[i].release_date? castDate.textContent = casts[i].release_date.slice(0, 4):  castDate.textContent = casts[i].first_air_date.slice(0, 4)  || '-'
        casts[i].title? castLink.textContent = casts[i].title: castLink.textContent = casts[i].name
        casts[i].media_type == 'movie'? castLink.href = `./media.html?id=${casts[i].id}&type=movie`: castLink.href = `./media.html?id=${casts[i].id}&type=tv`
        castData.querySelector('.as').textContent = i18n[lang]['as']
        castData.querySelector('.character').textContent = casts[i].character
        parentBlock.append(castData)
    }
}
let switches = document.querySelector('.casts-count-wrapper').querySelectorAll('span')
switches.forEach(el => el.addEventListener('click', (e) => {
    switches.forEach(el => el.classList.remove('active'))
    e.target.classList.add('active')
    insertCasts(peopleData, true, e.target.dataset.i18.split('-')[0])
}))

async function getPeopleData () {
    const response = await fetch(`https://api.themoviedb.org/3/person/${peopleId}?api_key=${API_KEY}&language=${lang}&append_to_response=combined_credits`)
    const data = await response.json()
    peopleData = data
    setPeopleData(data)
}

getPeopleData()




