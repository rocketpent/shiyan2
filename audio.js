var playPause=document.getElementsByClassName('playPause')[0];
var audio = document.getElementById('audioTag');
var recordImg = document.getElementById('record-img');
var body = document.body;
var beforeMusic = document.getElementsByClassName('beforeMusic')[0]
var nextMusic = document.getElementsByClassName('nextMusic')[0]
var playMode = document.getElementsByClassName('playMode')[0]
var volume = document.getElementsByClassName('volumn')[0]
var volumeTogger = document.getElementById('volumn-togger');
var speed = document.getElementById('speed');
// 歌曲名词数组
var musicData = [
    ['落春赋','郑佳源'],
    ['Yesterday','Alok/Sofi Tukker'],
    ['江南烟雨色','杨树人'],
    ['Vision pt.II','Vicetone'],
];

var musicId = 0;
var musicTitle = document.getElementsByClassName('music-title')[0];
var authorName = document.getElementsByClassName('author-name')[0];
var playedTime = document.getElementsByClassName('played-time')[0];
var totleTime = document.getElementsByClassName('audio-time')[0];
var progressPlay = document.getElementsByClassName('progress-play')[0]
var closeContainer = document.getElementsByClassName('close-container')[0]
var listContainer = document.getElementsByClassName('list-container')[0]
var listIcon = document.getElementById('list')
var musicLists = document.getElementsByClassName('musicLists')[0];

function initMusic() {
    audio.src = `./mp3/music${musicId}.mp3`;
    audio.load();
    recordImg.classList.remove('rotate-play');
    audio.onloadedmetadata = function() {
        recordImg.style.backgroundImage = `url('img/record${musicId}.jpg')`;
        body.style.backgroundImage = `url('img/bg${musicId}.png')`;
        musicTitle.innerText = musicData[musicId][0]
        authorName.innerText = musicData[musicId][1]
        refreshRotate();
        totleTime.innerText = formatTime(audio.duration);
        audio.currentTime = 0;
    }
}
initMusic();

function initAndPlay() {
    initMusic();
    rotateRecord();
    audio.play();
    playPause.classList.remove('icon-play')
    playPause.classList.add('icon-pause')
}

playPause.addEventListener('click',function() {
    if(audio.paused) {
        audio.play();
        rotateRecord();
        playPause.classList.remove('icon-play')
        playPause.classList.add('icon-pause')
    } else {
        audio.pause();
        rotateRecordStop();
        
        playPause.classList.remove('icon-pause')
        playPause.classList.add('icon-play')
    }
});
function rotateRecord() {
    recordImg.style.animationPlayState ='running';
}
function rotateRecordStop() {
    recordImg.style.animationPlayState ='paused';
}
function refreshRotate() {
    recordImg.classList.add('rotate-play');
}
nextMusic.addEventListener('click',function() {
    musicId++;
    if (musicId>=musicData.length) {
        musicId = 0;
    }
    initAndPlay();
});
beforeMusic.addEventListener('click',function() {
    musicId--;
    if(musicId < 0) {
        musicId = musicData.length-1;
    }
    initAndPlay();
})
function formatTime(value) {
    var hour = parseInt(value/3600)
    var minutes = parseInt((value%3600)/60)
    var seconds = parseInt(value % 60);
    if(hour > 0) {
        return `${hour.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}
        :${seconds.toString().padStart(2,'0')}`;
    }
    return `${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
}
audio.addEventListener('timeupdate',updateProgress);
function updateProgress() {
    playedTime.innerHTML = formatTime(audio.currentTime)
    var value = audio.currentTime/audio.duration;
    progressPlay.style.width = value*100 + '%';
}

var modeId = 1;
playMode.addEventListener('click',function() {
    modeId++;
    if(modeId>3) {
        modeId = 1;
    }
    playMode.style.backgroundImage = `url('img/mode${modeId}.png')`;
})

audio.addEventListener('ended',function() {
    if(modeId == 2) {
        musicId = (musicId+1)%musicData.length;
    } else if(modeId==3) {
        var oldId = musicId;
        while(true) {
            musicId = Math.floor(Math.random()*musicData.length);
            if(musicId != oldId) {
                break;
            }
        } 
    }
    initAndPlay();
})
var lastVolume = 70;
audio.volume = lastVolume /100;
volume.addEventListener('click',setVolume) ;
function setVolume() {
    if(audio.muted || audio.volume === 0) {
        audio.muted = false;
        volumeTogger.value = lastVolume;
        audio.volume = lastVolume/100;
    } else {
        audio.muted = true;
        lastVolume = volumeTogger.value;
        volumeTogger.value = 0;
    }
    updateVolumnIcon();
}
volumeTogger.addEventListener('input', updateVolume);
function updateVolume() {
    const volumeValue = volumeTogger.value/ 100;
    audio.volume = volumeValue;
    if(volumeValue > 0) {
        audio.muted = false;
    }
    updateVolumnIcon();
}
function updateVolumnIcon() {
    if(audio.muted || audio.volume === 0) {
        volume.style.backgroundImage = `url(img/静音.png)`;
    } else {
        volume.style.backgroundImage = `url(img/音量.png)`;
    }
}

speed.addEventListener('click', function() {
    var speedText = speed.innerText;
    if(speedText == '1.0X') {
        speed.innerText = '1.5X';
        audio.playbackRate = 1.5;
    } else if (speedText == '1.5X') {
        speed.innerText = '2.0X';
        audio.playbackRate = 2.0;
    } else if (speedText == '2.0X') {
        speed.innerText = '0.5X';
        audio.playbackRate = 0.5;
    } else if (speedText == '0.5X') {
        speed.innerText = '1.0X';
        audio.playbackRate = 1.0;
    }
})
listIcon.addEventListener('click',function() {
    listContainer.classList.remove('list-hide');
    listContainer.classList.add('list-show');
    closeContainer.style.display = 'block';
    listContainer.style.display = 'block';
})
closeContainer.addEventListener('click',function() {
    listContainer.classList.remove('list-show');
    listContainer.classList.add('list-hide');
    closeContainer.style.display = 'none';
})
function createMusic() {
    for(let i = 0;i<musicData.length;i++) {
        let div = document.createElement('div');
        div.innerText = `${musicData[i][0]}`;
        musicLists.appendChild(div);
        div.addEventListener('click',function() {
            musicId = i;
            initAndPlay();
        })
    }
}
document.addEventListener('DOMContentLoaded', createMusic)