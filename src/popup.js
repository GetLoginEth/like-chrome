//const background = chrome.extension.getBackgroundPage();
let state = {};

function setStatus(newStatus, data = {}) {
    status = newStatus;

    if (status === STATUS_APP_NOT_ALLOWED) {
        document.getElementById('authorize_url').href = data.url;
    }

    document.querySelectorAll('.page').forEach(item => {
        if (item.classList.contains(newStatus)) {
            item.classList.add('active');
            item.classList.remove('inactive');
        } else {
            item.classList.add('inactive');
            item.classList.remove('active');
        }
    });
}

function onLike() {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        const url = tabs[0].url;
        console.log('result url', url);
        chrome.runtime.sendMessage({type: TYPE_TOGGLE_LIKE, url});
    });
}

function onResetAccessToken(e) {
    e.preventDefault();
    if (confirm('Reset?')) {
        chrome.runtime.sendMessage({type: TYPE_RESET_ACCESS_TOKEN});
        setStatus(STATUS_APP_NOT_ALLOWED);
    }
}

chrome.extension.onMessage.addListener(function (message, messageSender, sendResponse) {
    console.log(message, messageSender, sendResponse);
    if (message.type === TYPE_UPDATE_STATE) {
        state = message.data;
        setStatus(state.status, state.status_data);
        if (state.currentPageInfo) {
            document.querySelector('.like').setAttribute('src', state.currentPageInfo.isLiked ? 'img/heart-liked.png' : 'img/heart.png');
        }
    }
});

document.querySelector('.like').onclick = onLike;
document.querySelector('#resetAccessToken').onclick = onResetAccessToken;

setStatus(STATUS_NONE);
chrome.runtime.sendMessage({type: TYPE_GET_STATE});
