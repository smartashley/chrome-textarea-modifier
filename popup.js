const modifyButton = document.getElementById("modify");
const changeButton = document.getElementById("change");
const publishButton = document.getElementById("publish");
const siteUrl = document.getElementById("input");
const originText = document.getElementById("originText");
const replaceText = document.getElementById("replaceText");

function setButtonStatus(status) {
  changeButton.disabled = status;
  modifyButton.disabled = status;
}

[siteUrl, originText, replaceText].forEach((element) => {
  element.addEventListener("input", () => {
    if (siteUrl.value && originText.value && replaceText.value) {
      setButtonStatus(false);
    } else {
      setButtonStatus(true);
    }
  });
});

modifyButton.addEventListener("click", () => {
  chrome.tabs.query({ url: [siteUrl.value] }, (tabs) => {
    tabs.forEach((tab) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tab.id },
          func: () => {
            document.querySelector("nav.tabs li:nth-child(2) a").click();
          },
        },
        () => {
          if (chrome.runtime.lastError) {
            console.error(`Error executing script on tab ${tab.id}: ${chrome.runtime.lastError.message}`);
          } else {
            console.log(`Script executed successfully on tab ${tab.id}`);
          }
        }
      );
    });
  });
});
function changeText(originText, replaceText) {
  const wrappers = document.querySelectorAll(".form-textarea-wrapper");

  wrappers.forEach((wrapper) => {
    const textarea = wrapper.querySelector(".js-text-full");

    if (textarea) {
      const originalValue = textarea.getAttribute("data-editor-value-original");

      if (originalValue && originalValue.includes(originText)) {
        const sourceButton = wrapper.querySelector(".ck-source-editing-button");

        if (sourceButton) {
          sourceButton.click();

          const activeTextarea = document.activeElement;
          if (activeTextarea) {
            let value = activeTextarea.value;
            const reg = new RegExp(originText, "g");
            value = value.replace(reg, replaceText);

            activeTextarea.value = value;

            activeTextarea.dispatchEvent(new Event("input", { bubbles: true }));
            activeTextarea.dispatchEvent(new Event("change", { bubbles: true }));

            const logTextArea = document.querySelector("textarea[name='revision_log[0][value]']");
            if (logTextArea) {
              logTextArea.value = "Update GCMA";
            }

            document.querySelector("#edit-submit").click();
          }
        }
      }
    }
  });
}

changeButton.addEventListener("click", () => {
  chrome.tabs.query({ url: [siteUrl.value] }, (tabs) => {
    tabs.forEach((tab) => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: changeText,
        args: [originText.value, replaceText.value],
      });
    });
  });
});

publishButton.addEventListener("click", () => {
  document.querySelector(".entity-moderation-form select").value = "published";
  document.querySelector("#edit-submit").click();
});
