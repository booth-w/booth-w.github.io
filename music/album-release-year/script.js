anychart.onDocumentReady(() => {
	fetch("../bands.json")
		.then(response => response.json())
		.then(bands => {
			band = bands
			console.log(bands)
			let data = []

			for (let a = 1960; a < 2023; a++) {
				data.push([a, 0]);
			}
			
			for (let [aKey, aVal] of Object.entries(bands)) {
				for (let [bKey, bVal] of Object.entries(aVal["Discography"]["Albums"])) {
					let year = bKey.slice(-5, -1);
					data[year-1960][1]++;
				}
			}

			let chart = anychart.column();

			chart.title("Album release years");
			chart.container("treeContainer");
			chart.column(data);
			chart.draw();
		});
});