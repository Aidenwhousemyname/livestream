const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined, {
    host: '/',
    port: '3001'
})
const myVideo = document.createElement('video')
let videoon = null
myVideo.muted = true
const peers = {}
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    videoon = stream
    console.log(stream)
    addVideoStream(myVideo, videoon)

    myPeer.on('call', call => {
        call.answer(videoon) //用戶回傳他們的畫面
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })

    socket.on('user-connected', userId => {
        connectToNewUser(userId, videoon) //只發送給新用戶
        console.log('User connected', userId)
    })
})

socket.on('user-disconnected', userId => {
    if (peers[userId]) peers[userId].close()
    console.log('User disconnected', userId)
})

myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, videoon) {
    const call = myPeer.call(userId, videoon)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
        console.log('client cam', userId)
    })
    call.on('close', () => {
        video.remove()
    })

    peers[userId] = call
}

function addVideoStream(video, videoon) { //新增我們的畫面
    video.srcObject = videoon
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)
}


//----------------------登入面------------------------
let log_btn = document.getElementById("login-btn");
let login_input = document.getElementById("loginName");
let user = null;
let nickname = null;
log_btn.addEventListener('click', () => {
    nickname = login_input.value;
    if (nickname === '') {
        confirm('請輸入正確的暱稱')
    } else {
        user = nickname;
        $('.control1').show('slow');
        $('.control2').hide('slow');
        $('.chat-wrap').show('slow');
        $('.screen').show('slow');
        $('.stream').show('slow');
        $('.login-wrap').hide('slow');
    }
});

//----------------------聊天室------------------------

let chat_btn = document.getElementById("chat-send");
let chat_input = document.getElementById("chat-input");
// var nickname = prompt("請輸入暱稱", "");
// while (nickname === '') {
//   nickname = prompt("請輸入正確的暱稱", "");
// }
// var user = nickname;

function sendMessage() {
    let message = chat_input.value;
    if (message != '') {
        socket.emit('new-chat', nickname, message);
        chat_input.value = '';
        console.log(nickname)
        console.log(user)
    } //傳送message到server
}
//鍵盤事件
socket.on('chatroom-refresh', (nickname, message) => {
    let chatroom = document.getElementById("chatroom");
    let container = document.createElement('div');

    if (nickname != user) {
        container.className = "mes-c";
        container.innerText = nickname + ' ' + ':' + ' ' + message;
    } else {
        container.className = "mes-s";
        container.innerText = 'You' + ' ' + ':' + ' ' + message;

    }
    chatroom.append(container);
}); //server確認完發送到聊天室內


//----------------------控制區------------------------
//鏡頭
let cam_btn = document.getElementById("clscam");
cam_btn.addEventListener('click', (roomId, userId) => {
    for (let index in videoon.getVideoTracks()) {
        videoon.getVideoTracks()[index].enabled = !videoon.getVideoTracks()[index].enabled
    }
})

//聲音
let aud_btn = document.getElementById("clssound");
aud_btn.addEventListener('click', (roomId, userId) => {
    for (let index in videoon.getAudioTracks()) {
        videoon.getAudioTracks()[index].enabled = !videoon.getAudioTracks()[index].enabled
    }
});

//音樂
let music_btn = document.getElementById("playmusic");
let musicc = 1;
const music = new Audio('Bad Style Time Back.mp3');

music_btn.addEventListener('click', () => {

    if (musicc === 1) {
        socket.emit('play');
        musicc = 0;
        console.log(musicc)
        music.play();
    } else {
        socket.emit('stop');
        musicc = 1;
        console.log(musicc)
        music.pause();
    }
});
//-----------------------------------------------------------------------------