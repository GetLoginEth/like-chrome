//const background = chrome.extension.getBackgroundPage();
import {
    STATUS_APP_NOT_ALLOWED,
    STATUS_NONE,
    TYPE_GET_STATE,
    TYPE_RESET_ACCESS_TOKEN,
    TYPE_TOGGLE_LIKE,
    TYPE_UPDATE_STATE, TYPE_UPDATE_URL_INFO
} from "./consts";

let state = {};

function setStatus(newStatus, data = {}) {
    status = newStatus;
    console.log('New status', newStatus);
    if (status === STATUS_APP_NOT_ALLOWED) {
        document.getElementById('authorize_url').href = data.url;
        document.getElementById('resetAccessToken').style.display = 'none';
    } else {
        document.getElementById('resetAccessToken').style.display = 'block';
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

function onOpenDonate(e) {
    e.preventDefault();
    openDonate(true);
}

function onCloseDonate(e) {
    e.preventDefault();
    openDonate(false);
}

function onAddDonate(e) {
    e.preventDefault();
    // todo validate donate value, store donate value, display plus donate icon
    openDonate(false);
}

function openDonate(isOpen) {
    document.querySelectorAll('.subpage-donate').forEach(item => {
        if (isOpen) {
            item.classList.add('active');
            item.classList.remove('inactive');
        } else {
            item.classList.remove('active');
            item.classList.add('inactive');
        }
    });
}

chrome.extension.onMessage.addListener(function (message, messageSender, sendResponse) {
    console.log(message, messageSender, sendResponse);
    if (message.type === TYPE_UPDATE_STATE) {
        state = message.data;
        setStatus(state.status, state.status_data);
        if (state.currentPageInfo) {
            const image = state.currentPageInfo.isLiked ? 'img/heart-full-liked.png' : 'img/heart-full.png';
            document.querySelector('.like').setAttribute('src', image);
        }

        if (state.balance && state.balance.balanceWeb) {
            document.querySelector('.tokenBalance').innerText = state.balance.balanceWeb;
            const inputDonate = document.querySelector('.input-donate');
            if (!inputDonate.value && Number(state.balance.balanceWeb) > 0) {
                inputDonate.value = Number(state.balance.balanceWeb) / 10;
            }
        }
    }
});

openDonate(false);
document.querySelectorAll('.subpage-donate').forEach(item => {
    item.classList.remove('active');
    item.classList.add('inactive');
});
document.querySelector('.like').onclick = onLike;
document.querySelector('#resetAccessToken').onclick = onResetAccessToken;
document.querySelector('.add-donate').onclick = onOpenDonate;
document.querySelector('.close-donate').onclick = onCloseDonate;
document.querySelector('.add-donate-btn').onclick = onAddDonate;

setStatus(STATUS_NONE);
chrome.runtime.sendMessage({type: TYPE_GET_STATE});
//chrome.runtime.sendMessage({type: TYPE_UPDATE_URL_INFO});
