let mediaStream;
let recording = false;
let mediaRecorder;
let recordedBlobs;
function handleDataAvailable(e) {
	if (e.data && e.data.size > 0) {
		recordedBlobs.push(e.data);
		console.log(e.data);
	}
}
function handleStop() {
	console.log("handle stop");
}
function download() {
	let blob = new Blob(recordedBlobs, {type: 'audio/mp3'});
	let url = window.URL.createObjectURL(blob);
	//console.log(blob, url);
	var a = document.createElement('a');
	a.style.display = 'none';
	a.href = url;
	a.download = 'test.mp3';
	document.body.appendChild(a);
	a.click();
	setTimeout(function() {
		document.body.removeChild(a);
		window.URL.revokeObjectURL(url);
	}, 100);
}
function startRecording() {
	recordedBlobs = [];
	mediaRecorder = new MediaRecorder(window.stream, {audio: true, video: false});
	mediaRecorder.onstop = handleStop;
	mediaRecorder.ondataavailable = handleDataAvailable;
	mediaRecorder.start(10);
}
function stopRecording() {
	mediaRecorder.stop();
	console.log(recordedBlobs);
	download();
}
chrome.browserAction.onClicked.addListener(function() {
	if (recording) {
		stopRecording();
		recording = false;
	}
	else {
		chrome.tabCapture.capture({audio: true, video: false}, function(strem) {
			mediaStream = strem;
			window.stream = strem;
			startRecording();
			recording = true;
		});
	}
});