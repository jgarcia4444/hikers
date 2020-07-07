const BASE_URL = 'http://localhost:3000'
const HIKES_URL = BASE_URL + '/hikes'
const USERS_URL = BASE_URL + '/users'
var currentUser;

function toggleAddCommentForm(event, form) {
    const showButton = event.target
    const addCommentForm = form
    if (addCommentForm.style.display === 'none') {
        showButton.innerText = 'Hide Form'
        addCommentForm.style.display = 'block'
    } else {
        showButton.innerText = 'Show Comment Form'
        addCommentForm.style.display = 'none'
    }
}
function handleAddCommentForm(form) {
    const nameInput = form.querySelector('#commentor_name')
    const commentInput = form.querySelector('#commentor_content')
    const hikeIDInput = form.querySelector('input[name="hike_id"]')
    const newCommentAttributes = {'hike_id': `${hikeIDInput.value}`,'name': `${nameInput.value}`, 'content': `${commentInput.value}` }
    const newComment = new Comment()
    for (const objectKey in newCommentAttributes) {
        newComment[objectKey] = newCommentAttributes[objectKey]
    }
    newComment.sendCommentToDb()
    location.reload()
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
function handleShareHikeForm() {
    const formNode = document.querySelector('#share-hike-form')
    formNode.addEventListener('submit', (e) => {
        e.preventDefault();
        const newHike = new Hike()
        for (let i = 0; i < 6; i++) {
            newHike[e.target[i].name] = e.target[i].value
        }
        newHike.sendHikeToDb()
        location.reload()
    })
}
function handleSignupButtonClick() {
    const signupButton = document.querySelector('#signup-button')
    signupButton.onclick = (e) => {
        const modal = document.querySelector('.modal');
        const signupForm = modal.querySelector('.signup-content');
        modal.style.display = 'block';
        signupForm.style.display = 'block';
        const closeButton = signupForm.querySelector('#signup-close-button')
        closeButton.onclick = (closeEvent) => {
            clearInputs(signupForm);
            signupForm.style.display = 'none'
            modal.style.display = 'none'
        } 
    }
}
function handleLoginButtonClick() {
    const loginButton = document.querySelector('#login-button')
    loginButton.onclick = (e) => {
        const modal = document.querySelector('.modal');
        const loginForm = modal.querySelector('.login-content');
        modal.style.display = 'block';
        loginForm.style.display = 'block';
        const closeButton = loginForm.querySelector('#login-close-button')
        closeButton.onclick = (closeEvent) => {
            clearInputs(loginForm)
            loginForm.style.display = 'none'
            modal.style.display = 'none'
        } 
    }
}

function clearInputs(form) {
    const inputs = form.querySelectorAll('input')
    inputs.forEach(input => {
        if (input.type !== 'submit') {
            input.value = '';
        }
    })
}

function signupFormHandling() {
    const signupForm = document.querySelector('#signup-form')
    signupForm.onsubmit = (e) => {
        e.preventDefault();
        const inputs = signupForm.querySelectorAll('input')
        const newUser = new User()
        inputs.forEach(input => {
            if (input.type !== 'submit') {
                newUser[input.name] = input.value
            }
        })
        newUser.sendSignupInfo();
        clearInputs(signupForm);
        const modal = signupForm.parentNode.parentNode
        modal.style.display = 'none';
    }
}
document.addEventListener('DOMContentLoaded', (e) => {
    Hike.allHikes();
    showFormButtonHandling();
    handleShareHikeForm();
    handleSignupButtonClick();
    handleLoginButtonClick(); 
    signupFormHandling();
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

    createCommentForm() {
        const formNode = document.createElement('form')
        formNode.setAttribute('class', 'form-container add-comment-form')
        formNode.style.display = 'none'
        formNode.addEventListener('submit', (e) => {
            e.preventDefault()
            handleAddCommentForm(formNode)
        })
        const hiddenHikeIdInput = document.createElement('input')
        hiddenHikeIdInput.setAttribute('type', 'hidden')
        hiddenHikeIdInput.setAttribute('value', `${this.id}`)
        hiddenHikeIdInput.setAttribute('name', 'hike_id')
        formNode.appendChild(hiddenHikeIdInput)
        const firstFormRowNode = document.createElement('div')
        firstFormRowNode.setAttribute('class', 'form-row')
        const firstColumnInFirstRow = document.createElement('div')
        firstColumnInFirstRow.setAttribute('class', 'form-col-2')
        const commentorNameLabel = document.createElement('label')
        commentorNameLabel.innerText = 'Your Name:'
        commentorNameLabel.setAttribute('for', 'commentor_name')
        const commentorNameInput = document.createElement('input')
        const nameInputAttributes = {'name': 'commentor_name', 'id': 'commentor_name', 'type': 'text'}
        for (const objectKey in nameInputAttributes) {
            commentorNameInput.setAttribute(objectKey, nameInputAttributes[objectKey])
        }
        firstColumnInFirstRow.appendChild(commentorNameLabel)
        firstColumnInFirstRow.appendChild(commentorNameInput)
        firstFormRowNode.appendChild(firstColumnInFirstRow)
        const secondColumnInFirstRow = document.createElement('div')
        secondColumnInFirstRow.setAttribute('class', 'form-col-2')
        const commentorContentLabel = document.createElement('label')
        commentorContentLabel.innerText = 'Comment:'
        commentorContentLabel.setAttribute('for', 'commentor_content')
        const commentorContentInput = document.createElement('textarea')
        const commentInputAttributes = {'name': 'commentor_content', 'id': 'commentor_content', 'type': 'text'}
        for (const objectKey in commentInputAttributes) {
            commentorContentInput.setAttribute(objectKey, commentInputAttributes[objectKey])
        }
        secondColumnInFirstRow.appendChild(commentorContentLabel)
        secondColumnInFirstRow.appendChild(commentorContentInput)
        firstFormRowNode.appendChild(secondColumnInFirstRow)
        formNode.appendChild(firstFormRowNode)
        const secondFormRowNode = document.createElement('div')
        secondFormRowNode.setAttribute('class', 'form-row')
        const columnInSecondRow = document.createElement('div')
        columnInSecondRow.setAttribute('class', 'form-col-2')
        const submitCommentButton = document.createElement('input')
        submitCommentButton.innerText = 'Submit'
        submitCommentButton.setAttribute('type', 'submit')
        columnInSecondRow.appendChild(submitCommentButton)
        secondFormRowNode.appendChild(columnInSecondRow)
        formNode.appendChild(secondFormRowNode)
        return formNode
    }

    sendHikeToDb() {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(this)
        }
        fetch (HIKES_URL, options)
        .then(resp => resp.json())
        .then(json => console.log(json))
    }

    static async allHikes() {
        let res = await fetch(HIKES_URL)
        const json = await res.json()
        const hikes = Hike.parseJsonToHikes(json)
        this.appendHikesToHikesWrapper(hikes)
    }

    static appendHikesToHikesWrapper(hikes) {
        const hikesWrapper = document.querySelector('#hikes-wrapper')
        hikes.forEach(hike => {
            const hikeNode = hike.createHikeNode()
            hikesWrapper.appendChild(hikeNode)
        });
    }

    createHikeNode() {
        const hikeNode = document.createElement('div')
        hikeNode.setAttribute('class', 'hike')
        const hikeNameNode = document.createElement('h3')
        hikeNameNode.innerText = this.hike_name
        hikeNode.appendChild(hikeNameNode)
        const hikeImageNode = this.createHikeImageNode()
        hikeNode.appendChild(hikeImageNode)
        const hikeFooterNode = document.createElement('div')

        

        hikeFooterNode.setAttribute('class', 'hike-footer-container')

        const labelRowNode = document.createElement('div')
        labelRowNode.setAttribute('class', 'form-row')
        const detailHeader = document.createElement('h4')
        detailHeader.innerText = 'Details:'
        const commentsHeader = document.createElement('h4')
        commentsHeader.innerText = 'Comments:'
        const detailLabelColumn = document.createElement('div')
        detailLabelColumn.setAttribute('class', 'form-col-2')
        detailLabelColumn.appendChild(detailHeader)
        const commentsLabelColumn = document.createElement('div')
        commentsLabelColumn.setAttribute('class', 'form-col-2')
        commentsLabelColumn.appendChild(commentsHeader)
        labelRowNode.appendChild(detailLabelColumn)
        labelRowNode.appendChild(commentsLabelColumn)

        const detailNode = document.createElement('div')
        detailNode.setAttribute('class', 'details')
        const detailListNode = document.createElement('div')
        this.createDetailsParagraphNodes(detailListNode)
        const commentsNode = document.createElement('div')
        commentsNode.setAttribute('class', 'comments')
        commentsNode.setAttribute('data-hike', JSON.stringify(this))
        this.fetchComments()
        detailNode.appendChild(detailListNode)
        hikeFooterNode.appendChild(labelRowNode)
        hikeFooterNode.appendChild(detailNode)
        hikeFooterNode.appendChild(commentsNode)
        hikeNode.appendChild(hikeFooterNode)
        return hikeNode
    }

    createHikeImageNode() {
        const hikeImageNode = document.createElement('img')
        hikeImageNode.setAttribute('src', this.img)
        hikeImageNode.setAttribute('data-hike-id', this.id)
        hikeImageNode.addEventListener('dblclick', (e) => {
            console.log(this)
            this.handleImgDblClick()
        })
        return hikeImageNode
    }

    createDetailsParagraphNodes(parentNode) {
        let paragraphNodes = []
        const paragraphsContent = { 
            'sharer_name': 'Hikers Name',
            'location': 'Location',
            'duration': 'Duration',
            'likes': 'Likes'  
        }
        for (const hikeContent in paragraphsContent) {
            paragraphNodes.push(this.createParagraphNode(paragraphsContent[hikeContent]))
        }
        paragraphNodes.forEach(paragraph => parentNode.appendChild(paragraph))
    }

    createParagraphNode(label) {
        const paragraphNode = document.createElement('p')
        let hikeAttribute;
        if (label === 'Hikers Name') {
            hikeAttribute = 'sharer_name'
        } else {
            hikeAttribute = label.toLowerCase()
        }
        let content;
        if (hikeAttribute === 'location') {
            content = `${this.city}, ${this.state}`
        } else {
            content = `${this[hikeAttribute]} ${hikeAttribute === 'duration' ? 'mins' : ''}`
        }
        paragraphNode.innerHTML = `<strong>${label}:</strong> <span id="${hikeAttribute}_${this['id']}">${content}</span>`
        return paragraphNode
    }

    handleImgDblClick() {
        this.likes += 1
        const likesSpanNode = document.querySelector(`#likes_${this.id}`)
        likesSpanNode.innerText = `${this.likes}`
        this.persistLikeToDb()
    }

    persistLikeToDb() {
        const options = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(this)
        }
        fetch(`${HIKES_URL}/${this.id}`, options)  
    }
    fetchComments() {
        fetch(`${HIKES_URL}/${this.id}/comments`)
        .then(resp => resp.json())
        .then(json => {
            const comments = Comment.parseJSONToComments(json)
            this.appendComments(comments)
        })
    }

    appendComments(comments) {
        const commentsNodes = document.querySelectorAll('.comments')
        let commentsNode; 
        commentsNodes.forEach(node => {
            if (node.dataset.hike == JSON.stringify(this)) {
                commentsNode = node
            }
        })
        if (comments.length === 0) {
            const messageNode = document.createElement('p')
            messageNode.innerText = 'No comments yet...'
            commentsNode.appendChild(messageNode)
        } else {
            comments.forEach(comment => {
                const commentNode = comment.createCommentNode()
                commentsNode.appendChild(commentNode)
            }) 
        }
        const addCommentContainer = document.createElement('div')
        addCommentContainer.setAttribute('class', 'add-comment-container')
        addCommentContainer.setAttribute('data-hike-id', `${this.id}`)
        const addCommentButton = document.createElement('button')
        addCommentButton.innerText = 'Show Comment Form'
        addCommentButton.setAttribute('class', 'show-form-button')
        addCommentButton.addEventListener('click', (e) => {
            toggleAddCommentForm(e, addCommentForm)
        })
        const addCommentForm = this.createCommentForm()
        addCommentContainer.appendChild(addCommentButton)
        addCommentContainer.appendChild(addCommentForm)
        commentsNode.appendChild(addCommentContainer)
    }

    static parseJsonToHikes(hikesJSON) {
        return hikesJSON.map(hikeJSON => {
            const newHike = new Hike()
            for (const k in hikeJSON) {
                newHike[k] = hikeJSON[k]
            }
            return newHike
        })
    }

}
class Comment {
    constructor(id, name, content, hike_id) {
        this.id = id
        this.name = name
        this.content = content
        this.hike_id = hike_id
    }
    createCommentNode() {
        const commentContainerNode = document.createElement('div')
        commentContainerNode.setAttribute('class', 'comment-container')
        const commentorNameNode = this.createCommentorNameNode()
        commentContainerNode.appendChild(commentorNameNode)
        const commentContentNode = this.createCommentContentNode()
        commentContainerNode.appendChild(commentContentNode)
        
        return commentContainerNode
    }
    createCommentorNameNode() {
        const commentorNameNode = document.createElement('div')
        commentorNameNode.setAttribute('class', 'commentor-name')
        commentorNameNode.innerText = this.capitalizeName() 
        return commentorNameNode
    }
    capitalizeName() {
        return this.name.charAt(0).toUpperCase() + this.name.slice(1)
    }
    createCommentContentNode() {
        const contentNode = document.createElement('div')
        contentNode.setAttribute('class', 'comment-content')
        contentNode.innerText = this.content.trim()
        return contentNode
    }
    sendCommentToDb() {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(this)
        }
        fetch(`${HIKES_URL}/${this.hike_id}/comments`, options)
        .then(resp => console.log(resp))
    }
    static parseJSONToComments(json) {
        return json.map((commentObject) => {
            const newComment = new Comment()
            for (const objectKey in commentObject) {
                newComment[objectKey] = commentObject[objectKey]
            }
            return newComment
        })
    }
}

class User {
    constructor(id, first_name, last_name, email, password) {
        this.id = id
        this.first_name = first_name
        this.last_name = last_name
        this.email = email
        this.password = password
    }

    async sendSignupInfo() {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            
            body: JSON.stringify(this)
        }
        const res = await fetch(USERS_URL, options)
        const json = await res.json()
        this.id = json['id']
        currentUser = this
    }

}