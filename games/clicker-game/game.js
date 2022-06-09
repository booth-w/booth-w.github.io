class Game {
	click() {
		score += cpc;
		clickCount++;
		document.getElementById("score").innerHTML = numeral(score).format("0.00a");

		switch (clickCount) {
			case 100: achivements["clicker_1"]["has"] = true; break;
			case 1000: achivements["clicker_2"]["has"] = true; break;
			case 50000: achivements["clicker_3"]["has"] = true; break;
			case 100000: achivements["clicker_4"]["has"] = true; break;
		}
	}

	upgradeBuy(upgrade) {
		let u = upgrades[upgrade];
		if (score >= u.price) {
			score = Math.round((score -= u.price) * 100) / 100;
			u.count++;
			u.price = Math.round((u.priceBase * 1.15 ** u.count) * 100) / 100;
			document.getElementById(`upgradePrice${upgrade}`).innerHTML = u.price;
			cps = Math.round((cps += u.effect * u.multi) * 100) / 100;
			document.getElementById("cps").innerHTML = cps;
			document.getElementById("score").innerHTML = numeral(score).format("0.00a");
			document.getElementById(`upgradeCount${upgrade}`).innerHTML = u["count"];
		}

		switch (u["count"]) {
			case 1: achivements[`upgrade${upgrade + 1}_0`]["has"] = true; break;
			case 10: achivements[`upgrade${upgrade + 1}_1`]["has"] = true; break;
			case 50: achivements[`upgrade${upgrade + 1}_2`]["has"] = true; break;
			case 100: achivements[`upgrade${upgrade + 1}_3`]["has"] = true; break;
		}
		if (clickCount == 15 && upgrades[4]["count"] >= 1 && !achivements["NeverClick"]["has"]) {
			achivements["NeverClick"]["has"] = true;
		}
	}

	upgradeSBuy(upgrade) {
		let u = upgradesSpecial[upgrade];
		if (!u.has) {
			if (score >= u.price) {
				score = Math.round((score -= u.price) * 100) / 100;
				u.has = true;
				switch (upgrade) {
					case 0:
					case 1: cpc *= 2; break;
					case 2: cps += upgrades[0].effect * upgrades[0].count; upgrades[0].multi++; break;
					case 3: cps += upgrades[1].effect * upgrades[1].count; upgrades[1].multi++; break;
				}
			}
		}
	}
}

class Save {
	save() {
		localStorage.setItem("save", JSON.stringify({
			"score": score,
			"cps": cps,
			"cpc": cpc,
			"clickCount": clickCount,
			"achivements": achivements,
			"upgrades": upgrades,
			"upgrades special": upgradesSpecial
		}));
	}
	load() {
		let storageSave = JSON.parse(localStorage.getItem("save"));
		if (storageSave) {
			score = storageSave["score"];
			cps = storageSave["cps"];
			cpc = storageSave["cpc"];
			clickCount = storageSave["clickCount"];
			achivements = storageSave["achivements"];
			upgrades = storageSave["upgrades"];
			upgradesSpecial = storageSave["upgrades special"];
		} else {
			fetch("info.json")
				.then(response => response.json())
				.then(data => {
					score = data["score"];
					cps = data["cps"];
					cpc = data["cpc"];
					clickCount = data["clickCount"];
					achivements = data["achivements"];
					upgrades = data["upgrades"];
					upgradesSpecial = data["upgrades special"];
				});
			//
		}
	}
	reset() {
		if (confirm("Are you sure?\nThis will reset all progress!")) {
			fetch("info.json")
				.then(response => response.json())
				.then(data => {
					score = data["score"];
					cps = data["cps"];
					cpc = data["cpc"];
					clickCount = data["clickCount"];
					achivements = data["achivements"];
					upgrades = data["upgrades"];
					upgradesSpecial = data["upgrades special"];
				});
			//
		}
	}
}


let score;
let cps;
let cpc;
let clickCount;
let achivements;
let upgrades;
let upgradesSpecial;
let game = new Game();
let save = new Save();

setInterval(() => {
	score = (Math.round((score += cps / 100) * 1000) / 1000);
	document.getElementById("score").innerHTML = numeral(score).format("0.00a");
	document.getElementById("cps").innerHTML = cps;
	let a;
	for (a in upgrades) {
		document.getElementById(`upgradeName${a}`).innerHTML = upgrades[a]["name"];
		document.getElementById(`upgradePrice${a}`).innerHTML = upgrades[a]["price"];
		document.getElementById(`upgradeEffect${a}`).innerHTML = upgrades[a]["effect"];
		document.getElementById(`upgradeCount${a}`).innerHTML = upgrades[a]["count"];
	}
	for (a in achivements) {
		document.getElementById(a).innerHTML = ((achivements[a]["has"]) ? "done" : "lock");
		document.getElementById(`${a} name`).innerHTML = achivements[a]["name"];
		document.getElementById(`${a} desc`).innerHTML = achivements[a]["desc"];
	}
	for (a in upgradesSpecial) {
		document.getElementById(`upgradeS${a}`).innerHTML = ((upgradesSpecial[a]["has"]) ? "done" : (score >= upgradesSpecial[a]["price"]) ? "" : "lock");
		document.getElementById(`upgradeS${a} name`).innerHTML = upgradesSpecial[a]["name"];
		document.getElementById(`upgradeS${a} desc`).innerHTML = upgradesSpecial[a]["desc"];
		document.getElementById(`upgradeS${a} price`).innerHTML = upgradesSpecial[a]["price"];
	}
}, 10);

setInterval(() => {
	save.save();
}, 30000)

window.addEventListener("beforeunload", () => {
	save.save();
}, false);

window.addEventListener("keydown", function (a) {
	if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(a.code)) {
		a.preventDefault();
	}
}, false);
save.load();