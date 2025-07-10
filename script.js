function updateEpisodeLabel(value) {
	document.getElementById("episode-counter").innerText = value;
}

function changeModeButtonText(value) {
	document.getElementById("mode-toggle").innerText = value;
}

function saveAsJson(data) {
	const blob = new Blob([data], { type: "application/json" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = "data.json";
	a.click();
	URL.revokeObjectURL(url);
}

document.getElementById("load-button").addEventListener("change", (event) => {
	const file = event.target.files[0];
	if (!file) return;

	const reader = new FileReader();
	reader.onload = function (e) {
		try {
			const json = JSON.parse(e.target.result);
			env.agent.load(json);
		} catch (err) {
			alert("Invalid JSON file." + err);
		}
	};
	reader.readAsText(file);
});

document.getElementById("mode-toggle").onclick = () => {
	env.toggleMode();
};

document.getElementById("save-button").onclick = () => {
	const m = env.agent.model.save();
	const json = JSON.stringify(m);
	saveAsJson(json);
};
