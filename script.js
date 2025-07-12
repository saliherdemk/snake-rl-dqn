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

function toggleButtons(rlMode) {
	const buttonIds = [
		"save-button",
		"load-button",
		"load-pretrained",
		"train",
	];
	buttonIds.forEach((buttonId) => {
		document.getElementById(buttonId).disabled = rlMode == "train";
	});
}

document.getElementById("load-button").addEventListener("click", (event) => {
	document.getElementById("load-input").click();
});

document.getElementById("load-input").addEventListener("change", (event) => {
	const file = event.target.files[0];
	if (!file) return;

	const reader = new FileReader();
	reader.onload = function (e) {
		try {
			const json = JSON.parse(e.target.result);
			env.load(json);
		} catch (err) {
			alert("Invalid JSON file." + err);
		}
	};
	reader.readAsText(file);
});

document.getElementById("mode-toggle").onclick = () => {
	const rlMode = env.toggleMode();
	toggleButtons(rlMode);
};

document.getElementById("save-button").onclick = () => {
	const m = env.save();
	const json = JSON.stringify(m);
	saveAsJson(json);
};

document.getElementById("load-pretrained").onclick = () => {
	env.load(preTrainedModel);
};

document.getElementById("train").onclick = () => {
	train();
};

document.getElementById("start-vs").onclick = () => {
	game.start();
	env.startGame();
};

document.getElementById("restart-vs").onclick = () => {
	game.initialize();
	env.reset();
};

function train() {
	const trainEnv = new SnakeEnv(null);

	let i = trainEnv.getEpisodeCount();
	while (i < 3000) {
		trainEnv.train();
		i = trainEnv.getEpisodeCount();
		console.log(i);
	}
	const m = trainEnv.save();
	const json = JSON.stringify(m);
	saveAsJson(json);
}
