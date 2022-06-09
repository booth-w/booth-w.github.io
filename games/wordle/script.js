let word;
let words;
let rowCurrent;

let client = new XMLHttpRequest();
client.open("GET", "words.txt", false);
client.onreadystatechange = () => {
	words = client.responseText.split("\n");
}
client.send();

// function newWord() {
	word = words[Math.floor(Math.random() * 1000)];
	rowCurrent = 0;
	// $("#table").html("");
	for (let a = 0; a < 6; a++) {
		// $("#table").append("<tr><td class='box'></td><td class='box'></td><td class='box'></td><td class='box'></td><td class='box'></td></tr>");
	}
	$("#answer").css("display", "none");
	$("#textBox").css("display", "inline-block");
	$("#textBox").focus();
// }

// newWord();

function toggleHelp() {
	$(".game").css("filter", "blur(2px)");
	$(".header-container").css("filter", "blur(2px)");
	$(".modal").show();
}

window.onclick = (event) => {
  if (event.target == document.getElementById("modal")) {
		$(".game").css("filter", "none");
		$(".header-container").css("filter", "none");
		$(".modal").hide();
	}
}

$("#textBox").keypress((e) => {
	if (e.which == 13) {
		let text = $("#textBox").val().toLowerCase()
		$("#textBox").val("");
		if (text.length == 5 && words.includes(text)) {
			$('#table tr').each((index, tr) => {
				if (index == rowCurrent) {
					$(tr).find("td").each((index, td) => {
						td.innerHTML = text[index];
						// console.log(text[index]);
						if (text[index] == word[index]) {
							td.style.backgroundColor = "var(--green)";
							$(`#${text[index]}`).css("backgroundColor", "var(--green)")
						} else if (word.split("").includes(text[index])) {
							td.style.backgroundColor = "var(--orange)";
							$(`#${text[index]}`).css("backgroundColor", "var(--orange)")
						} else {
							$(`#${text[index]}`).css("backgroundColor", "black")
						}
					});
					rowCurrent++;
					if (rowCurrent >= 6) {
						$("#textBox").css("display", "none");
						$("#answer tr td").each((i, e) => {
							e.innerHTML = word[i];
						});
						$("#answer").css("display", "table");
					}
					return false;
				}
			});
		} else $("#textBox").val(text);
		return false;
	}
});