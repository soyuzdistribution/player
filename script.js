document.addEventListener('DOMContentLoaded', () => {
    const player = document.getElementById('player');
    const tracks = document.querySelectorAll('.track');
    const closeBtn = document.querySelector('.close-btn');
    const playBtn = document.getElementById('play-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const currentTrackElement = document.getElementById('current-track');
    const progressBar = document.querySelector('.progress');
    const progressContainer = document.querySelector('.progress-bar');
    const currentTimeElement = document.getElementById('current-time');
    const durationElement = document.getElementById('duration');
    const equalizer = document.querySelector('.equalizer');

    let audio = new Audio();
    let currentTrackIndex = 0;
    let isPlaying = false;

    // Функция управления эквалайзером
    function toggleEqualizer(play) {
        const bars = equalizer.querySelectorAll('.bar');
        bars.forEach(bar => {
            if (play) {
                bar.style.animationPlayState = 'running';
            } else {
                bar.style.animationPlayState = 'paused';
            }
        });
    }

    // Функция форматирования времени
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    // Обновление прогресса воспроизведения
    function updateProgress() {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = `${progress}%`;
        currentTimeElement.textContent = formatTime(audio.currentTime);
        durationElement.textContent = formatTime(audio.duration);
    }

    // Воспроизведение трека
    function playTrack(index) {
        const track = tracks[index];
        const trackSrc = track.dataset.src;
        const trackName = track.querySelector('.track-name').textContent;

        audio.src = trackSrc;
        currentTrackElement.textContent = trackName;
        audio.play();
        isPlaying = true;
        playBtn.textContent = '⏸';
        toggleEqualizer(true);
    }

    // Обработчики событий для треков
    tracks.forEach((track, index) => {
        track.addEventListener('click', () => {
            currentTrackIndex = index;
            player.classList.add('active');
            playTrack(currentTrackIndex);
        });
    });

    // Закрытие плеера
    closeBtn.addEventListener('click', () => {
        player.classList.remove('active');
        audio.pause();
        isPlaying = false;
        playBtn.textContent = '▶';
        toggleEqualizer(false);
    });

    // Воспроизведение/пауза
    playBtn.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            playBtn.textContent = '▶';
            toggleEqualizer(false);
        } else {
            audio.play();
            playBtn.textContent = '⏸';
            toggleEqualizer(true);
        }
        isPlaying = !isPlaying;
    });

    // Предыдущий трек
    prevBtn.addEventListener('click', () => {
        currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
        playTrack(currentTrackIndex);
    });

    // Следующий трек
    nextBtn.addEventListener('click', () => {
        currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
        playTrack(currentTrackIndex);
    });

    // Перемотка трека
    progressContainer.addEventListener('click', (e) => {
        const width = progressContainer.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        audio.currentTime = (clickX / width) * duration;
    });

    // Обновление прогресса
    audio.addEventListener('timeupdate', updateProgress);

    // Автоматическое воспроизведение следующего трека
    audio.addEventListener('ended', () => {
        currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
        playTrack(currentTrackIndex);
    });

    // Инициализация эквалайзера в состоянии паузы
    toggleEqualizer(false);
}); 