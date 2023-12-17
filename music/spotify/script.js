const CLIENT_ID = "ab628ca99c214f71a7bfe2d7f64a8224";
let songYears = [];
let bandCount = [];
let songLength = [];
let lengthFreq = [];
let explicitCount = [];
let classWidth = 20;
let histogramAvarage = false;

async function getData(token) {
	$("#graphContainer").html("");

	let result = await fetch("https://api.spotify.com/v1/me/tracks?limit=1", {
		method: "GET",
		headers: {
			"Authorization": `Bearer ${token}`
		}
	});

	// console.log(await result.json());

	let total = (await result.json())["total"];
	let persentage = 0;
	
	for (let a = 0; a < total/50; a++) {
		let result = await fetch(`https://api.spotify.com/v1/me/tracks?limit=50&offset=${a*50}`, {
			method: "GET",
			headers: {
				"Authorization": `Bearer ${token}`
			}
		});
		
		for (let [i, song] of (await result.json())["items"].entries()) {
			let year = song["track"]["album"]["release_date"].slice(0, 4);
			if (songYears[year]) songYears[year] += `\n${song["track"]["artists"][0]["name"]} – ${song["track"]["name"]}`;
			else songYears[year] = `${song["track"]["artists"][0]["name"]} – ${song["track"]["name"]}`;
			
			let artist = song["track"]["artists"][0]["name"];
			if (bandCount[artist]) bandCount[artist] += `\n${song["track"]["album"]["name"]} – ${song["track"]["name"]}`;
			else bandCount[artist] = `${song["track"]["album"]["name"]} – ${song["track"]["name"]}`;

			let length = song["track"]["duration_ms"];
			songLength[`${song["track"]["artists"][0]["name"]} – ${song["track"]["name"]}`] = length;

			let explicit = song["track"]["explicit"];
			if (explicitCount[explicit]) explicitCount[explicit] += `\n${song["track"]["artists"][0]["name"]} – ${song["track"]["name"]}`;
			else explicitCount[explicit] = `${song["track"]["artists"][0]["name"]} – ${song["track"]["name"]}`;

			persentage = Math.round(((a*50)+i)/total*100);
			$("#loadingPersentage").text(persentage);
		}
	}

	drawChart("years");
	$("#loading").hide();
	$("#graphDataType").show();
	$("#graphContainer").show();
}

function drawChart(type) {
	$("#graphContainer").html("");
	$("#songsList").html("");
	let data = [];
	let chart = anychart.column();

	switch (type) {
		case "years":
			years = songYears.map(e => e.split("\n").length);
			maxYear = Math.max(...Object.keys(years));
			minYear = Math.min(...Object.keys(years));
			
			for (let a = minYear; a < maxYear+1; a++) {
				data.push({x: a, value: years[a], songs: songYears[a]});
			}

			chart.tooltip().format("Number of Songs: {%value}");
			chart.title("Song Release Years");
			break;

		case "bands":
			data = Object.entries(bandCount).map((e) => {
				return [e[0], e[1].split("\n").length];
			}).sort((a, b) => {
				return b[1] - a[1];
			});

			chart.tooltip().format("Number of Songs: {%value}");
			chart.title("Band Song Count");
			break;

		case "length":
			data = Object.entries(songLength).sort((a, b) => {
				return a[1] - b[1];
			});

			chart.yAxis().labels().format(function() {
				return `${Math.floor(this.value/1000/60).toString().padStart(2, "0")}:${Math.floor(this.value/1000%60).toString().padStart(2, "0")}`;
			});
			chart.tooltip().format(function() {
				return `${Math.floor(this.value/1000/60).toString().padStart(2, "0")}:${Math.floor(this.value/1000%60).toString().padStart(2, "0")}`;
			});

			chart.title("Song Length");
			break;

		case "histogram":
			lengthFreq = [];
			for (let [i, a] of Object.entries(Object.entries(songLength).sort((a, b) => {return a[1] - b[1]}))) {
				let index = Math.floor(a[1]/1000/classWidth);
				if (lengthFreq[index]) lengthFreq[index] += `\n${a[0]}`;
				else lengthFreq[index] = a[0];
			}

			for (let a = 0; a < lengthFreq.length; a++) {
				if (lengthFreq[a]) {
					data.push({x: `${Math.floor(a*classWidth/60).toString().padStart(2, "0")}:${Math.floor(a*classWidth%60).toString().padStart(2, "0")}`, value: lengthFreq[a].split("\n").length, songs: lengthFreq[a]});
				} else {
					data.push({x: `${Math.floor(a*classWidth/60).toString().padStart(2, "0")}:${Math.floor(a*classWidth%60).toString().padStart(2, "0")}`, value: undefined, songs: undefined});
				}
			}

			dataAvarage = [];
			for (let a = 0; a < data.length; a++) {
				let sum = 0;
				let count = 0;
				for (let b = -1; b < 2; b++) {
					if (data[a+b]) {
						if (data[a+b].value) {
							sum += data[a+b].value;
							count++;
						}
					}
				}
				dataAvarage.push({x: data[a].x, value: sum/count, songs: data[a].songs});
			}

			chart.tooltip().format("Number of Songs: {%value}");
			chart.title(`Song Length Histogram: Class Width = ${classWidth} seconds ${histogramAvarage ? "(3-point Moving Avarage)" : ""}`);
			break;
		
		case "explicit":
			data = Object.entries(explicitCount).map((e) => {
				return {x: e[0] == "true" ? "Explicit" : "Not Explicit", value: e[1].split("\n").length, songs: e[1]}
			});

			chart.tooltip().format("Number of Songs: {%value}");
			chart.title("Explicit Lyrics Count");
			break;
	}

	chart.container("graphContainer");
	if (type == "histogram" && histogramAvarage) chart.column(dataAvarage);
	else chart.column(data);
	chart.tooltip(true);
	chart.draw();

	chart.listen("pointsSelect", (e) => {
		let songs;
		switch (type) {
			case "years": songs = e.point.getStat("songs").split("\n").sort(); break;
			case "bands": songs = bandCount[e.point.getStat("x")].split("\n").sort(); break;
			case "length": break;
			case "histogram": if (histogramAvarage) break; else songs = lengthFreq[(parseInt(e.point.getStat("x").split(":")[0]*60) + parseInt(e.point.getStat("x").split(":")[1]))/classWidth].split("\n").sort(); break;
			case "explicit": songs = e.point.getStat("songs").split("\n").sort(); break;
		}

		$("#songsList").html("");
		for (let a of songs) {
			$("#songsList").append(a, "<br>");
		}
	});
}

$("#loginButton").click(() => {
	let scopes = ["user-library-read"];
	let redirectURL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&show_dialog=true&redirect_uri=${encodeURIComponent(location.href+"callback.html")}&scope=${encodeURIComponent(scopes.join(" "))}&response_type=token`;
	window.open(redirectURL, "");
	$("#loginButton").hide();
});

$("#graphDataType").on("change", () => {
	if ($("#graphDataType").val() == "histogram") {
		$("#classWidthSlider").show();
		$("#histogramToggle").show();
	} else {
		$("#classWidthSlider").hide();
		$("#histogramToggle").hide();
	}

	drawChart($("#graphDataType").val());
});

$("#classWidthSlider").on("input", () => {
	classWidth = $("#classWidthSlider").val();
	$("#classWidth").html(classWidth);
	drawChart("histogram");
});

$("#histogramToggle").on("change", () => {
	histogramAvarage = $("#histogramToggle").prop("checked");
	drawChart("histogram");
});

window.addEventListener("message", (e) => {
	let hash = JSON.parse(e.data);
	if (hash.type == "access_token") {
		let token;
		((token_ = hash.access_token) => {
			token = token_;
			return $.ajax({
				url: "https://api.spotify.com/v1/me",
				headers: {
					"Authorization": `Bearer ${token}`
				}
			});
		})().then(() => {
			$(".body").show();
			getData(token);
		});
	}
}, false);