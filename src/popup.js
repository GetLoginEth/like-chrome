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

function getYoutubeId(url) {
    var regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match && match[1].length == 11) ? match[1] : false;
}

function onLike() {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        const url = tabs[0].url;
        let resultUrl = url;
        console.log(url);
        const youtubeUrls = ['https://youtube.com/', 'https://youtu.be/'];
        const isYoutube = !!youtubeUrls.find(item => url.indexOf(item) === 0);
        const youtubeId = getYoutubeId(url);
        if (isYoutube && youtubeId) {
            resultUrl = `youtube:${youtubeId}`;
        }

        console.log('result url', resultUrl);
        chrome.runtime.sendMessage({type: TYPE_TOGGLE_LIKE, url: resultUrl});
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
        setStatus(message.data.status, message.data.status_data);
    }
});

document.querySelector('.like').onclick = onLike;
document.querySelector('#resetAccessToken').onclick = onResetAccessToken;

setStatus(STATUS_NONE);
chrome.runtime.sendMessage({type: TYPE_GET_STATE});
