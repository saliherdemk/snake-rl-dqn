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

document.getElementById("load-pretrained").onclick = () => {
	env.agent.load(preTrainedModel);
};

document.getElementById("train").onclick = () => {
	train();
};

function train() {
	const trainEnv = new SnakeEnv(null);

	let i = trainEnv.getEpisodeCount();
	while (i < 1000) {
		trainEnv.train();
		i = trainEnv.getEpisodeCount();
		console.log(i);
	}
	const m = trainEnv.agent.model.save();
	const json = JSON.stringify(m);
	saveAsJson(json);
}
