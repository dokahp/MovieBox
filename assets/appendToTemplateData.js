import genres from "./genres.js"
import genresTV from "./genresTV.js"
const appendTemplateData = (data, type, clearCards = true) => {
    let parentBlock = document.querySelector(`.${type}`)
    if (clearCards) {
        parentBlock.querySelectorAll('.single-card-wrapper').forEach(el => parentBlock.removeChild(el))
    }
    let template = document.querySelector(`#${type}`)
    if (type == 'people') {
        for (let i = 0; i < data.length; i++) {
            const item = template.content.cloneNode(true)
            let knownFor = item.querySelector('.known-for')
            if (data[i].profile_path) {
                item.querySelector('.card-poster').src = `https://image.tmdb.org/t/p/w500/${data[i].profile_path}`
            } else {
                item.querySelector('.card-poster').src = "./assets/img/svg/no-image.svg"
            }
            item.querySelector('.card-title').textContent = data[i].name
            item.querySelector('.card-rating').textContent = data[i].popularity
            let knownForList = data[i].known_for.map(el => el.name? el.name: el.title)
            for (let i = 0; i < knownForList.length; i++) {
                let liElem = document.createElement('li')
                liElem.textContent = knownForList[i]
                knownFor.insertAdjacentElement('beforeend', liElem)
            }
            item.querySelector('.single-card-wrapper').href = `./people.html?id=${data[i].id}`
            parentBlock.append(item)
        }
    } else {
        for (let i = 0; i < data.length; i++) {
            let listGenresNames = []
            let genresItemId = data[i].genre_ids
            const item = template.content.cloneNode(true)
            if (data[i].poster_path) {
                item.querySelector('.card-poster').src = `https://image.tmdb.org/t/p/w500/${data[i].poster_path}`
            } else {
                item.querySelector('.card-poster').src = "./assets/img/svg/no-image.svg"
            }
            if (type == 'movie') {
                item.querySelector('.card-date').textContent = data[i].release_date? data[i].release_date.slice(0, 4): ''
                item.querySelector('.card-title').textContent = data[i].title
                item.querySelector('.single-card-wrapper').href = `./media.html?id=${data[i].id}&type=movie`
                for (let i = 0; i < genres.genres.length; i++ ) {
                    if (genresItemId.includes(genres.genres[i].id)) {
                        listGenresNames.push(genres.genres[i].name)
                    }
                }
            } else {
                item.querySelector('.card-date').textContent = data[i].first_air_date.slice(0, 4)
                item.querySelector('.card-title').textContent = data[i].name
                item.querySelector('.single-card-wrapper').href = `./media.html?id=${data[i].id}&type=tv`
                for (let i = 0; i < genresTV.genres.length; i++ ){
                    if (genresItemId.includes(genresTV.genres[i].id)) {
                        listGenresNames.push(genresTV.genres[i].name)
                    }
                }
            }
            item.querySelector('.card-rating').textContent = `${data[i].vote_average * 10} / 100`
            item.querySelector('.overview').textContent = data[i].overview
            item.querySelector('.card-genres').textContent = listGenresNames.join(', ')
            parentBlock.append(item)
        }
    }
}

export default appendTemplateData