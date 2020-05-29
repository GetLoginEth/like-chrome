/*console.log('popup data');*/
const background = chrome.extension.getBackgroundPage();
const getLoginApi = background.getLoginApi;
//const statusElement = document.getElementById('status');
let status = 'none';

setStatus(background._like_status ? background._like_status : status);

function setStatus(newStatus) {
    status = newStatus;
    //statusElement.innerText = newStatus;

    if (status === 'app_not_allowed') {
        document.getElementById('authorize_url').href = background._like_authorize_url;
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

setInterval(_ => {
    if (status === background._like_status) {
        return;
    }

    setStatus(background._like_status);
}, 1000);
chrome.extension.onMessage.addListener(function (message, messageSender, sendResponse) {
    //console.log(message);
    //console.log(message, messageSender, sendResponse);
    //document.getElementById('data').innerText = message.msg;
    // message is the message you sent, probably an object
    // messageSender is an object that contains info about the context that sent the message
    // sendResponse is a function to run when you have a response
    /*if (message.type === 'status') {
        status = message.data;
        statusElement.innerText = status;
    }*/
});

/*setInterval(_ => {
    chrome.runtime.sendMessage({msg: 'hello from POPUP ' + Math.random()});
    const back = chrome.extension.getBackgroundPage();
    console.log(back.getLoginApi);
}, 1000);*/

document.querySelector('.like').onclick = _ => {
    //console.log('Clicked');
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
        chrome.runtime.sendMessage({type: 'toggle_like', url: resultUrl});
    });
}
document.querySelector('#resetAccessToken').onclick = _ => {
    _.preventDefault();
    if (confirm('Reset?')) {
        //console.log('yes');
        chrome.runtime.sendMessage({type: 'reset_access_token'});
    } else {
        //console.log('no');
    }
}
