/*console.log('popup data');*/
const background = chrome.extension.getBackgroundPage();
const getLoginApi = background.getLoginApi;
const result = document.getElementById('result');
const statusElement = document.getElementById('status');
let status = 'none';

setStatus(background._like_status);

function setStatus(newStatus) {
    status = newStatus;
    statusElement.innerText = newStatus;

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

document.getElementById('get-user-info').onclick = async () => {
    const info = await getLoginApi.getUserInfo();
    result.innerText = info.username + " | " + info.usernameHash;
};
