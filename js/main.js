// Variável para controlar o estado de mudo do vídeo
let isMuted = false;

// Variável para armazenar o vídeo atual da transmissão ao vivo
let currentLiveVideo = null;

// Variável para saber se estamos exibindo um vídeo selecionado ou a transmissão ao vivo
let isShowingSelectedVideo = false;

// Dia da semana atual (0 = Domingo, 1 = Segunda, etc.)
let selectedDayOfWeek = new Date().getDay();

// Intervalo de atualização da barra de progresso
let progressInterval = null;

// Tempo de início do programa atual
let currentProgramStartTime = null;

// Tempo de término do programa atual
let currentProgramEndTime = null;

// Duração do programa atual em segundos
let currentProgramDuration = null;

// Função para analisar o CSV e converter em um array de objetos
function parseCSV(csvData) {
    const lines = csvData.trim().split('\n');
    const headers = lines[0].split(',');
    
    return lines.slice(1).map(line => {
        // Lidar com campos entre aspas
        let fields = [];
        let currentField = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            if (line[i] === '"') {
                inQuotes = !inQuotes;
                continue;
            }
            
            if (line[i] === ',' && !inQuotes) {
                fields.push(currentField);
                currentField = '';
                continue;
            }
            
            currentField += line[i];
        }
        
        // Adicionar o último campo
        fields.push(currentField);
        
        const obj = {};
        headers.forEach((header, index) => {
            obj[header] = fields[index] || '';
        });
        
        return obj;
    });
}

// Função para obter o horário atual no formato HH:MM
function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

// Função para obter o horário atual em segundos desde a meia-noite
function getCurrentTimeInSeconds() {
    const now = new Date();
    return now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
}

// Função para converter horário HH:MM em segundos desde a meia-noite
function timeToSeconds(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 3600 + minutes * 60;
}

// Função para formatar segundos como tempo de exibição MM:SS ou HH:MM:SS
function formatSecondsToDisplay(seconds) {
    if (seconds < 0) seconds = 0;
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    
    return hours > 0 ? `${hours}:${minutes}:${secs}` : `${minutes}:${secs}`;
}

// Função para obter o dia da semana atual (0-6)
function getCurrentDayOfWeek() {
    return new Date().getDay();
}

// Função para comparar horários no formato HH:MM
function compareTimeStrings(time1, time2) {
    const [hours1, minutes1] = time1.split(':').map(Number);
    const [hours2, minutes2] = time2.split(':').map(Number);
    
    if (hours1 !== hours2) {
        return hours1 - hours2;
    }
    
    return minutes1 - minutes2;
}

// Função para verificar se o horário atual está entre o início e o fim
function isTimeInRange(currentTime, startTime, endTime) {
    // Caso especial para intervalos que cruzam a meia-noite
    if (compareTimeStrings(startTime, endTime) > 0) {
        return compareTimeStrings(currentTime, startTime) >= 0 || compareTimeStrings(currentTime, endTime) < 0;
    }
    
    return compareTimeStrings(currentTime, startTime) >= 0 && compareTimeStrings(currentTime, endTime) < 0;
}

// Função para calcular o tempo decorrido em segundos desde o início do programa
function calculateElapsedTime(currentTimeString, startTimeString) {
    const currentSeconds = timeToSeconds(currentTimeString);
    const startSeconds = timeToSeconds(startTimeString);
    
    // Caso especial para programas que cruzam a meia-noite
    if (startSeconds > currentSeconds) {
        return (currentSeconds + 86400) - startSeconds; // 86400 = 24 horas em segundos
    }
    
    return currentSeconds - startSeconds;
}

// Função para atualizar a barra de progresso
function updateProgressBar() {
    if (!currentProgramStartTime || !currentProgramEndTime || !currentProgramDuration || isShowingSelectedVideo) {
        return;
    }
    
    const currentTime = getCurrentTime();
    const elapsedTime = calculateElapsedTime(currentTime, currentProgramStartTime);
    const progressPercent = (elapsedTime / currentProgramDuration) * 100;
    
    // Atualiza a barra de progresso
    document.getElementById('progress-bar').style.width = `${progressPercent}%`;
}

// Função para iniciar o monitoramento de progresso
function startProgressMonitoring() {
    // Limpa qualquer intervalo existente
    if (progressInterval) {
        clearInterval(progressInterval);
    }
    
    // Inicia um novo intervalo para atualizar a cada segundo
    progressInterval = setInterval(updateProgressBar, 1000);
    
    // Atualiza imediatamente
    updateProgressBar();
}

// Função para atualizar o vídeo em destaque com base no horário e dia da semana
function updateFeaturedVideo() {
    // Se estiver exibindo um vídeo selecionado, não atualiza
    if (isShowingSelectedVideo) {
        return;
    }
    
    const currentTime = getCurrentTime();
    const currentDayOfWeek = getCurrentDayOfWeek();
    const schedule = parseCSV(weeklyScheduleData);
    
    // Filtra a programação para o dia atual
    const daySchedule = schedule.filter(item => Number(item.dia_da_semana) === currentDayOfWeek);
    
    // Encontra o vídeo atual com base no horário
    const currentSchedule = daySchedule.find(item => 
        isTimeInRange(currentTime, item.hora_inicio, item.hora_fim)
    );
    
    if (currentSchedule) {
        // Armazena o vídeo atual da transmissão ao vivo
        currentLiveVideo = {
            id: currentSchedule.video_id,
            title: currentSchedule.titulo,
            description: currentSchedule.descricao,
            duration: Number(currentSchedule.duracao_segundos),
            isOffAir: false
        };
        
        // Armazena os tempos de início e fim para cálculos de progresso
        currentProgramStartTime = currentSchedule.hora_inicio;
        currentProgramEndTime = currentSchedule.hora_fim;
        currentProgramDuration = Number(currentSchedule.duracao_segundos);
        
        // Calcula quanto tempo já se passou desde o início do programa
        const elapsedTime = calculateElapsedTime(currentTime, currentSchedule.hora_inicio);
        
        // Calcula o ponto de início do vídeo em segundos (considerando se o vídeo tem loop)
        const startSeconds = elapsedTime % currentProgramDuration;
        
        // Atualiza as informações na tela
        document.getElementById('featured-title').textContent = currentSchedule.titulo;
        document.getElementById('featured-description').textContent = currentSchedule.descricao;
        
        // Atualiza o indicador de transmissão
        const streamingInfo = document.getElementById('streaming-info');
        streamingInfo.textContent = 'AO VIVO';
        streamingInfo.classList.add('live');
        streamingInfo.classList.remove('selected');
        streamingInfo.classList.remove('off-air');
        
        // Atualiza o vídeo em destaque com autoplay a partir do tempo correto
        const featuredVideo = document.getElementById('featured-video');
        
        // Lembre-se do estado atual de mudo
        const muteParam = isMuted ? "mute=1" : "mute=0";
        
        featuredVideo.innerHTML = `
            <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/${currentSchedule.video_id}?autoplay=1&${muteParam}&controls=0&showinfo=0&rel=0&start=${Math.floor(startSeconds)}&modestbranding=1&enablejsapi=1&playlist=${currentSchedule.video_id}" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
            </iframe>
        `;
        
        // Esconde o botão de retorno à transmissão ao vivo
        document.getElementById('return-to-live').style.display = 'none';
        
        // Atualiza o botão de mudo com o ícone correto
        updateMuteButton();
        
        // Inicia o monitoramento de progresso
        startProgressMonitoring();
    } else {
        // Não há programação para este horário, exibir o vídeo de intervalo
        
        // Armazena o vídeo atual como o vídeo de intervalo
        currentLiveVideo = offAirConfig;
        
        // Limpa os tempos de início/fim pois não estamos em um programa regular
        currentProgramStartTime = null;
        currentProgramEndTime = null;
        currentProgramDuration = null;
        
        // Atualiza as informações na tela
        document.getElementById('featured-title').textContent = offAirConfig.title;
        document.getElementById('featured-description').textContent = offAirConfig.description;
        
        // Atualiza o indicador de transmissão para mostrar "INTERVALO"
        const streamingInfo = document.getElementById('streaming-info');
        streamingInfo.textContent = 'INTERVALO';
        streamingInfo.classList.remove('live');
        streamingInfo.classList.remove('selected');
        streamingInfo.classList.add('off-air');
        
        // Atualiza o vídeo em destaque com o vídeo de intervalo
        const featuredVideo = document.getElementById('featured-video');
        
        // Lembre-se do estado atual de mudo
        const muteParam = isMuted ? "mute=1" : "mute=0";
        
        featuredVideo.innerHTML = `
            <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/${offAirConfig.videoId}?autoplay=1&${muteParam}&controls=0&showinfo=0&rel=0&modestbranding=1&enablejsapi=1&playlist=${offAirConfig.videoId}" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
            </iframe>
        `;
        
        // Esconde o botão de retorno à transmissão ao vivo
        document.getElementById('return-to-live').style.display = 'none';
        
        // Atualiza o botão de mudo com o ícone correto
        updateMuteButton();
        
        // Limpa informações de progresso
        document.getElementById('progress-bar').style.width = '0%';
    }
}

// Função para atualizar o ícone do botão de mudo
function updateMuteButton() {
    const muteToggle = document.getElementById('mute-toggle');
    muteToggle.textContent = isMuted ? '🔇' : '🔊';
    muteToggle.title = isMuted ? 'Ativar Som' : 'Desativar Som';
}

// Função para alternar o estado de mudo do vídeo
function toggleMute() {
    isMuted = !isMuted;
    updateMuteButton();
    
    // Se estiver exibindo um vídeo selecionado
    if (isShowingSelectedVideo) {
        playSelectedVideo(document.querySelector('.featured-title').textContent, 
                         document.querySelector('.featured-description').textContent,
                         document.getElementById('featured-video').querySelector('iframe').src.split('?')[0].split('/').pop());
    } else {
        updateFeaturedVideo(); // Recarrega o vídeo com o novo estado de mudo
    }
}

// Função para exibir um vídeo selecionado no destaque
function playSelectedVideo(title, description, videoId) {
    // Marca que estamos exibindo um vídeo selecionado
    isShowingSelectedVideo = true;
    
    // Atualiza as informações na tela
    document.getElementById('featured-title').textContent = title;
    document.getElementById('featured-description').textContent = description;
    
    // Atualiza o indicador de transmissão
    const streamingInfo = document.getElementById('streaming-info');
    streamingInfo.textContent = 'SELECIONADO';
    streamingInfo.classList.remove('live');
    streamingInfo.classList.add('selected');
    streamingInfo.classList.remove('off-air');
    
    // Atualiza o vídeo em destaque
    const featuredVideo = document.getElementById('featured-video');
    
    // Lembre-se do estado atual de mudo
    const muteParam = isMuted ? "mute=1" : "mute=0";
    
    featuredVideo.innerHTML = `
        <iframe 
            width="100%" 
            height="100%" 
            src="https://www.youtube.com/embed/${videoId}?autoplay=1&${muteParam}&controls=1&showinfo=1&rel=0&modestbranding=1&enablejsapi=1" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
        </iframe>
    `;
    
    // Mostra o botão de retorno à transmissão ao vivo
    document.getElementById('return-to-live').style.display = 'flex';
}

// Função para retornar à transmissão ao vivo
function returnToLiveStream() {
    isShowingSelectedVideo = false;
    updateFeaturedVideo();
}

// Função para gerar os cards de conteúdo
function generateContentCards() {
    const popularGrid = document.getElementById('popular-grid');
    const continueGrid = document.getElementById('continue-grid');
    const recommendedGrid = document.getElementById('recommended-grid');
    
    videos.forEach(video => {
        const card = document.createElement('div');
        card.className = 'content-card';
        card.dataset.id = video.id;
        card.dataset.title = video.title;
        card.dataset.description = video.description;
        
        const thumb = document.createElement('img');
        thumb.className = 'content-thumb';
        thumb.src = video.thumbnail;
        thumb.alt = video.title;
        
        const info = document.createElement('div');
        info.className = 'content-info';
        
        const title = document.createElement('div');
        title.className = 'content-title';
        title.textContent = video.title;
        
        const meta = document.createElement('div');
        meta.className = 'content-meta';
        meta.textContent = video.views;
        
        info.appendChild(title);
        info.appendChild(meta);
        
        card.appendChild(thumb);
        card.appendChild(info);
        
        // Handler de clique para reproduzir o vídeo
        card.addEventListener('click', function() {
            playSelectedVideo(this.dataset.title, this.dataset.description, this.dataset.id);
            
            // Rola a página para o topo para mostrar o vídeo
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        if (video.category === 'popular') {
            popularGrid.appendChild(card);
        } else if (video.category === 'continue') {
            continueGrid.appendChild(card);
        } else if (video.category === 'recommended') {
            recommendedGrid.appendChild(card);
        }
    });
}

// Função para gerar os botões dos dias da semana no guia de programação
function generateDayButtons() {
    const daySelector = document.getElementById('day-selector');
    
    daysOfWeek.forEach((day, index) => {
        const dayBtn = document.createElement('button');
        dayBtn.className = 'day-btn';
        dayBtn.textContent = day;
        dayBtn.dataset.day = index;
        
        if (index === selectedDayOfWeek) {
            dayBtn.classList.add('active');
        }
        
        dayBtn.addEventListener('click', function() {
            // Remove a classe ativa de todos os botões
            document.querySelectorAll('.day-btn').forEach(btn => btn.classList.remove('active'));
            
            // Adiciona a classe ativa ao botão clicado
            this.classList.add('active');
            
            // Atualiza o dia selecionado e regenera a lista de programas
            selectedDayOfWeek = Number(this.dataset.day);
            generateProgramList();
        });
        
        daySelector.appendChild(dayBtn);
    });
}

// Função para gerar a lista de programas para o dia selecionado
function generateProgramList() {
    const programList = document.getElementById('program-list');
    programList.innerHTML = '';
    
    const schedule = parseCSV(weeklyScheduleData);
    const currentTime = getCurrentTime();
    const currentDayOfWeek = getCurrentDayOfWeek();
    
    // Filtra a programação para o dia selecionado
    const daySchedule = schedule.filter(item => Number(item.dia_da_semana) === selectedDayOfWeek);
    
    daySchedule.forEach(program => {
        const programItem = document.createElement('div');
        programItem.className = 'program-item';
        
        // Verifica se este é o programa atual (apenas para o dia atual)
        if (selectedDayOfWeek === currentDayOfWeek && 
            isTimeInRange(currentTime, program.hora_inicio, program.hora_fim)) {
            programItem.classList.add('current-program');
        }
        
        const programTime = document.createElement('div');
        programTime.className = 'program-time';
        programTime.textContent = `${program.hora_inicio} - ${program.hora_fim}`;
        
        const programTitle = document.createElement('div');
        programTitle.className = 'program-title';
        programTitle.textContent = program.titulo;
        
        const programDescription = document.createElement('div');
        programDescription.className = 'program-description';
        programDescription.textContent = program.descricao;
        
        programItem.appendChild(programTime);
        programItem.appendChild(programTitle);
        programItem.appendChild(programDescription);
        
        // Adiciona um evento de clique para reproduzir o programa
        programItem.addEventListener('click', function() {
            // Se for o programa atual no dia atual, volta para a transmissão ao vivo
            if (selectedDayOfWeek === currentDayOfWeek && 
                isTimeInRange(currentTime, program.hora_inicio, program.hora_fim)) {
                returnToLiveStream();
            } else {
                // Caso contrário, reproduz do início
                playSelectedVideo(program.titulo, program.descricao, program.video_id);
            }
            
            toggleProgramGuide();
        });
        
        programList.appendChild(programItem);
    });
}

// Função para alternar a visibilidade do guia de programação
function toggleProgramGuide() {
    const programGuide = document.getElementById('program-guide');
    programGuide.classList.toggle('active');
}

// Função para alternar a visibilidade do menu hambúrguer
function toggleHamburgerMenu() {
    const navLinks = document.getElementById('nav-links');
    const hamburgerMenu = document.getElementById('hamburger-menu');
    
    navLinks.classList.toggle('active');
    hamburgerMenu.classList.toggle('active');
}

// Função para mudar o fundo do header ao rolar
function handleScroll() {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

// Event listeners
window.addEventListener('scroll', handleScroll);

// Botão para ativar/desativar som
document.getElementById('mute-toggle').addEventListener('click', toggleMute);

// Botão para atualizar o vídeo
document.getElementById('refresh-video').addEventListener('click', function() {
    if (isShowingSelectedVideo) {
        // Recarrega o mesmo vídeo selecionado
        playSelectedVideo(document.querySelector('.featured-title').textContent, 
                         document.querySelector('.featured-description').textContent,
                         document.getElementById('featured-video').querySelector('iframe').src.split('?')[0].split('/').pop());
    } else {
        // Recarrega a transmissão ao vivo
        updateFeaturedVideo();
    }
});

// Botão para retornar à transmissão ao vivo
document.getElementById('return-to-live').addEventListener('click', returnToLiveStream);

// Botões do guia de programação
document.getElementById('guide-toggle').addEventListener('click', toggleProgramGuide);
document.getElementById('close-guide').addEventListener('click', toggleProgramGuide);

// Botão do menu hambúrguer
document.getElementById('hamburger-menu').addEventListener('click', toggleHamburgerMenu);

// Fechar o menu ao clicar em um link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function() {
        document.getElementById('nav-links').classList.remove('active');
        document.getElementById('hamburger-menu').classList.remove('active');
    });
});

// Inicializar a aplicação
document.addEventListener('DOMContentLoaded', function() {
    // Atualiza o vídeo em destaque com base no horário atual e dia da semana
    updateFeaturedVideo();
    
    // Gera os cards de conteúdo
    generateContentCards();
    
    // Gera os botões dos dias da semana no guia de programação
    generateDayButtons();
    
    // Gera a lista de programas para o dia atual
    generateProgramList();
    
    // Inicia o monitoramento de progresso
    startProgressMonitoring();
    
    // Atualiza o vídeo em destaque quando o programa mudar
    setInterval(function() {
        if (!isShowingSelectedVideo) {
            // Verifica se ainda estamos no mesmo programa
            const currentTime = getCurrentTime();
            const currentDayOfWeek = getCurrentDayOfWeek();
            const schedule = parseCSV(weeklyScheduleData);
            
            // Filtra a programação para o dia atual
            const daySchedule = schedule.filter(item => Number(item.dia_da_semana) === currentDayOfWeek);
            
            // Encontra o vídeo atual com base no horário
            const currentSchedule = daySchedule.find(item => 
                isTimeInRange(currentTime, item.hora_inicio, item.hora_fim)
            );
            
            // Se o programa atual mudou, atualiza o vídeo
            if (!currentSchedule || currentSchedule.video_id !== currentLiveVideo?.id) {
                updateFeaturedVideo();
            }
        }
    }, 30000); // Verifica a cada 30 segundos
});