// Variáveis para os players do YouTube
var livePlayer;
var modalPlayer;
var youtubeAPIReady = false;
var isLiveStream = true; // Controlar se é ao vivo ou sob demanda
var videos = []; // Armazenará os vídeos carregados do CSV
var schedule; // Armazenará o cronograma
var playerVolume = 100; // Volume padrão (0-100)
var playerMuted = true; // Iniciar como mudo para corresponder ao estado inicial do player

// Função chamada automaticamente quando a API do YouTube estiver carregada
function onYouTubeIframeAPIReady() {
    youtubeAPIReady = true;
    if (videos.length > 0) {
        initializePlayers();
    }
}

// Função para carregar o arquivo CSV
async function loadVideoData() {
    try {
        // Mostra carregamento
        document.getElementById('loading').style.display = 'flex';

        // Tenta carregar primeiro da raiz, depois da pasta js
        let csvData = null;
        let errorDetail = '';

        try {
            // Primeiro tenta carregar da pasta raiz
            const response = await fetch('videos.csv');
            if (response.ok) {
                csvData = await response.text();
            } else {
                errorDetail += `Falha ao carregar da raiz: ${response.status} ${response.statusText}. `;
            }
        } catch (e) {
            errorDetail += `Erro ao acessar arquivo na raiz: ${e.message}. `;
        }

        // Se não conseguiu da raiz, tenta da pasta js
        if (!csvData) {
            try {
                const response = await fetch('js/videos.csv');
                if (response.ok) {
                    csvData = await response.text();
                } else {
                    errorDetail += `Falha ao carregar de js/: ${response.status} ${response.statusText}. `;
                }
            } catch (e) {
                errorDetail += `Erro ao acessar arquivo na pasta js/: ${e.message}. `;
                throw new Error(`Não foi possível carregar o arquivo CSV. ${errorDetail}`);
            }
        }

        if (!csvData) {
            throw new Error(`Não foi possível carregar o arquivo CSV. ${errorDetail}`);
        }

        // Parse do CSV
        videos = parseCSV(csvData);

        if (videos.length === 0) {
            throw new Error('O arquivo CSV foi carregado mas não contém dados válidos.');
        }

        console.log(`Carregados ${videos.length} vídeos do CSV.`);

        // Cria o cronograma de programação
        schedule = createSchedule(videos);

        // Preenche as categorias
        populateCategories();

        // Inicializa os players se a API do YouTube já estiver carregada
        if (youtubeAPIReady) {
            initializePlayers();
        }

    } catch (error) {
        console.error('Erro ao carregar os dados dos vídeos:', error);
        document.getElementById('loading').style.display = 'none';

        // Criar um elemento para exibir o erro
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = error.message || 'Não foi possível carregar os dados dos vídeos. Por favor, tente novamente mais tarde.';

        // Inserir antes do elemento de categorias
        const categoriesContainer = document.getElementById('categories-container');
        categoriesContainer.parentNode.insertBefore(errorElement, categoriesContainer);
    }
}

// Extract YouTube video ID from a URL
function extractVideoId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

// Format duration from seconds to MM:SS or HH:MM:SS
function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
}

// Parse CSV and create video objects
function parseCSV(csv) {
    // Split by lines and process each line
    const lines = csv.split('\n');
    const videos = [];

    for (let i = 0; i < lines.length; i++) {
        // Skip empty lines
        if (!lines[i].trim()) continue;

        // Split each line by semicolon
        const parts = lines[i].split(';');

        if (parts.length >= 4) {
            // Extract video data
            const categoria = parts[0].trim();
            // Remove quotes from title if present
            let titulo = parts[1].trim();
            if (titulo.startsWith('"') && titulo.endsWith('"')) {
                titulo = titulo.substring(1, titulo.length - 1);
            }

            const youtubeLink = parts[2].trim();
            const duracaoSegundos = parseInt(parts[3].trim());

            // Extract video ID from YouTube link
            const videoId = extractVideoId(youtubeLink);

            // Create a video object
            const video = {
                categoria,
                titulo,
                youtubeLink,
                videoId,
                duracaoSegundos,
                duracao: formatDuration(duracaoSegundos)
            };

            videos.push(video);
        }
    }

    return videos;
}

// Create a TV schedule based on video duration
function createSchedule(videos) {
    const schedule = [];
    let currentTime = new Date();

    // Reset to the start of the current hour
    currentTime.setMinutes(0, 0, 0);

    // Get current local day of week (0-6, Sunday-Saturday)
    const today = currentTime.getDay();

    // Shuffle the videos based on the day of week to create different schedules for different days
    // This creates a predictable but varying schedule
    const shuffledVideos = [...videos].sort((a, b) => {
        return (a.duracaoSegundos * (today + 1)) % 13 - (b.duracaoSegundos * (today + 1)) % 13;
    });

    // Create a full day schedule (24 hours)
    for (let i = 0; i < 24; i++) {
        let hourStart = new Date(currentTime);
        hourStart.setHours(i);

        let minutesUsed = 0;
        let hourVideos = [];

        // Fill each hour with videos
        while (minutesUsed < 60) {
            // Pick videos in sequence, cycling through the list
            const video = shuffledVideos[(i + hourVideos.length) % shuffledVideos.length];
            const videoDurationMinutes = Math.ceil(video.duracaoSegundos / 60);

            // If this video would exceed the hour, find a shorter one
            if (minutesUsed + videoDurationMinutes > 60 && hourVideos.length > 0) {
                // Try to find a video that fits exactly
                const remainingMinutes = 60 - minutesUsed;
                const fitVideo = shuffledVideos.find(v => Math.ceil(v.duracaoSegundos / 60) <= remainingMinutes);

                if (fitVideo) {
                    hourVideos.push({
                        ...fitVideo,
                        startMinute: minutesUsed
                    });
                    minutesUsed += Math.ceil(fitVideo.duracaoSegundos / 60);
                } else {
                    // If no video fits, just end the hour
                    break;
                }
            } else {
                hourVideos.push({
                    ...video,
                    startMinute: minutesUsed
                });
                minutesUsed += videoDurationMinutes;
            }
        }

        // Add the videos for this hour to the schedule
        schedule.push({
            hour: i,
            videos: hourVideos
        });
    }

    return schedule;
}

// Find the current video to play based on the schedule
function getCurrentVideo(schedule) {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // Find the current hour in the schedule
    const hourSchedule = schedule.find(h => h.hour === currentHour);
    if (!hourSchedule) return null;

    // Find the video that should be playing now
    for (let i = 0; i < hourSchedule.videos.length; i++) {
        const video = hourSchedule.videos[i];
        const videoEndMinute = video.startMinute + Math.ceil(video.duracaoSegundos / 60);

        if (currentMinute >= video.startMinute && currentMinute < videoEndMinute) {
            return video;
        }
    }

    // If we couldn't find a video for the current minute, return the first video of the hour
    return hourSchedule.videos[0] || null;
}

// Calculate when the next video will start
function getNextVideoTime(schedule, currentVideo) {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // Find the current hour in the schedule
    const hourSchedule = schedule.find(h => h.hour === currentHour);
    if (!hourSchedule) return null;

    // Find the index of the current video
    const currentIndex = hourSchedule.videos.findIndex(v =>
        v.titulo === currentVideo.titulo && v.startMinute === currentVideo.startMinute);

    if (currentIndex === -1) return null;

    // If there's a next video in this hour
    if (currentIndex < hourSchedule.videos.length - 1) {
        const nextVideo = hourSchedule.videos[currentIndex + 1];
        return {
            video: nextVideo,
            time: new Date(now.getFullYear(), now.getMonth(), now.getDate(), currentHour, nextVideo.startMinute)
        };
    }

    // Otherwise, get the first video of the next hour
    const nextHour = (currentHour + 1) % 24;
    const nextHourSchedule = schedule.find(h => h.hour === nextHour);

    if (nextHourSchedule && nextHourSchedule.videos.length > 0) {
        const nextVideo = nextHourSchedule.videos[0];
        return {
            video: nextVideo,
            time: new Date(now.getFullYear(), now.getMonth(), now.getDate(), nextHour, nextVideo.startMinute)
        };
    }

    return null;
}

// Initialize players once YouTube API is ready
function initializePlayers() {
    // Initialize the live player
    initializeLivePlayer();

    // Generate program guide
    generateProgramGuide();

    // Sincronize o UI de controle de volume
    updateMuteIcon();

    // Define o valor inicial do slider de volume
    document.getElementById('volume-slider').value = playerVolume;

    // Hide loading spinner
    setTimeout(() => {
        document.getElementById('loading').style.display = 'none';
    }, 1000);
}

// Start with the live player
function initializeLivePlayer() {
    const currentVideo = getCurrentVideo(schedule);

    if (currentVideo && currentVideo.videoId) {
        // Calculate how many seconds into the video we should start
        const now = new Date();
        const videoStartTime = new Date(now);
        videoStartTime.setMinutes(currentVideo.startMinute, 0, 0);
        const secondsElapsed = Math.floor((now - videoStartTime) / 1000);

        // Update video title
        document.getElementById('current-video-title').textContent = currentVideo.titulo;

        // Set player status to AO VIVO
        const playerStatus = document.getElementById('player-status');
        playerStatus.textContent = "AO VIVO";
        playerStatus.classList.remove("ondemand");
        isLiveStream = true;

        // If YouTube API is ready, create the player
        if (youtubeAPIReady) {
            if (livePlayer) {
                // If player exists, load new video
                livePlayer.loadVideoById({
                    videoId: currentVideo.videoId,
                    startSeconds: secondsElapsed
                });
                // Apply volume settings
                if (playerMuted) {
                    livePlayer.mute();
                } else {
                    livePlayer.unMute();
                    livePlayer.setVolume(playerVolume);
                }
            } else {
                // Create new player
                livePlayer = new YT.Player('live-player', {
                    height: '100%',
                    width: '100%',
                    videoId: currentVideo.videoId,
                    playerVars: {
                        autoplay: 1,
                        controls: 0, // Esconde os controles do YouTube
                        modestbranding: 1,
                        rel: 0,
                        start: secondsElapsed,
                        mute: 1 // Inicia mudo para evitar problemas com autoplay
                    },
                    events: {
                        'onReady': onPlayerReady,
                        'onStateChange': onPlayerStateChange
                    }
                });
            }
        }

        // Schedule update for the next video
        const nextVideoInfo = getNextVideoTime(schedule, currentVideo);
        if (nextVideoInfo) {
            const timeUntilNext = nextVideoInfo.time - now;
            if (timeUntilNext > 0) {
                setTimeout(() => {
                    initializeLivePlayer();
                }, timeUntilNext);
            }
        }
    }
}

// Play a specific video in the main player
function playVideo(video) {
    if (video && video.videoId) {
        // Update video title
        document.getElementById('current-video-title').textContent = video.titulo;

        // Change player status to ON DEMAND
        const playerStatus = document.getElementById('player-status');
        playerStatus.textContent = "ON DEMAND";
        playerStatus.classList.add("ondemand");
        isLiveStream = false;

        // If YouTube API is ready, create or update the player
        if (youtubeAPIReady) {
            if (livePlayer) {
                // If player exists, load new video
                livePlayer.loadVideoById({
                    videoId: video.videoId,
                    startSeconds: 0
                });
                // Apply volume settings
                if (playerMuted) {
                    livePlayer.mute();
                } else {
                    livePlayer.unMute();
                    livePlayer.setVolume(playerVolume);
                }
            } else {
                // Create new player
                livePlayer = new YT.Player('live-player', {
                    height: '100%',
                    width: '100%',
                    videoId: video.videoId,
                    playerVars: {
                        autoplay: 1,
                        controls: 0,
                        modestbranding: 1,
                        rel: 0,
                        mute: playerMuted ? 1 : 0
                    },
                    events: {
                        'onReady': onPlayerReady,
                        'onStateChange': onPlayerStateChange
                    }
                });
            }
        }

        // Scroll to the top to see the video
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// YouTube player ready event
function onPlayerReady(event) {
    // Play video
    event.target.playVideo();

    // Set initial volume and mute state
    if (playerMuted) {
        event.target.mute();
    } else {
        event.target.unMute();
        event.target.setVolume(playerVolume);
    }

    // Update mute icon to match current state
    updateMuteIcon();
}

// YouTube player state change event
function onPlayerStateChange(event) {
    // If video ends, load next video (only if in live mode)
    if (event.data === YT.PlayerState.ENDED && isLiveStream) {
        initializeLivePlayer();
    }
}

// Function to toggle mute
function toggleMute() {
    if (livePlayer) {
        if (playerMuted) {
            livePlayer.unMute();
            playerMuted = false;
        } else {
            livePlayer.mute();
            playerMuted = true;
        }
        updateMuteIcon();
    }
}

// Function to update the mute icon
function updateMuteIcon() {
    const muteIcon = document.querySelector(".mute-icon");
    if (muteIcon) {
        muteIcon.textContent = playerMuted ? "🔇" : "🔊";
    }
}

// Function to set volume
function setVolume(value) {
    playerVolume = value;
    if (livePlayer && !playerMuted) {
        livePlayer.setVolume(value);
    }
}

// Generate program guide for today
function generateProgramGuide() {
    const programList = document.getElementById('program-list');
    programList.innerHTML = '';

    // Get current hour to highlight current program
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // Loop through each hour in the schedule
    schedule.forEach(hourSchedule => {
        const hour = hourSchedule.hour;

        // Loop through videos in this hour
        hourSchedule.videos.forEach(video => {
            const startTimeStr = `${hour.toString().padStart(2, '0')}:${video.startMinute.toString().padStart(2, '0')}`;

            // Calculate end time
            const videoDurationMinutes = Math.ceil(video.duracaoSegundos / 60);
            let endHour = hour;
            let endMinute = video.startMinute + videoDurationMinutes;

            if (endMinute >= 60) {
                endHour = (endHour + 1) % 24;
                endMinute = endMinute % 60;
            }

            const endTimeStr = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;

            // Create program item
            const programItem = document.createElement('div');
            programItem.className = 'program-item';

            // Check if this is the current program
            if (hour === currentHour &&
                currentMinute >= video.startMinute &&
                currentMinute < (video.startMinute + videoDurationMinutes)) {
                programItem.classList.add('current-program');
            }

            programItem.innerHTML = `
                <div class="program-time">${startTimeStr} - ${endTimeStr}</div>
                <div class="program-title">${video.titulo}</div>
                <div class="program-duration">${video.duracao}</div>
            `;

            // Add click event to play this video
            programItem.addEventListener('click', () => {
                playVideo(video);
                document.getElementById('schedule-modal').style.display = 'none';
            });

            programList.appendChild(programItem);
        });
    });
}

// Get unique categories
function getCategories() {
    return [...new Set(videos.map(video => video.categoria))];
}

// Fill the categories section
function populateCategories() {
    const categoriesList = document.getElementById('categories-list');
    categoriesList.innerHTML = '';

    const categories = getCategories();

    categories.forEach(category => {
        const videosInCategory = videos.filter(video => video.categoria === category);

        const categoryElement = document.createElement('div');
        categoryElement.className = 'category';
        categoryElement.innerHTML = `
            <h3>${category}</h3>
            <p>${videosInCategory.length} vídeos disponíveis</p>
        `;

        // Add event listener
        categoryElement.addEventListener('click', () => {
            showVideosInCategory(category);
        });

        categoriesList.appendChild(categoryElement);
    });
}

// Show videos in a specific category
function showVideosInCategory(category) {
    const categoriesContainer = document.getElementById('categories-container');
    const videoGrid = document.getElementById('video-grid');
    const backButton = document.getElementById('back-button');

    const videosInCategory = videos.filter(video => video.categoria === category);

    // Clear and hide categories
    categoriesContainer.style.maxHeight = null;
    videoGrid.innerHTML = '';

    // Show back button
    backButton.style.display = 'block';

    // Create video cards
    videosInCategory.forEach(video => {
        const videoCard = document.createElement('div');
        videoCard.className = 'video-card';

        // Get thumbnail URL from video ID
        const thumbnailUrl = video.videoId ?
            `https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg` :
            '';

        videoCard.innerHTML = `
            <div class="video-thumbnail">
                <img src="${thumbnailUrl}" alt="${video.titulo}">
                <div class="video-duration">${video.duracao}</div>
            </div>
            <div class="video-info">
                <h3>${video.titulo}</h3>
                <p>${video.categoria}</p>
            </div>
        `;

        // Add click event to play video in main player instead of modal
        videoCard.querySelector('.video-thumbnail').addEventListener('click', () => {
            playVideo(video);
        });

        videoGrid.appendChild(videoCard);
    });

    // Show video grid
    videoGrid.style.display = 'flex';
}

// Set up event listeners
document.addEventListener('DOMContentLoaded', function () {
    // Toggle Categories
    document.getElementById('toggle-categories').addEventListener('click', () => {
        const categoriesContainer = document.getElementById('categories-container');

        if (categoriesContainer.style.maxHeight) {
            categoriesContainer.style.maxHeight = null;
        } else {
            categoriesContainer.style.maxHeight = '2000px'; // Using a large value to ensure all content is shown
            // Scroll to categories
            setTimeout(() => {
                categoriesContainer.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    });

    document.getElementById('toggle-categories').addEventListener('click', () => {
        const categoriesContainer = document.getElementById('categories-container');
        const toggleButton = document.getElementById('toggle-categories');

        if (categoriesContainer.style.maxHeight) {
            categoriesContainer.style.maxHeight = null;
            toggleButton.classList.remove('active');
        } else {
            categoriesContainer.style.maxHeight = '2000px'; // Using a large value to ensure all content is shown
            toggleButton.classList.add('active');
            // Scroll to categories
            setTimeout(() => {
                categoriesContainer.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    });

    // Back Button
    document.getElementById('back-button').addEventListener('click', () => {
        const videoGrid = document.getElementById('video-grid');
        const backButton = document.getElementById('back-button');
        const categoriesContainer = document.getElementById('categories-container');

        videoGrid.style.display = 'none';
        backButton.style.display = 'none';
        categoriesContainer.style.maxHeight = '2000px';
    });

    // Modal Close
    document.getElementById('close-modal').addEventListener('click', () => {
        if (modalPlayer && modalPlayer.stopVideo) {
            modalPlayer.stopVideo();
        }
        document.getElementById('video-modal').style.display = 'none';
    });

    // Schedule Modal Close
    document.getElementById('close-schedule-modal').addEventListener('click', () => {
        document.getElementById('schedule-modal').style.display = 'none';
    });

    // Close modals when clicking outside of content
    document.getElementById('video-modal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('video-modal')) {
            if (modalPlayer && modalPlayer.stopVideo) {
                modalPlayer.stopVideo();
            }
            document.getElementById('video-modal').style.display = 'none';
        }
    });

    document.getElementById('schedule-modal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('schedule-modal')) {
            document.getElementById('schedule-modal').style.display = 'none';
        }
    });

    // Tabbed navigation
    document.getElementById('live-tab').addEventListener('click', (e) => {
        e.preventDefault();
        setActiveTab(document.getElementById('live-tab'));
        document.getElementById('live-section').style.display = 'block';
        document.getElementById('categories-container').style.display = 'block';
        document.getElementById('toggle-categories').style.display = 'block';
        document.getElementById('schedule-modal').style.display = 'none';
        document.getElementById('video-grid').style.display = 'none';
        document.getElementById('back-button').style.display = 'none';
        initializeLivePlayer(); // Refresh the player
    });

    document.getElementById('explore-tab').addEventListener('click', (e) => {
        e.preventDefault();
        setActiveTab(document.getElementById('explore-tab'));

        // Show categories and scroll to them
        document.getElementById('categories-container').style.maxHeight = '2000px';
        document.getElementById('categories-container').style.display = 'block';
        document.getElementById('toggle-categories').style.display = 'block';

        // Make sure the player is still visible
        document.getElementById('live-section').style.display = 'block';

        // Hide other content
        document.getElementById('schedule-modal').style.display = 'none';

        // Scroll to categories
        setTimeout(() => {
            document.getElementById('categories-container').scrollIntoView({ behavior: 'smooth' });
        }, 100);
    });

    document.getElementById('schedule-tab').addEventListener('click', (e) => {
        e.preventDefault();
        setActiveTab(document.getElementById('schedule-tab'));

        // Update program guide
        generateProgramGuide();

        // Show schedule modal
        document.getElementById('schedule-modal').style.display = 'block';
    });

    document.getElementById('about-tab').addEventListener('click', (e) => {
        e.preventDefault();
        setActiveTab(document.getElementById('about-tab'));
        document.getElementById('live-section').style.display = 'block';
        document.getElementById('categories-container').style.display = 'none';
        document.getElementById('toggle-categories').style.display = 'none';
        document.getElementById('schedule-modal').style.display = 'none';
        document.getElementById('video-grid').style.display = 'none';
        document.getElementById('back-button').style.display = 'none';

        // Show About content (to be implemented)
        alert('A página "Sobre" será implementada em breve.');
    });

    // Volume/Mute Controls
    document.getElementById('toggle-mute').addEventListener('click', toggleMute);

    document.getElementById('volume-slider').addEventListener('input', function (e) {
        const volumeValue = parseInt(e.target.value);
        setVolume(volumeValue);

        // If volume is set to 0, mute; otherwise unmute
        if (volumeValue === 0) {
            playerMuted = true;
        } else if (playerMuted) {
            playerMuted = false;
            if (livePlayer) {
                livePlayer.unMute();
            }
        }

        updateMuteIcon();
    });
});

function setActiveTab(tab) {
    document.getElementById('live-tab').classList.remove('active');
    document.getElementById('explore-tab').classList.remove('active');
    document.getElementById('schedule-tab').classList.remove('active');
    document.getElementById('about-tab').classList.remove('active');
    tab.classList.add('active');
}

// Iniciar carregamento de dados quando a página carregar
window.addEventListener('load', loadVideoData);