let CLIENT_ID = "ab628ca99c214f71a7bfe2d7f64a8224";
let token;
let songYears;
let bandCount;

// https://stackoverflow.com/questions/29400426/where-do-i-persist-the-spotify-access-token

async function getSong(token, song) {
	let result = await fetch(`https://api.spotify.com/v1/search?q=${song}&type=track&limit=1`, {
		method: 'GET',
		headers: {
			"Authorization": `Bearer ${token}`
		}
	});
	
	let data = await result.json();
	return data.tracks.items[0];
}

async function getData(token) {
	$("#graphContainer").html("");
	songYears = [];
	bandCount = {};

	let result = await fetch(`https://api.spotify.com/v1/me/tracks?limit=1`, {
		method: 'GET',
		headers: {
			"Authorization": `Bearer ${token}`
		}
	}).catch(() => {
		alert("Token has expired");
	});

	let total = (await result.json())["total"];
	let persentage = 0;
	
	for (let a = 0; a < total/50; a++) {
		let result = await fetch(`https://api.spotify.com/v1/me/tracks?limit=50&offset=${a*50}`, {
			method: 'GET',
			headers: {
				"Authorization": `Bearer ${token}`
			}
		});
		
		for (let [i, song] of (await result.json())["items"].entries()) {
			let year = song["track"]["album"]["release_date"].slice(0, 4);
			if (songYears[year]) songYears[year] += `\n${song["track"]["name"]}`;
			else songYears[year] = song["track"]["name"];
			
			let artist = song["track"]["artists"][0]["name"];
			if (bandCount[artist]) bandCount[artist]++;
			else bandCount[artist] = 1;

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
		data = Object.entries(bandCount).sort((a, b) => {
			return b[1] - a[1];
		});

		chart.title("Band song count");
	}

	chart.container("graphContainer");
	chart.column(data);
	chart.tooltip(true);
	// chart.tooltip().format("Number of Songs: {%value}\n\nSongs: {%songs}");
	chart.tooltip().format("Number of Songs: {%value}");
	chart.draw();
	hasLoadedData = true;
}

let scopes = [
	"user-library-read"
];

$("#loginButton").click(() => {
	let redirectURL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&show_dialog=true&redirect_uri=${encodeURIComponent("http://127.0.0.1:5500/music/spotify/callback.html")}&scope=${encodeURIComponent(scopes.join(" "))}&response_type=token`;
	window.open(redirectURL, "");
});

$("#graphDataType").on("change", () => {
  drawChart($("#graphDataType").val());
});

window.addEventListener("message", (e) => {
	let hash = JSON.parse(e.data);
	if (hash.type == "access_token") {
		((token_ = hash.access_token) => {
			token = token_;
			return $.ajax({
				url: "https://api.spotify.com/v1/me",
				headers: {
					"Authorization": `Bearer ${token}`
				}
			});
		})().then((responce) => {
			$("#accountButton").text("Logout");
			$(".body").show();
			getData(token);
		});
	}
}, false);