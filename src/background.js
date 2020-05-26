console.log('background js here');
chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    var activeTab = tabs[0];
    const url = activeTab.url;
    chrome.tabs.sendMessage(activeTab.id, {"message": "log", "data": "Loaded", tab: activeTab});
});

/*chrome.browserAction.onClicked.addListener(function (tab) {
    // Send a message to the active tab
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        var activeTab = tabs[0];
        const url = activeTab.url;
        chrome.tabs.sendMessage(activeTab.id, {"message": "log", "data": "Hello moto2", tab: activeTab});
        chrome.tabs.sendMessage(activeTab.id, {
            "message": "log",
            "data": chrome.identity.getRedirectURL('test'),
            tab: activeTab
        });
    });
});*/

/*chrome.windows.create({
    'url': './auth.html',
    'width': 454,
    'height': 540,
    'type': 'popup'
});*/
