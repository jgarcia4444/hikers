const BASE_URL = 'http://localhost:3000'
const HIKES_URL = BASE_URL + '/hikes'
const USERS_URL = BASE_URL + '/users'
var currentUser;
const states = ['AL','AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
'HI', 'ID', 'IL', 'IN','IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT',
'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI',
'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];

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
    const userID = localStorage.getItem('id')
    const commentInput = form.querySelector('#commentor_content')
    const hikeIDInput = form.querySelector('input[name="hike_id"]')
    const newCommentAttributes = {'hike_id': `${hikeIDInput.value}`,'user_id': `${userID}`, 'content': `${commentInput.value}` }
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
        const inputs = formNode.querySelectorAll('input')
        const selectInput = document.querySelector('select#state')
        const newHike = new Hike()
        inputs.forEach(input => {
            if (input.type !== 'submit') {
                newHike[input.name] = input.value
            } 
        })
        newHike['state'] = selectInput.options[selectInput.selectedIndex].value
        newHike['user_id'] = localStorage.getItem('id')
        newHike.sendHikeToDb()
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
        signupForm.parentNode.style.display = 'none'
        modal.style.display = 'none';
    }
}

function loginFormHandling() {
    const loginForm = document.querySelector('#login-form')
    loginForm.onsubmit = (e => {
        e.preventDefault();
        const inputs = loginForm.querySelectorAll('input')
        const possibleUser = new User()
        inputs.forEach(input => {
            if (input.type !== 'submit') {
                possibleUser[input.name] = input.value
            }
        })
        possibleUser.authenticate().then(res => {
                clearInputs(loginForm)
                if (res.ok) {
                    const modal = loginForm.parentNode.parentNode
                    loginForm.parentNode.style.display = 'none'
                    modal.style.display = 'none';
                    return res.json()
                }
            })
            .then(json => {
                const user = User.parseJSONToUser(json);
                localStorage.setItem('id', `${user.id}`);
                checkForLoggedInUser();
            })
    })
}

function logoutButtonClicked() {
    const logoutButton = document.querySelector('#logout-button')
    logoutButton.onclick = (e => {
        localStorage.clear();
        location.reload();
    })
}

function checkForLoggedInUser() {
    const signupButton = document.querySelector('#signup-button')
    const loginButton = document.querySelector('#login-button')
    const logoutButton = document.querySelector('#logout-button')
    if (localStorage.getItem('id') !== null && localStorage.getItem('id') !== "undefined") {
        signupButton.style.display = 'none'
        loginButton.style.display = 'none'
        logoutButton.style.display = 'inline-block'
    } else {
        signupButton.style.display = 'inline-block'
        loginButton.style.display = 'inline-block'
        logoutButton.style.display = 'none'
        currentUser = User.fetchUser(localStorage.getItem('id'))
    }
}

function addOptionsForStateSelection() {
    const stateSelectNode = document.querySelector('select#state')
    states.forEach(state => {
        const stateOption = document.createElement('option')
        stateOption.setAttribute('value', state)
        stateOption.innerText = state
        stateSelectNode.appendChild(stateOption)
    })
}

function addOptionsForFilterByState() {
    const filterSelectNode = document.querySelector('select#filter-by-state')
    const allOption = document.createElement('option')
    allOption.setAttribute('value', 'ALL')
    allOption.innerText = 'ALL'
    filterSelectNode.appendChild(allOption)
    states.forEach(state => {
        const stateOption = document.createElement('option')
        stateOption.setAttribute('value', state)
        stateOption.innerText = state
        filterSelectNode.appendChild(stateOption)
    })
    filterSelectNode.onchange = (e => {
        handleFilterByStateSelection(e)
    })
}

function handleFilterByStateSelection(event) {
    const selectedOptionValue = event.target[event.target.selectedIndex].value
    if (selectedOptionValue === 'ALL') {
        Hike.allHikes()
    } else {
        fetch(`${HIKES_URL}/filter/${selectedOptionValue}`)
            .then(res => res.json())
            .then(json => {
                const hikes = Hike.parseJsonToHikes(json)
                Hike.appendHikesToHikesWrapper(hikes)
            })
    }
}

function errorHandlingShareHikeForm(jsonError) {
    console.log(jsonError.error)
    const shareHikeForm = document.querySelector('#share-hike-form');
    console.log(shareHikeForm)
    const errorMessage = jsonError.error;
    const paragraphNode = document.createElement('p');
    paragraphNode.innerText = errorMessage;
    paragraphNode.setAttribute('class', 'error-message');
    shareHikeForm.appendChild(paragraphNode)
}

document.addEventListener('DOMContentLoaded', (e) => {
    checkForLoggedInUser();
    Hike.allHikes();
    showFormButtonHandling();
    handleShareHikeForm();
    handleSignupButtonClick();
    handleLoginButtonClick(); 
    signupFormHandling();
    loginFormHandling();
    logoutButtonClicked();
    addOptionsForStateSelection();
    addOptionsForFilterByState();
})

class Hike {
    constructor(id, user_id, hike_name, img, city, state, duration, likes=0) {
        this.id = id
        this.user_id = user_id
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
        .then(json => {
            if (json.error) {
                errorHandlingShareHikeForm(json)
            } 
        })
    }

    static async allHikes() {
        let res = await fetch(HIKES_URL)
        const json = await res.json()
        const hikes = Hike.parseJsonToHikes(json)
        this.appendHikesToHikesWrapper(hikes)
    }

    static appendHikesToHikesWrapper(hikes) {
        const hikesWrapper = document.querySelector('#hikes-wrapper')
        const previousHikes = hikesWrapper.querySelectorAll('.hike')
        previousHikes.forEach(hike => hike.remove())
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

        if (this.user_id === parseInt(localStorage.getItem('id'), 10)) {
            const deleteHikeButton = this.createDeleteHikeButton()
            hikeNode.appendChild(deleteHikeButton)
        }

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

    createDeleteHikeButton() {
        const button = document.createElement('button')
        button.setAttribute('class', 'delete-hike')
        button.innerText = 'Delete your shared hike.'
        button.onclick = (e => {
            const hikeNode = e.target.parentNode
            this.deleteHike()
            hikeNode.remove()
        })
        return button
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

    deleteHike() {
        const options = {
            method: 'DELETE',
            content: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(this)
        }
        fetch(`${HIKES_URL}/${this.id}`, options)
    }

    createDetailsParagraphNodes(parentNode) {
        let paragraphNodes = []
        const paragraphsContent = { 
            'user_id': 'Hikers Name',
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
        let content;
        if (label === 'Hikers Name') {
            hikeAttribute = 'user_id'
            User.fetchUser(this.user_id).then(user => {
                content = user.capitalizeFullName()
                paragraphNode.innerHTML = `<strong>${label}:</strong> <span id="${hikeAttribute}_${this['id']}">${content}</span>`
            })
        } else {
            hikeAttribute = label.toLowerCase()
            if (hikeAttribute === 'location') {
                content = `${this.city}, ${this.state}`
            } else {
                content = `${this[hikeAttribute]} ${hikeAttribute === 'duration' ? 'mins' : ''}`
            }
            paragraphNode.innerHTML = `<strong>${label}:</strong> <span id="${hikeAttribute}_${this['id']}">${content}</span>`
        }        
        return paragraphNode
    }

    handleImgDblClick() {
        const userID = localStorage.getItem('id')
        if (userID) { 
            let likable;
            fetch(`${HIKES_URL}/${this.id}/users/${userID}`)
                .then(res => res.json())
                .then(json => {
                    console.log(json)
                    likable = json.likable
                })
            if (likable == true) {
                this.likes += 1
                const likesSpanNode = document.querySelector(`#likes_${this.id}`)
                likesSpanNode.innerText = `${this.likes}`
                this.persistLikeToDb(userID)
            }
        } 
    }

    persistLikeToDb(userID) {
        const options = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                hike: this,
                user_id: userID
            })
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
    constructor(id, user_id, content, hike_id) {
        this.id = id
        this.user_id = user_id
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
        const deleteCommentButton = this.createDeleteCommentButton()
        if (deleteCommentButton !== null) {
            commentContainerNode.appendChild(deleteCommentButton)
        }
        return commentContainerNode
    }

    createCommentorNameNode() {
        const commentorNameNode = document.createElement('div')
        commentorNameNode.setAttribute('class', 'commentor-name')
        User.fetchUser(this.user_id).then(user => {
            commentorNameNode.innerText = user.capitalizeFullName()
        })
        return commentorNameNode
    }

    createCommentContentNode() {
        const contentNode = document.createElement('div')
        contentNode.setAttribute('class', 'comment-content')
        contentNode.innerText = this.content.trim()
        return contentNode
    }

    createDeleteCommentButton() {
        if (this.user_id === parseInt(localStorage.getItem('id'), 10)) {
            const button = document.createElement('button')
            button.setAttribute('class', 'delete-comment')
            button.innerText = 'Delete above comment.'
            button.onclick = (e => {
                const commentToBeDeleted = e.target.parentNode
                this.deleteCommentFromDb()
                commentToBeDeleted.remove();
            })
            return button
        } else {
            return null
        }
    }

    deleteCommentFromDb() {
        const options = {
            method: 'DELETE',
            content: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(this)
        }
        fetch(`${BASE_URL}/comments/${this.id}`, options)
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
        localStorage.setItem('id', `${this.id}`)
    }

    authenticate() {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(this)
        }
        return fetch(`${BASE_URL}/login`, options)
    }

    static async fetchUser(user_id) {
        if (user_id !== null) {
            const res = await fetch(`${USERS_URL}/${user_id}`)
            const json = await res.json()
            return User.parseJSONToUser(json)   
        }
    }

    static parseJSONToUser(json) {
        const fetchedUser = new User()
        for (const objectKey in json) {
            fetchedUser[objectKey] = json[objectKey]
        }
        return fetchedUser;
    }    

    capitalizeFullName() {
        const firstName = this.first_name
        const lastName = this.last_name
        return `${firstName.charAt(0).toUpperCase()}${firstName.slice(1)} ${lastName.charAt(0).toUpperCase()}${lastName.slice(1)}`
    }
}