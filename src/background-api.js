const backgroundWindow = chrome.extension.getBackgroundPage();
//let getLoginApiUrl = "https://localhost:3000/api/last.js";
let getLoginUrl = 'https://localhost:3000/bzz:/getlogin.eth/';
let redirectUrl = 'https://localhost:1234/token.html';
let accessToken = localStorage.getItem('access_token');
console.log('accessToken', accessToken);
backgroundWindow._onGetLoginApiLoaded = async (instance) => {
    backgroundWindow.getLoginApi = instance;
    console.log(instance);
    const data = await instance.init(3, getLoginUrl, redirectUrl, accessToken)
    console.log('init', data);
    // todo auth not check who receive info
    const info = await instance.getUserInfo();
    console.log('info', info);
};
/*
console.log('back api');
console.log(window);
setInterval(_ => {
    chrome.runtime.sendMessage({msg: 'hello from back ' + Math.random()});
}, 1000)

chrome.extension.onMessage.addListener(function (message, messageSender, sendResponse) {
    console.log(message, messageSender, sendResponse);

    // message is the message you sent, probably an object
    // messageSender is an object that contains info about the context that sent the message
    // sendResponse is a function to run when you have a response
});
*/
