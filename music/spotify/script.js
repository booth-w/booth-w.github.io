let CLIENT_ID = "ab628ca99c214f71a7bfe2d7f64a8224";
let token;
let yearsSongs;
let yaers;

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

let hasLoadedChart = false;
async function getLikedSongs(token) {
	years = [];
	yearsSongs = [];

	let result = await fetch(`https://api.spotify.com/v1/me/tracks?limit=1`, {
		method: 'GET',
		headers: {
			"Authorization": `Bearer ${token}`
		}
	}).catch(() => {
		alert("Token has expired.")
	});

	let total = (await result.json())["total"];
	
	for (let a = 0; a < total/50; a++) {
		let result = await fetch(`https://api.spotify.com/v1/me/tracks?limit=50&offset=${a*50}`, {
			method: 'GET',
			headers: {
				"Authorization": `Bearer ${token}`
			}
		});
		
		for (let song of (await result.json())["items"]) {
			let year = song["track"]["album"]["release_date"].slice(0, 4);
			if (yearsSongs[year]) yearsSongs[year] += `\n${song["track"]["name"]}`;
			else yearsSongs[year] = song["track"]["name"];
			if (years[year]) years[year]++;
			else years[year] = 1;
		}
	}
	
	let maxYear = Math.max(...Object.keys(years));
	let minYear = Math.min(...Object.keys(years));
	let data = [];
	
	for (let a = minYear; a < maxYear+1; a++) {
		// data.push([a, years[a]]);
		data.push({x: a, value: years[a], songs: yearsSongs[a]})
	}
	// data = data.mapAs({songs: yearsSongs[id]});
	
	let chart = anychart.column();
	chart.title("Song release years");
	chart.container("graphContainer");
	chart.column(data);
	chart.tooltip(true);
  chart.tooltip().format("Number of Songs: {%value}\n\nSongs: {%songs}");
	chart.draw();
	hasLoadedChart = true;
	$("#loading").hide();
}

let scopes = [
	"ugc-image-upload",
	"playlist-modify-public",
	"user-library-read"
]

$("#loginButton").click(() => {
	let redirectURL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent("http://127.0.0.1:5500/music/spotify/callback.html")}&scope=${encodeURIComponent(scopes.join(" "))}&response_type=token`
	window.open(redirectURL, "");
});

window.addEventListener("message", (e) => {
	$(".login-button").hide();
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
			$(".body").show();
		});
	}
}, false);

$("#textBox").keypress((e) => {
	if (e.which == 13) {
		songs = [];
		for (a of $("#textBox").val().split(" ")) {
			(async () => {
				let song = await getSong(token, a)
				songs.push(song.name);
			})();
		}
		console.log(songs);
		$("#textBox").val("");
	}
});

function selectChange() {
	$(".body-content").children().hide();
	let target;
	switch ($("#options").val()) {
		case "createPlaylist": target = "#playlist"; break;
		case "likedSongsYears": target = "#songYears"; if (!hasLoadedChart) getLikedSongs(token); break;
	}
	$(target).show();
}

// $(".login-button").hide();
// $(".body").show();

$(".body-content").children().hide();