var yarnTextField;
var displayArea;
var dialogue;
var dialogueIterator;
var optNum = 0;
var iter;

var remote = require('electron').remote;
var {dialog} = require('electron').remote;
var fs = require('fs');

function runYarn(yarndata, node) {
	displayArea.innerHTML = "";

	dialogue = new bondage.Runner();
	dialogue.load(yarndata);

	dialogueIterator = dialogue.run(node);
	step();
}

function setVar(name, val) {
	dialogue.variables.data[name] = val;
	console.log(dialogue.variables.data);
}

function displayVars() {
	var vars = dialogue.variables.data;
	var keys = Object.keys(vars);
	$("#vardisplay").empty();
	for (var i = 0; i < keys.length; i++) {
		var key = keys[i];
		$("#vardisplay").append("<br>" + key + ":<input class=\"varfield\" type=\"text\" name=\"" + key + "\" value=\"" + vars[key] + "\">");
	}
	$(".varfield").change(function () {
		var val = $(this).val().trim();
		if (val.match(/^(true|false|[0-9.]+)$/)) {
			val = JSON.parse($(this).val());
		}
		setVar($(this).attr("name"), val);
	});
}

function displayVisited() {
	var visited = Object.keys(dialogue.visited);
	$("#visiteddisplay").empty();
	for (var i = 0; i < visited.length; i++) {
		var key = visited[i];
		$("#visiteddisplay").append("<br>" + key);
	}
}

function step() {
	// Steps until an options result
	iter = dialogueIterator.next();

	displayVars();
	displayVisited();
	while (!iter.done) {
		var result = iter.value;
		if (result instanceof bondage.OptionResult) {
			showOptions(result);
			break;
		} else {
			displayArea.innerHTML += result.text + "<br/>";
		}
		iter = dialogueIterator.next();
	}
	displayVars();
}

function selectOption(j, i) {
	iter.value.select(i);
	optNum++;
	displayArea.innerHTML = "";
	step();
	return;
}

function showOptions(result) {
	displayArea.innerHTML += "<br/>";
	for (var i = 0; i < result.options.length; i++) {
		var optionId = "opt" + optNum + "-" + i;
		displayArea.innerHTML += "<a href=\"#\" id=\"" + optionId + "\" onClick=\"selectOption(" + optNum + "," + i + ");return false;\">" + result.options[i] + "</input><br/>";

		var got = document.getElementById(optionId);

	}
	displayArea.innerHTML += "<br/><br/>";

}

function loadFromField() {
	var yarnData = jsonifyYarn(document.getElementById("input-area").value);
	console.log(yarnData);
	runYarn(yarnData, yarnData[0].title);
}

window.onload = function () {
	displayArea = document.getElementById("display-area");
};

function jsonifyYarn(yarntext) {
	var nodes = [];
	var w = yarntext.split("\n===\n");
	for (var i = 0; i < w.length; i++) {
		var node = {};
		var x = w[i].split("\n---\n");
		node["body"] = x[1];
		var attrs = x[0].split("\n");
		for (var j = 0; j < attrs.length; j++) {
			var bits = attrs[j].split(":");
			if (bits.length == 2) {
				node[bits[0]] = bits[1].trim();
			} else {
				console.warn("node attributes in weird format:");
			}
		}
		nodes.push(node);
	}
	return nodes;
}


function onSaveAsClick() {
	// You can obviously give a direct path without use the dialog (C:/Program Files/path/myfileexample.txt)
	dialog.showSaveDialog(
		{
			title: "Save Yarn File",
			showTagsField: false,
			
		},
		(fileName) => {
		if (fileName === undefined){
			console.log("You didn't save the file");
			return;
		}

		content = $("#input-area").val();

		// fileName is a string that contains the path and filename created in the save file dialog.  
		fs.writeFile(fileName, content, (err) => {
			if(err){
				alert("An error ocurred creating the file "+ err.message)
			}
						
			alert("The file has been succesfully saved");
		});
	});
}

function onOpenClick() {
	dialog.showOpenDialog((fileNames) => {
		// fileNames is an array that contains all the selected
		if(fileNames === undefined || fileNames.length < 1){
			console.log("No file selected");
			return;
		}

		fs.readFile(fileNames[0], 'utf-8', (err, data) => {
			if(err){
				alert("An error ocurred reading the file :" + err.message);
				return;
			}
	
			// Change how to handle the file content
			console.log("The file content is : " + data);

			$("#input-area").val(data);
		});
	});
}

$(document).ready(function () {
	$("#btnRun").click(loadFromField);
	$("#btnOpen").click(onOpenClick);
	$("#btnSaveAs").click(onSaveAsClick);
 });