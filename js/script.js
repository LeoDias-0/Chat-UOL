const URL_CHAT_MESSAGES = 'https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages'
const URL_CHAT_SIGN_IN = 'https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants'

const divMainContent = document.querySelector('.main-content')

function initPage() {
    // const userName = getUserName('Digite seu nome de usuário.')
    const userName = '👹'

    // signInUserName(userName)

    getMessages()
    setInterval(getMessages, 3000)


}

function isAValidUserName(userName) {
    const invalidUserNames = [undefined, null, '']
    
    for (value of invalidUserNames) {
        if(value === userName) return false
    }

    return true
}

function getUserName(initialPromptMessage) {
    const promptMessage = 'Digite seu nome de usuário.'

    let userName = prompt(initialPromptMessage)
    while (!isAValidUserName(userName)) userName = prompt(promptMessage)

    return userName
}

function signInUserName(userName) {
    const signInData = {
        name: userName
    }
    const request = axios.post(URL_CHAT_SIGN_IN, signInData)

    const alreadyUtilyzedUserNameMessage = 'Este nome de usuário já está sendo utilizado!'
    request.catch(() => {getUserName(alreadyUtilyzedUserNameMessage)})
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
    divMainContent.querySelector('.message:last-child').scrollIntoView()
}

function renderStatusMessage(message) {
    const {time, from, text} = message

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
    const {time, from, to, text} = message

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
    const {time, from, to, text} = message

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

function sendMessage(message, userName) {
    
}

window.onload = initPage