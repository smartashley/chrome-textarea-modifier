chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "modifyTextareas") {
    let textareas = document.getElementsByTagName('textarea');
    for (let textarea of textareas) {
      textarea.value = "Modified by Chrome extension!";
    }
  }
});