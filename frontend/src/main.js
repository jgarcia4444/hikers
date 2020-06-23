
const BASE_URL = 'http://localhost:3000'
const HIKES_URL = BASE_URL + '/hikes'


function fetchHikes() {
    fetch(HIKES_URL)
    .then(resp => resp.json())
    .then(json => {
        const hikes = parseJsonToHikes(json)
        appendHikesToHikesWrapper(hikes)
    })
}

function parseJsonToHikes(hikesJSON) {
    const hikes = []
    for (const hikeJSON of hikesJSON) {
        const sharer_name = hikeJSON['sharer_name']
        const hike_name = hikeJSON['hike_name']
        const city = hikeJSON['city']
        const state = hikeJSON['state']
        const duration = hikeJSON['duration']
        const img = hikeJSON['img']
        const likes = hikeJSON['likes']
        const newHike = new Hike(sharer_name, hike_name, img, city, state, duration, likes)
        hikes.push(newHike)
    }
    return hikes
}

function appendHikesToHikesWrapper(hikes) {
    const hikesWrapper = document.querySelector('#hikes-wrapper')
    hikes.forEach(hike => {
        const hikeNode = createHikeNode(hike)
        hikesWrapper.appendChild(hikeNode)
    });
}

function createHikeNode(hike) {
    const hikeNode = document.createElement('div')
    hikeNode.setAttribute('class', 'hike')

    const hikeNameNode = document.createElement('h3')
    hikeNameNode.innerText = hike.hike_name
    hikeNode.appendChild(hikeNameNode)

    const hikeImageNode = document.createElement('img')
    hikeImageNode.setAttribute('src', hike.img)
    hikeImageNode.setAttribute('width', '100%')
    hikeNode.appendChild(hikeImageNode)

    const detailNode = document.createElement('div')
    detailNode.setAttribute('class', 'details')

    const detailHeader = document.createElement('h4')
    detailHeader.innerText = 'Details:'
    detailNode.appendChild(detailHeader)

    const detailListNode = document.createElement('ul')
    const hikersNameNode = document.createElement('li')
    hikersNameNode.innerHTML = `<strong>Hikers Name:</strong> ${hike.sharer_name}`
    detailListNode.appendChild(hikersNameNode)
    const durationNode = document.createElement('li')
    durationNode.innerHTML = `<strong>Duration:</strong> ${hike.duration}mins`
    detailListNode.appendChild(durationNode)
    const locationNode = document.createElement('li')
    locationNode.innerHTML = `<strong>Location:</strong> ${hike.city}, ${hike.state}`
    detailListNode.appendChild(locationNode)
    const likesNode = document.createElement('li')
    likesNode.innerHTML = `<strong>Likes:</strong> ${hike.likes}`
    detailListNode.appendChild(likesNode)

    detailNode.appendChild(detailListNode)
    hikeNode.appendChild(detailNode)


    return hikeNode
}

function shareHikeButtonHandling() {
    const showFormButton = document.querySelector('#show-form')
    showFormButton.addEventListener('click', (e) => {
        const shareHikeForm = document.querySelector('#share-hike-form')
        if (shareHikeForm.style.display === 'none') {
            shareHikeForm.style.display = 'block'
            showFormButton.innerText = 'Hide Form'
        } else {
            shareHikeForm.style.display = 'none'
            showFormButton.innerText = 'Share Hike'
        }
    })
    
}
 
document.addEventListener('DOMContentLoaded', (e) => {
    fetchHikes();
    shareHikeButtonHandling();
})

class Hike {
    constructor(sharer_name, hike_name, img, city, state, duration, likes=0) {
        this.sharer_name = sharer_name
        this.hike_name = hike_name
        this.img = img
        this.city = city
        this.state = state
        this.duration = duration
        this.likes = likes
    }
}