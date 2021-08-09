const URL_CHAT_MESSAGES = 'https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages'
const URL_CHAT_SIGN_IN = 'https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants'
const URL_CHAT_STATUS = 'https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/status'

const divMainContent = document.querySelector('.main-content')
let userName

function initPage() {
    userName = getUserName('Digite seu nome de usuário.')

    updateMessagesForUser()

    notifyServerThatUserIsLogged()
}

function updateMessagesForUser() {
    getMessages()
    setInterval(getMessages, 3000)
}

function notifyServerThatUserIsLogged() {
    setInterval(() => { axios.post(URL_CHAT_STATUS, { name: userName }) }, 5000)
}

function isAValidUserName(testUserName) {
    const invalidUserNames = [undefined, null, '']

    for (let value of invalidUserNames) {
        if (value === testUserName) return false
    }

    return true
}

function getUserName() {
    const promptMessage = 'Digite seu nome de usuário.'

    while (!isAValidUserName(userName)) userName = prompt(promptMessage)

    const request = signInUserName(userName)
    request.catch(() => userName = getUserName())

    return userName
}

function signInUserName() {
    const signInData = {
        name: userName
    }

    return axios.post(URL_CHAT_SIGN_IN, signInData)
}

function getMessages() {

    const response = axios.get(URL_CHAT_MESSAGES)

    response.then(value => renderMessages(value.data))
}

function renderMessages(messages) {

    const renderFunctions = {
        'status': renderStatusMessage,
        'message': renderMessage,
        'private_message': renderPrivateMessage
    }

    divMainContent.innerHTML = ''

    messages.forEach(message => renderFunctions[message.type](message))

    goToLastMessage()
}

function goToLastMessage() {
    divMainContent.lastElementChild.scrollIntoView({ behavior: 'smooth' })
}

function renderStatusMessage(message) {
    const { time, from, text } = message

    divMainContent.innerHTML += `<div class="message status">
        <span class="message-time">(${time})</span>
        <span class="message-header">
            <span class="bold">${from}</span> 
        </span>
        <span class="message-body">
            ${text}
        </span>
    </div>`
}

function renderMessage(message) {
    const { time, from, to, text } = message

    divMainContent.innerHTML += `<div class="message">
        <span class="message-time">(${time})</span>
        <span class="message-header">
            <span class="bold">${from}</span> para <span class="bold">${to}</span>: 
        </span>
        <span class="message-body">
            ${text}
        </span>
    </div>`
}

function renderPrivateMessage(message) {
    const { time, from, to, text } = message

    if (to !== userName) return

    divMainContent.innerHTML += `<div class="message reserved">
        <span class="message-time">(${time})</span>
        <span class="message-header">
            <span class="bold">${from}</span> para <span class="bold">${to}</span>: 
        </span>
        <span class="message-body">
            ${text}
        </span>
    </div>`
}

function handleClick() {
    const inputElement = document.querySelector('.footer input')
    const textMessage = inputElement.value

    sendMessage(textMessage, 'Todos')

    inputElement.value = ''
}

function sendMessage(textMessage, toUserName) {
    const message = {
        from: userName,
        to: toUserName,
        text: textMessage,
        type: "message"
    }

    axios.post(URL_CHAT_MESSAGES, message).catch(() => window.location.reload())
}

function handleKeyPress(event) {
    if (event.key === 'Enter') handleClick()
}

window.onload = initPage