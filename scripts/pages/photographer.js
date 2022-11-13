//Mettre le code JavaScript lié à la page photographer.html

const searchParams = new URLSearchParams(location.search)
let photographerId = searchParams.get('id')
let photographer
let medias
const media_modal = document.getElementById('media_modal')
const contact_modal = document.getElementById('contact_modal')
const photograph_medias = document.getElementById('photograph_medias')
const orderSelect = document.getElementById('orderSelect')
const likes = []

// Fetch
async function getPhotographer() {
    try {
        const response = await fetch('./data/photographers.json')
        const data = await response.json()
        photographer = data.photographers.find((photographer) => photographer.id == photographerId)
        medias = data.media.filter((media) => media.photographerId == photographerId)
        photograph_medias.style.gridTemplateRows = 'repeat(' + Math.ceil(medias.length / 3) + ', 400px)'
        photographerHeader(photographer)
        likesPrice(medias, photographer.price)
        orderMedias(photographer)
        orderSelection.onchange = ({target: {value}}) => orderMedias(photographer, value)
        addEventListener('keydown', (e) => {
            if (media_modal.style.display && media_modal.style.display !== 'none') {
				if (e.code === 'ArrowLeft') {
					return changeMedia('left')
				}
				if (e.code === 'ArrowRight') {
					return changeMedia('right')
				}
				if (e.code === 'Escape') {
					return closeMediaModal()
				}
			}
            if (contact_modal.style.display && contact_modal.style.display !== 'none') {
				if (e.code === 'Escape') {
					contact_modal.style.display = 'none'
				}
			}
        })
        // orderSelection.
        const contactTitle = document.querySelector('#contact_modal h2')
        contactTitle.textContent += ' '  +  photographer.name
    } catch (error) {
        console.error(error)
    }
}
// Fin de fetch

// photographer infos
async function photographerHeader(photographer) {
    const {name, city, country, tagline, price, portrait } = photographer
    const namePhotograph = document.querySelector('.photograph-infos > h1')
    const cityPhotograph = document.querySelector('.photograph-infos > p:nth-child(2)')
    const taglinePhotograph = document.querySelector('.photograph-infos > p:nth-child(3)')

    namePhotograph.innerHTML = name
    cityPhotograph.innerHTML = city + `, ` + country
    taglinePhotograph.innerHTML = tagline

    const header = document.querySelector('.photograph-header')
    const image = document.createElement('img')
    image.src = `./assets/photographers/${portrait}`
    image.alt = photographer.name
    header.appendChild(image)
}
// fin photographer infos


// likes and price
function likesPrice(medias, price) {
    const element = document.querySelector('.photograph_likeandprice')

    element.children[0].textContent = medias.reduce((sum, media) => sum + media.likes, 0) + ' ❤️'
    element.children[1].textContent = price + ' € / jour'
}
// fin de likes and price

// display Medias
function displayMedias(photographer,medias) {
    const mediasSection = document.getElementById('photograph_medias')
    mediasSection.innerHTML = ""

    for (const media of medias) {
        const article = document.createElement('article')
        const link = document.createElement('a')
        const mediaType = media.video ? document.createElement('video') : document.createElement('img')
        const divInfos = document.createElement('div')
        const spanName = document.createElement('span')
        const spanLike = document.createElement('span')
        const btnLike = document.createElement('button')
        btnLike.setAttribute('aria-label', "Bouton j'aime")

        link.href = "#"
        mediaType.src = `./assets/images/${photographer.name}/${media.video ?? media.image}`
        mediaType.alt = media.title

        spanName.textContent = media.title
        btnLike.textContent = media.likes + ' ❤️'
        btnLike.classList.add('like')
        btnLike.onclick = ({target}) => {
            if (likes.includes(media.id)) {
                return console.log('Validation like')
            }
            const totalLikesElement = document.querySelector('.photograph_likeandprice > span:first-child')

            totalLikesElement.textContent = parseInt(totalLikesElement.textContent) + 1 + ' ❤️'
            target.textContent = parseInt(target.textContent) + 1 + ' ❤️'
            likes.push(media.id)
        }

// Display modal
        link.onclick = (event) => {
            event.preventDefault()
            if (event.target.classList.contains('like')) return
			media_modal.children[media_modal.children.length - 1].appendChild(mediaType.cloneNode())
			media_modal.children[media_modal.children.length - 1].children[0].controls = true
			media_modal.children[media_modal.children.length - 1].appendChild(spanName.cloneNode(true))
			media_modal.style.display = 'inherit'
			document.body.style.overflow = 'hidden'
        }
// Fin display modal

        spanLike.appendChild(btnLike)
        link.appendChild(article)
        article.appendChild(mediaType)
        article.appendChild(divInfos)
        divInfos.appendChild(spanName)
        divInfos.appendChild(spanLike)
        mediasSection.appendChild(link)
    }
}

// orderBy
function orderMedias(photographer, orderBy = 'pop') {
    switch(orderBy) {
        case 'pop' : {
            medias.sort((a,b) => b.likes - a.likes)
            break
        }
        case 'date' : {
            medias.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            break
        }
        case 'title' : {
            medias.sort((a,b) => a.title.localeCompare(b.title))
            break
        }
    }
    displayMedias(photographer, medias)
}
// fin orderBy
//fin display Medias

// Close modale
function closeMediaModal() {
    media_modal.children[media_modal.children.length - 1].innerHTML = ''
    media_modal.style.display = 'none'
    document.body.style.overflow = 'auto'
}
// Fin close modal

getPhotographer()