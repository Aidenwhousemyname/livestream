"use strict";

var socket = io('/');
var videoGrid = document.getElementById('video-grid');
var myPeer = new Peer(undefined, {
  host: '/',
  port: '3001'
});
var myVideo = document.createElement('video');
myVideo.muted = true;
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(function (stream) {
  addVideoStream(myVideo, stream);
  myPeer.on('call', function (call) {
    //client端進入
    call.answer(stream);
    /*const video = document.createElement('video')
    call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
    })
    call.on('close', () => {    //client離開關畫面
        video.remove()
    })*/
  });
  socket.on('user-connected', function (userId) {
    connectToNewUser(userId, stream);
  });
});
myPeer.on('open', function (id) {
  socket.emit('join-room', ROOM_ID, id);
});
socket.on('user-connected', function (userId) {
  console.log('User connected: ' + userId);
});

function connectToNewUser(userId, stream) {
  //給加入的用戶畫面
  var call = myPeer.call(userId, stream);
  var video = document.createElement('video');
  call.on('stream', function (userVideoStream) {
    addVideoStream(video, userVideoStream);
  });
  call.on('close', function () {
    video.remove();
  });
}

function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', function () {
    video.play();
  });
  videoGrid.append(video);
}