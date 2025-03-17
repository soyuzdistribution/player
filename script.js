document.addEventListener('DOMContentLoaded', () => {
    const player = document.getElementById('player');
    const playlist = document.getElementById('playlist');
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
    
    // Пагинация
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageInfoElement = document.getElementById('pageInfo');
    
    let audio = new Audio();
    let currentTrackIndex = 0;
    let isPlaying = false;
    let tracks = [];
    let currentPage = 1;
    const tracksPerPage = 10;

    // Загрузка треков из JSON
    console.log('Начинаем загрузку tracks.json...');
    
    fetch('tracks.json', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        cache: 'no-cache'
    })
    .then(response => {
        console.log('Получен ответ:', response.status);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Данные успешно загружены:', data);
        if (!data || !data.tracks || !Array.isArray(data.tracks)) {
            throw new Error('Неверный формат данных');
        }
        tracks = data.tracks;
        console.log(`Загружено ${tracks.length} треков`);
        updatePagination();
        displayTracks();
    })
    .catch(error => {
        console.error('Ошибка загрузки треков:', error);
        playlist.innerHTML = `<div class="error">Ошибка загрузки треков: ${error.message}</div>`;
        
        // Попробуем альтернативный метод загрузки для Safari
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'tracks.json', true);
        xhr.onload = function() {
            if (xhr.status === 200) {
                try {
                    const data = JSON.parse(xhr.responseText);
                    console.log('Данные загружены через XHR:', data);
                    if (data && data.tracks && Array.isArray(data.tracks)) {
                        tracks = data.tracks;
                        updatePagination();
                        displayTracks();
                    }
                } catch (e) {
                    console.error('Ошибка парсинга JSON:', e);
                }
            }
        };
        xhr.send();
    });

    // Функция отображения треков для текущей страницы
    function displayTracks() {
        console.log('Отображаем треки...');
        const startIndex = (currentPage - 1) * tracksPerPage;
        const endIndex = startIndex + tracksPerPage;
        const currentTracks = tracks.slice(startIndex, endIndex);
        console.log(`Треки для отображения (${startIndex}-${endIndex}):`, currentTracks);

        playlist.innerHTML = '';
        if (currentTracks.length === 0) {
            playlist.innerHTML = '<div class="error">Нет треков для отображения</div>';
            return;
        }

        currentTracks.forEach((track, index) => {
            const trackElement = document.createElement('div');
            trackElement.className = 'track';
            trackElement.innerHTML = `
                <img src="https://win98icons.alexmeub.com/icons/png/cd_audio_cd-4.png" alt="music" class="track-icon">
                <span class="track-name">${track.name}</span>
            `;
            trackElement.addEventListener('click', () => {
                currentTrackIndex = startIndex + index;
                player.classList.add('active');
                playTrack(currentTrackIndex);
            });
            playlist.appendChild(trackElement);
        });
        console.log('Треки отображены');
    }

    // Обновление информации о пагинации
    function updatePagination() {
        const totalPages = Math.ceil(tracks.length / tracksPerPage);
        pageInfoElement.textContent = `Страница ${currentPage} из ${totalPages}`;
        
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages;
    }

    // Обработчики для пагинации
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayTracks();
            updatePagination();
        }
    });

    nextPageBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(tracks.length / tracksPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            displayTracks();
            updatePagination();
        }
    });

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
        if (!track) return;
        
        audio.src = track.filename;
        currentTrackElement.textContent = track.name;
        
        audio.play().catch(error => {
            console.error('Ошибка воспроизведения:', error);
            currentTrackElement.textContent = 'Ошибка воспроизведения';
        });
        
        isPlaying = true;
        playBtn.textContent = '⏸';
        toggleEqualizer(true);
    }

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