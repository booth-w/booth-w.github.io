let data = [];
fetch("tree.json")
	.then(response => response.json())
	.then(dataJSON => {
		obj = dataJSON;
		dataNew = "[";
		loopCount = 0
		const iterate = (obj, lastLength) => {
			loopCount++;
			Object.keys(obj).forEach(key => {
				if (!Array.isArray(obj)) {
					dataNew += `{"value": "${key}", "children": [`;
				} else {
					dataNew += `{"value": "${obj[key]}"}`;
					// debugger;
					if (key == lastLength-1) {
						dataNew += "]";
					} else {
						dataNew += ",";
					}
				}
		
				if (typeof obj[key] == "object" && obj[key] != null) {
					iterate(obj[key], obj[key].length);
				} else if (obj[key].length == 1) {
					dataNew += `{"value": ${obj[key]}}]},`;
				} else {
					console.log(1);
					dataNew += `{"value": ${obj[key]}, "children": [`;
					iterate(obj[key], obj[key].length);
				}
			})
		}
			
		iterate(obj);
		// dataNew = dataNew.slice(0, -1);
		dataNew += "]}]";
		console.log(dataNew);
		data = JSON.parse(dataNew);
		console.log(data);
		

		let chart = anychart.wordtree(data, "as-tree");
		chart.container("treeContainer");
		chart.draw();
	//
});