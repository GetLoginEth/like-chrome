chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    var activeTab = tabs[0];
    const url = activeTab.url;
    chrome.tabs.sendMessage(activeTab.id, {"message": "log", "data": "Loaded", tab: activeTab});
});

chrome.browserAction.onClicked.addListener(function (tab) {
    // Send a message to the active tab
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        var activeTab = tabs[0];
        const url = activeTab.url;
        chrome.tabs.sendMessage(activeTab.id, {"message": "log", "data": "Hello moto2", tab: activeTab});
    });
});
