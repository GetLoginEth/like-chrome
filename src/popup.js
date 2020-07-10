import {
    STATUS_APP_NOT_ALLOWED,
    STATUS_NONE,
    TYPE_GET_STATE,
    TYPE_RESET_ACCESS_TOKEN,
    TYPE_SET_DONATE,
    TYPE_TOGGLE_LIKE,
    TYPE_UPDATE_STATE
} from "./consts";

let state = {};

function setStatus(newStatus, data = {}) {
    status = newStatus;
    console.log('New status', newStatus);
    if (status === STATUS_APP_NOT_ALLOWED) {
        document.getElementById('authorize_url').href = data.url;
        document.querySelector('.reset-access-token').classList.add('disabled');
        document.querySelector('.settings-group').classList.add('invisible');
    } else {
        document.querySelector('.reset-access-token').classList.remove('disabled');
        document.querySelector('.settings-group').classList.remove('invisible');
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

function onAddDonate(e) {
    e.preventDefault();
    const donateValue = document.querySelector('.input-donate-balance').value;
    if (!donateValue) {
        // todo show error
        return;
    }

    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        const url = tabs[0].url;
        console.log('result url', url);
        chrome.runtime.sendMessage({type: TYPE_SET_DONATE, url, donateValue});
    });
}

function onResetDonate(e) {
    e.preventDefault();

    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        const url = tabs[0].url;
        console.log('result url', url);
        chrome.runtime.sendMessage({type: TYPE_SET_DONATE, url, donateValue: ''});
    });
}

function showDonationAdded(isShow) {
    const addDonate = document.querySelector('.btn-open-donate-modal');
    if (isShow) {
        addDonate.classList.add('donate-added');
        addDonate.classList.remove('donate-not-added');
    } else {
        addDonate.classList.remove('donate-added');
        addDonate.classList.add('donate-not-added');
    }
}

function disableDonationButton(isDisable) {
    document.querySelector('.btn-open-donate-modal').disabled = isDisable;
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

        // todo remove donate icon if site author hasn't donate address (implement audthor donation check)
        // todo disable is already liked
        disableDonationButton(true);

        const inputDonate = document.querySelector('.input-donate-balance');
        if (state.balance && state.balance.balanceWeb) {
            document.querySelector('.user-token-balance').innerText = state.balance.balanceWeb + ' ETH';
            if (!inputDonate.value && Number(state.balance.balanceWeb) > 0) {
                inputDonate.value = Number(state.balance.balanceWeb) / 10;
            }
        }

        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            const url = tabs[0].url;
            if (state.donates[url]) {
                inputDonate.value = state.donates[url]
                showDonationAdded(true);
            } else {
                showDonationAdded(false);
            }
        });
    }
});

/*document.querySelectorAll('.subpage-donate').forEach(item => {
    item.classList.remove('active');
    item.classList.add('inactive');
});*/
document.querySelector('.like').onclick = onLike;
document.querySelector('.reset-access-token').onclick = onResetAccessToken;
document.querySelector('.btn-add-donate').onclick = onAddDonate;
document.querySelector('.btn-reset-donate').onclick = onResetDonate;

setStatus(STATUS_NONE);
chrome.runtime.sendMessage({type: TYPE_GET_STATE});
