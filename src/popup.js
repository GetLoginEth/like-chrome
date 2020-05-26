/*console.log('popup data');*/
const background = chrome.extension.getBackgroundPage();
const getLoginApi = background.getLoginApi;
const result = document.getElementById('result');

/*chrome.extension.onMessage.addListener(function (message, messageSender, sendResponse) {
    console.log(message, messageSender, sendResponse);
    document.getElementById('data').innerText = message.msg;
    // message is the message you sent, probably an object
    // messageSender is an object that contains info about the context that sent the message
    // sendResponse is a function to run when you have a response
});*/

/*setInterval(_ => {
    chrome.runtime.sendMessage({msg: 'hello from POPUP ' + Math.random()});
    const back = chrome.extension.getBackgroundPage();
    console.log(back.getLoginApi);
}, 1000);*/

document.getElementById('get-user-info').onclick = async () => {
    const info = await getLoginApi.getUserInfo();
    result.innerText = info.username + " | " + info.usernameHash;
};
