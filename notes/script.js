fetch("notes.json")
	.then(response => response.json())
	.then(data => {
		let toAppend = "";
		const iterate = (obj) => {
			Object.keys(obj).forEach(key => {
				if (typeof obj[key] == "object") {
					toAppend += `<li><span class="arrow">${key}</span>`;
				} else toAppend += `<li>${obj[key]}</li>`;
				if (typeof obj[key] == "object" && obj[key] != null) {
					toAppend += "<ul class='nested'>";
					iterate(obj[key]);
					toAppend += "</ul></li>";
				}
			})
		}
		
		iterate(data);
		$("#notes").append(toAppend);
	})
//

$(document).delegate(".arrow", "click", function () {
	$(this).siblings().toggleClass("active");
	$(this).toggleClass("arrow-down");
});

let isAllOpen = false;

$(document).keypress((e) => {
	if (e.key == "1") {
		if (!isAllOpen) {
			$(".nested").addClass("active");
			$(".arrow").addClass("arrow-down");
			isAllOpen = true;
		} else {
			$(".nested").removeClass("active");
			$(".arrow").removeClass("arrow-down");
			isAllOpen = false;
		}
	}
})
