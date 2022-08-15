const CLIENT_ID = "ab628ca99c214f71a7bfe2d7f64a8224";
let songYears;
let bandCount;

async function getData(token) {
	$("#graphContainer").html("");
	songYears = [];
	bandCount = {};

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

			persentage = Math.round(((a*50)+i)/total*100);
			$("#loadingPersentage").text(persentage);
		}
	}
	drawChart("year");
	$("#loading").hide();
	$("#graphDataType").show();
	$("#graphContainer").show();
}

function drawChart(type) {
	$("#graphContainer").html("");
	let data = [];
	let chart = anychart.column();

	if (type == "year") {
		years = songYears.map(e => e.split("\n").length);
		maxYear = Math.max(...Object.keys(years));
		minYear = Math.min(...Object.keys(years));
		
		for (let a = minYear; a < maxYear+1; a++) {
			data.push({x: a, value: years[a], songs: songYears[a]});
		}

		chart.title("Song release years");
	} else {
		data = Object.entries(bandCount).map((e) => {
			return [e[0], e[1].split("\n").length];
		}).sort((a, b) => {
			return b[1] - a[1];
		});

		chart.title("Band song count");
	}

	chart.container("graphContainer");
	chart.column(data);
	chart.tooltip(true);
	chart.tooltip().format("Number of Songs: {%value}");
	chart.draw();
	hasLoadedData = true;

	chart.listen("pointsSelect", (e) => {
		let songs;
		if (type == "year") {
			songs = e.point.getStat("songs").split("\n").sort();
		} else {
			songs = bandCount[e.point.getStat("x")].split("\n").sort();
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
	$("#songsList").html("");
	drawChart($("#graphDataType").val());
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