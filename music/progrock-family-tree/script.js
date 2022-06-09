let chart;
let edgesDefault;
let edges = [];
let nodes = [];
let stop = 0;

anychart.onDocumentReady(() => {
	fetch("../bands.json")
		.then(response => response.json())
		.then(bands => {
			let members = [];
			let memberSelected = "";
			
			for (let band in bands) {
				hasConnections = false;
				nodes.push({ id: band, members: ""});
				for (let member of bands[band]["Members"]) {
					nodes[nodes.length-1]["members"] += "\n" + member;
					for (let bandOther in bands) {
						if (band != bandOther && bands[bandOther]["Members"].includes(member)) {
							let index = -1;
							let e;
							hasConnections = true;
							for (e of edges) {
								if (e["from"] == band && e["to"] == bandOther || e["from"] == bandOther && e["to"] == band) {
									index = edges.indexOf(e);
									break;
								}
							}
							if (!edges[index]) edges.push({ from: band, to: bandOther, member: member });
							else if (!e["member"].split("\n").includes(member)) e["member"] += "\n" + member;
						}
					}
					if (!members.includes(member) && hasConnections) members.push(member);
				}
				if (!hasConnections) nodes.pop();
			}
			members.sort();

			nodesDefault = JSON.parse(JSON.stringify(nodes));
			edgesDefault = JSON.parse(JSON.stringify(edges));
			
			chart = anychart.graph({ nodes, edges });
			let chartNodes = chart.nodes();

			chartNodes.normal().height(15);
			chart.layout().iterationCount(0);
			chart.title("Progrock Family Tree");
			chart.container("treeContainer");
			chart.interactivity().hoverGap(5);
			chart.interactivity().zoomOnMouseWheel(false);
			chart.nodes().labels().enabled(true);
			chart.nodes().labels().format("{%id}");
			chart.nodes().tooltip().format("{%id}:\n{%members}");
			chart.nodes().labels().fontSize(10);
			chart.nodes().labels().fontWeight(600);
			chart.edges().tooltip().format("{%member}");
			chart.draw();

			for (let member of members) {
				$("#membersDropdown").append(`<option value="${member}">${member}</option>`)
			}
			for (let a of nodes) {
				band = a["id"];
				$("#startDropdown").append(`<option value="${band}">${band}</option>`)
				$("#endDropdown").append(`<option value="${band}">${band}</option>`)
			}
			
			$("#membersDropdown").selectize({ sortField: "text" });
			$("#startDropdown").selectize({ sortField: "text" });
			$("#endDropdown").selectize({ sortField: "text" });

			$("#loading").hide();
			$(".body").show();
		});
	//
});

function memberHighlight() {
	let member = $("#membersDropdown").val();
	nodes = JSON.parse(JSON.stringify(nodesDefault));
	if (member != "") {
		nodes = nodes.map((e) => {
			if (e["members"] && e["members"].split("\n").includes(member)) {
				e["normal"] = {"fill": "#FF0000"};
			}
			return e;
		})
	}
	chart.data({ nodes, edges });
}

function connectBands() {
	start = $("#startDropdown").val();
	end = $("#endDropdown").val();

	if (start && end) {
		let search = [];
		search.push(start);

		let visited = {};
		visited[start] = true;

		let parent = {};
		parent[start] = start;

		let distence = {};
		distence[start] = 0;
		
		while (search.length) {
			let node = search.shift();
			let connected = [];
			for (let e of edges) {
				if (e["from"] == node) connected.push(e["to"]);
				else if (e["to"] == node) connected.push(e["from"]);
			}
	
			for (let a of connected) {
				if (!visited[a]) {
					visited[a] = true;
					parent[a] = node;
					search.push(a);
					distence[a] = distence[node]+1
				}
			}
		}

		let path = [end];
		let current = end;
		while (current != start) {
			current = parent[current];
			path.push(current);
		}
		path.reverse();
		console.log(path);
		nodes = JSON.parse(JSON.stringify(nodesDefault));
		nodes = nodes.map((e) => {
			if (path.includes(e["id"])) {
				e["normal"] = {"fill": "#FF0000"}
			}
			return e;
		});
		edges = JSON.parse(JSON.stringify(edgesDefault));
		for (let p = 0; p < path.length-1; p++) {
			edges = edges.map((e) => {
				try {
					if (e["from"] == path[p] && e["to"] == path[p+1] || e["from"] == path[p+1] && e["to"] == path[p]) {
						e["normal"] = {"stroke": "#FF0000"};
					}
				} catch {}
				return e;
			});	
		}
		let a = Object.keys(distence)[Object.values(distence).indexOf((Math.max(...Object.values(distence))))];
		console.log(a, distence[a]);
		chart.data({ nodes, edges });
	}
}

$("input[name='searchType']").click(() => {
	$(`#${$("input[name='searchType']:checked").val()}`).show();
	$(`#${$("input[name='searchType']:not(:checked)").val()}`).hide();
	nodes = JSON.parse(JSON.stringify(nodesDefault));
	edges = JSON.parse(JSON.stringify(edgesDefault));
	chart.data({ nodes, edges });
});

// https://docs.anychart.com/Basic_Charts/Network_Graph#edges