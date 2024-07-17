document.getElementById("create-note")?.addEventListener("click", () => {
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		if (tabs[0].id) {
			chrome.scripting.executeScript({
				target: { tabId: tabs[0].id },
				func: () => {
					const note = {
						id: new Date().toISOString(),
						content: "",
						x: 100,
						y: 100,
					};
					chrome.runtime.sendMessage({ action: "saveNote", note: note }, () => {
						location.reload();
					});
				},
			});
		}
	});
});
