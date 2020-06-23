
const BASE_URL = 'http://localhost:3000'
const HIKES_URL = BASE_URL + '/hikes'


function fetchHikes() {
    const Hike1 = new Hike('test')
    const hikesWrapper = document.querySelector('#hikes-wrapper')
    hikesWrapper.innerText = Hike1.sharer_name
}

document.addEventListener('DOMContentLoaded', (e) => {
    fetchHikes();
})

class Hike {
    constructor(sharer_name, hike_name, img, city, state, duration, likes) {
        this.sharer_name = sharer_name
        this.hike_name = hike_name
        this.img = img
        this.city = city
        this.state = state
        this.duration = duration
        this.likes = likes
    }
}