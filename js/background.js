"use strict";
chrome.action.onClicked.addListener(() => {
    chrome.windows.create({
        url: chrome.runtime.getURL("floating.html"),
        type: "popup",
        width: 400,
        height: 300,
    });
});
