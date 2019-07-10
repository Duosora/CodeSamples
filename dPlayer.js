'use strict'; // Стандарт ECMAScript 5 (ES5).

function formatTime(t) {
  var m = Math.floor(t / 60);
  var s = t % 60;

  m = (m < 10) ? ('0' + m) : m;
  s = (s < 10) ? ('0' + s) : s;

  return (m + ':' + s);
}

function getOffset(el) {
  const rect = el.getBoundingClientRect();
  return {
    left: rect.left + window.scrollX,
    top: rect.top + window.scrollY
  };
}

class dPlayer {

  constructor(container_id,default_volume) {
    this.container    = document.getElementById(container_id);

    this.songs        = [];
    this.current_song = 0;

    this.volume       = default_volume;
    this.vInterval    = null;

    this.controls     = [
      this.container.getElementsByClassName("player_play")[0],
      this.container.getElementsByClassName("player_stop")[0],
      this.container.getElementsByClassName("player_prev")[0],
      this.container.getElementsByClassName("player_next")[0],
      this.container.getElementsByClassName("player_volume_plus")[0],
      this.container.getElementsByClassName("player_volume_minus")[0],
      this.container.getElementsByClassName("player_progress")[0],
      this.container.getElementsByClassName("player_progress_filler")[0]
    ];
    this.indicators   = [
      this.container.getElementsByClassName("player_volume_percent")[0],
      this.container.getElementsByClassName("player_currenttime")[0],
      this.container.getElementsByClassName("player_totaltime")[0]
    ];
  }

  setVolume(new_volume) {
    this.volume = Math.max(0, Math.min(new_volume, 1));

    this.songs[this.current_song].volume = player_volume;

    this.indicators[0].innerHTML = Math.round(this.volume * 100) + '%';
  }

  setCurrentTime(cur_time) {
    this.indicators[1].innerHTML = formatTime(Math.floor(cur_time))
  }

  setDuration(cur_duration) {
    this.indicators[2].innerHTML = formatTime(Math.floor(cur_duration));
  }

  stopSong(reset_time) {
    if (!(this.songs[this.current_song].paused)) {
      this.songs[this.current_song].pause();
    }

    if(reset_time) {
      this.setCurrentTime(0);
    }
  }

  playSong() {
    if (this.songs[this.current_song].paused) {
      this.songs[this.current_song].play();
    }
  }

  toggleSong() {
    if (this.songs[this.current_song].paused) {
      this.playSong();
      this.controls[0].innerHTML = 'Пауза';
    } else {
      this.stopSong(false);
      this.controls[0].innerHTML = 'Воспроизведение';
    }
  }

  switchSong(switch_direction) {
    // Сначала нужно остановить текущую песню.
    this.stopSong(true);

    this.current_song += switch_direction ? 1 : -1;

    if (this.current_song === this.songs.length) {
      this.current_song = 0;
    } else if (this.current_song < 0) {
      this.current_song = this.songs.length - 1;
    }

    this.setDuration(this.songs[this.current_song].duration);
  }

  updateProgressWidth(client_x) {
    var progress_x = getOffset(this.controls[6]).left;
    var progress_w = this.controls[6].scrollWidth;
    var clicked_x = client_x;
    var new_perc = Math.min(100, (100 * (clicked_x - progress_x) / progress_w));

    this.songs[this.current_song].currentTime = this.songs[this.current_song].duration*new_perc*0.01;

    this.controls[7].style.width = new_perc + '%';
  }

  // События перемотки.

  this.controls[6].addEventListener('touchmove',function(e) {
    this.updateProgressWidth(e.touches[0].clientX);
  });

  this.controls[6].addEventListener('mousemove', function(e) {
    if (e.which == 1) {
      this.updateProgressWidth(e.clientX);
    }
  });

  this.controls[6].addEventListener('click',function(e) {
    this.updateProgressWidth(e.clientX);
  });

  // События регулировки громкости.

  this.controls[5].addEventListener('mouseup', function(e) {
    clearInterval(this.vInterval);
    this.setVolume(this.volume - 0.01);
  });

  this.controls[4].addEventListener('mouseup', function(e) {
    clearInterval(this.vInterval);
    this.setVolume(this.volume + 0.01);
  });

  this.controls[5].addEventListener('mousedown', function(e) {
    this.vInterval = setInterval(function() {
      this.setVolume(this.volume - 0.01);
    }, 70);
  });

  this.controls[4].addEventListener('mousedown', function(e) {
    this.vInterval = setInterval(function() {
      this.setVolume(this.volume + 0.01);
    }, 70);
  });

  // События переключения песен.

  this.controls[3].addEventListener('click', function(e) {
    this.switchSong(true);
  });

  this.controls[2].addEventListener('click', function(e) {
    this.switchSong(false);
  });

  // События воспроизведения и остановки песни.

  player_controllers[1].addEventListener('click', function(e) {
    this.stopSong();
  });

  player_controllers[0].addEventListener('mouseup', function(e) {
    this.toggleSong();
  });

  // Добавление новой песни.

  addSong(song_url) {
    var new_song = new Audio(song_url);

    new_song.addEventListener('timeupdate',function(){
      // Действия при изменении текущего времени трека.
      this.controls[7].style.width = (Math.floor(100*new_song.currentTime/new_song.duration)) + '%';
      this.setCurrentTime(new_song.currentTime);
    });

    new_song.addEventListener('ended',function(){
      // Действия при окончании проигрывания трека.
      this.stopSong(true);
    });

    this.songs.push(new_song);
  }
}
