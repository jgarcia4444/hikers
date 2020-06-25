
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
        const id = hikeJSON['id']
        const sharer_name = hikeJSON['sharer_name']
        const hike_name = hikeJSON['hike_name']
        const city = hikeJSON['city']
        const state = hikeJSON['state']
        const duration = hikeJSON['duration']
        const img = hikeJSON['img']
        const likes = hikeJSON['likes']
        const newHike = new Hike(id, sharer_name, hike_name, img, city, state, duration, likes)
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
    hikeImageNode.setAttribute('data-hike', hike.id)
    hikeImageNode.addEventListener('dblclick', (e) => {
        handleImgDblClick(e)
    })
    hikeNode.appendChild(hikeImageNode)

    const hikeFooterNode = document.createElement('div')
    hikeFooterNode.setAttribute('class', 'hike-footer-container')
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

    const commentNode = document.createElement('div')
    commentNode.setAttribute('class', 'comments')
    const commentHeader = document.createElement('h4')
    commentHeader.innerText = 'Comments:'
    commentNode.appendChild(commentHeader)
    let comments = fetchComments(hike);
    if (comments === undefined) {
        const comment = document.createElement('p')
        comment.innerText = "No comments yet..."
        commentNode.appendChild(comment)
    } else {
        comments.forEach((comment) => {
            commentUI = createComment(comment)
            commentNode.appendChild(commentUI)
        })
    }

    detailNode.appendChild(detailListNode)
    hikeFooterNode.appendChild(detailNode)
    hikeFooterNode.appendChild(commentNode)
    hikeNode.appendChild(hikeFooterNode)

    return hikeNode
}

function fetchComments(hike) {

}

function showFormButtonHandling() {
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

function sendHikeToDb(newHike) {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(newHike)
    }
    fetch (HIKES_URL, options)
    .then(resp => resp.json())
    .then(json => console.log(json))
}

function handleShareHikeForm() {
    const formNode = document.querySelector('#share-hike-form')
    formNode.addEventListener('submit', (e) => {
        e.preventDefault();
        const newHike = new Hike()
        for (let i = 0; i < 6; i++) {
            newHike[e.target[i].name] = e.target[i].value
        }
        sendHikeToDb(newHike)
        location.reload()
    })
}

function handleImgDblClick(e) {
    const detailsDiv = e.target.nextElementSibling
    const likesLiNode = detailsDiv.querySelectorAll('ul>li')[3]
    const likesNumber = parseInt(likesLiNode.innerText.split(' ')[1], 10)
    likesLiNode.innerHTML = `<strong>Likes: </strong> ${likesNumber + 1}`
    persistLikeToDb(e)
}

function persistLikeToDb(e) {
    const dataSet = e.target.dataset
    const options = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(dataSet)
    }
    fetch(`${HIKES_URL}/${dataSet.hikeId}`, options)
    .then(resp => console.log(resp))
    
}
 
document.addEventListener('DOMContentLoaded', (e) => {
    fetchHikes();
    showFormButtonHandling();
    handleShareHikeForm();
})

class Hike {
    constructor(id, sharer_name, hike_name, img, city, state, duration, likes=0) {
        this.id = id
        this.sharer_name = sharer_name
        this.hike_name = hike_name
        this.img = img
        this.city = city
        this.state = state
        this.duration = duration
        this.likes = likes
    }
}