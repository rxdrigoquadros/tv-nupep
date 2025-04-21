/**
 * TV NUPEP - Script Principal
 * Responsável pela lógica de reprodução de vídeos e interface do usuário
 */

document.addEventListener('DOMContentLoaded', function() {
  // Acessar os dados processados do CSV
  const { videos, categories, videosByCategory, getVideoIdFromUrl, formatDuration } = window.tvNupepData;
  
  // Elementos DOM principais
  const videoPlayer = document.getElementById('video-player');
  const videoTitle = document.getElementById('video-title');
  const videoContainer = document.querySelector('.video-container');
  const programContainer = document.querySelector('.program-container');
  const contentSections = document.querySelector('.content-sections');
  
  // Estado atual da aplicação
  let currentVideoIndex = 0;
  let isLiveMode = true;
  let programSchedule = [];
  let currentPlayingVideoId = '';
  
  // Configurações da programação
  const PROGRAM_INTERVAL = 30; // minutos entre cada programa
  const DAYS_OF_WEEK = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  
  // Inicializar a interface
  initializeInterface();
  
  /**
   * Inicializa a interface do usuário e a programação
   */
  function initializeInterface() {
    generateProgramSchedule();
    createContentSections();
    setupEventListeners();
    
    // Mostrar programação do dia atual
    const today = new Date().getDay();
    showDayProgram(today);
    
    // Ativar o botão do dia atual
    const todayButton = document.querySelector(`.day-button[data-day="${today}"]`);
    if (todayButton) todayButton.classList.add('active');
    
    // Iniciar com o modo ao vivo
    startLiveStream();
  }
  
  /**
   * Cria as seções de conteúdo baseadas nas categorias do CSV
   */
  function createContentSections() {
    contentSections.innerHTML = ''; // Limpar conteúdo existente
    
    // Para cada categoria, criar uma seção
    categories.forEach(category => {
      const categoryVideos = videosByCategory[category] || [];
      if (categoryVideos.length === 0) return;
      
      // Criar seção para a categoria
      const sectionElement = document.createElement('section');
      sectionElement.className = 'content-section';
      
      // Adicionar título da categoria
      const titleElement = document.createElement('h2');
      titleElement.textContent = category;
      sectionElement.appendChild(titleElement);
      
      // Criar container para os cards
      const cardsContainer = document.createElement('div');
      cardsContainer.className = 'cards-container';
      
      // Adicionar cards de vídeo para esta categoria (limitado a 10 por seção para performance)
      categoryVideos.slice(0, 10).forEach(video => {
        const card = createVideoCard(video);
        cardsContainer.appendChild(card);
      });
      
      sectionElement.appendChild(cardsContainer);
      
      // Adicionar botão "Ver mais" se houver mais de 10 vídeos
      if (categoryVideos.length > 10) {
        const moreButton = document.createElement('button');
        moreButton.className = 'more-button';
        moreButton.textContent = 'Ver mais';
        moreButton.addEventListener('click', () => {
          showCategoryModal(category, categoryVideos);
        });
        sectionElement.appendChild(moreButton);
      }
      
      contentSections.appendChild(sectionElement);
    });
  }
  
  /**
   * Cria um card de vídeo
   */
  function createVideoCard(video) {
    const card = document.createElement('div');
    card.className = 'card';
    card.setAttribute('data-url', video.url);
    card.setAttribute('data-title', video.title);
    
    const thumbnail = document.createElement('div');
    thumbnail.className = 'thumbnail';
    thumbnail.style.backgroundImage = `url(${video.thumbnail})`;
    
    const playIcon = document.createElement('div');
    playIcon.className = 'play-icon';
    playIcon.innerHTML = '<i class="fas fa-play"></i>';
    thumbnail.appendChild(playIcon);
    
    const infoElement = document.createElement('div');
    infoElement.className = 'info';
    
    const titleElement = document.createElement('h3');
    titleElement.textContent = video.title;
    
    const durationElement = document.createElement('p');
    durationElement.className = 'duration';
    durationElement.textContent = formatDuration(video.duration);
    
    infoElement.appendChild(titleElement);
    infoElement.appendChild(durationElement);
    
    card.appendChild(thumbnail);
    card.appendChild(infoElement);
    
    // Adicionar evento de clique para reproduzir o vídeo
    card.addEventListener('click', function() {
      playVideo(video.url, video.title);
      
      // Desativar modo ao vivo quando um vídeo específico é escolhido
      isLiveMode = false;
      const liveButton = document.getElementById('live-button');
      if (liveButton) liveButton.classList.remove('active');
    });
    
    return card;
  }
  
  /**
   * Mostra um modal com todos os vídeos de uma categoria
   */
  function showCategoryModal(categoryName, categoryVideos) {
    // Criar elemento modal
    const modal = document.createElement('div');
    modal.className = 'category-modal';
    
    // Cabeçalho do modal
    const header = document.createElement('div');
    header.className = 'modal-header';
    
    const title = document.createElement('h2');
    title.textContent = categoryName;
    
    const closeButton = document.createElement('button');
    closeButton.className = 'close-button';
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    header.appendChild(title);
    header.appendChild(closeButton);
    
    // Conteúdo do modal
    const content = document.createElement('div');
    content.className = 'modal-content';
    
    // Adicionar todos os vídeos da categoria
    categoryVideos.forEach(video => {
      const card = createVideoCard(video);
      content.appendChild(card);
    });
    
    // Adicionar elementos ao modal
    modal.appendChild(header);
    modal.appendChild(content);
    
    // Adicionar modal ao body
    document.body.appendChild(modal);
    
    // Fechar modal ao clicar fora
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });
  }
  
  /**
   * Configura os listeners de eventos para os botões e controles
   */
  function setupEventListeners() {
    // Evento para botões de dia da semana
    const dayButtons = document.querySelectorAll('.day-button');
    dayButtons.forEach(button => {
      button.addEventListener('click', function() {
        const day = parseInt(this.getAttribute('data-day'));
        showDayProgram(day);
        
        // Atualizar botão ativo
        dayButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
      });
    });
    
    // Evento para botão de ao vivo/programação
    const liveButton = document.getElementById('live-button');
    if (liveButton) {
      liveButton.addEventListener('click', function() {
        isLiveMode = !isLiveMode;
        this.classList.toggle('active', isLiveMode);
        
        if (isLiveMode) {
          startLiveStream();
        } else {
          videoContainer.classList.add('minimized');
          programContainer.classList.add('expanded');
        }
      });
    }
    
    // Evento para janela pop-up do player
    const popupButton = document.getElementById('popup-button');
    if (popupButton) {
      popupButton.addEventListener('click', function() {
        openPlayerPopup();
      });
    }
  }
  
  /**
   * Gera a programação da semana inteira
   */
  function generateProgramSchedule() {
    programSchedule = [];
    
    // Para cada dia da semana
    for (let day = 0; day < 7; day++) {
      const daySchedule = [];
      
      // Horário inicial: 8h da manhã
      let currentHour = 8;
      let currentMinute = 0;
      
      // Gerar programação até 22h (final do dia)
      while (currentHour < 22) {
        // Escolher um vídeo aleatório para este horário
        const randomIndex = Math.floor(Math.random() * videos.length);
        const video = videos[randomIndex];
        
        // Criar item de programação
        const scheduleItem = {
          time: `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`,
          title: video.title,
          url: video.url,
          duration: video.duration
        };
        
        daySchedule.push(scheduleItem);
        
        // Avançar o horário pelo intervalo de programa
        currentMinute += PROGRAM_INTERVAL;
        while (currentMinute >= 60) {
          currentHour++;
          currentMinute -= 60;
        }
      }
      
      programSchedule.push(daySchedule);
    }
  }
  
  /**
   * Mostra a programação de um dia específico
   */
  function showDayProgram(day) {
    const daySchedule = programSchedule[day];
    const programList = document.getElementById('program-list');
    programList.innerHTML = '';
    
    daySchedule.forEach(item => {
      const listItem = document.createElement('div');
      listItem.className = 'program-item';
      listItem.innerHTML = `
        <span class="program-time">${item.time}</span>
        <span class="program-title">${item.title}</span>
      `;
      
      // Adicionar evento para assistir este programa
      listItem.addEventListener('click', function() {
        playVideo(item.url, item.title);
        
        // Desativar modo ao vivo quando um programa específico é escolhido
        isLiveMode = false;
        const liveButton = document.getElementById('live-button');
        if (liveButton) liveButton.classList.remove('active');
        
        // Fechar a programação expandida
        videoContainer.classList.remove('minimized');
        programContainer.classList.remove('expanded');
      });
      
      programList.appendChild(listItem);
    });
    
    // Destacar o programa atual se estiver no modo ao vivo
    if (isLiveMode) {
      highlightCurrentProgram(day);
    }
  }
  
  /**
   * Destaca o programa atual na lista de programação
   */
  function highlightCurrentProgram(day) {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    const programItems = document.querySelectorAll('.program-item');
    programItems.forEach(item => {
      const timeElement = item.querySelector('.program-time');
      const [hour, minute] = timeElement.textContent.split(':').map(Number);
      
      item.classList.remove('current');
      
      // Verificar se este item é o programa atual
      if (hour <= currentHour && (hour < currentHour || minute <= currentMinute)) {
        // Verificar se é o programa atual mais recente
        const nextItem = item.nextElementSibling;
        if (!nextItem || 
            (nextItem && (() => {
              const [nextHour, nextMinute] = nextItem.querySelector('.program-time').textContent.split(':').map(Number);
              return nextHour > currentHour || (nextHour === currentHour && nextMinute > currentMinute);
            })())
           ) {
          item.classList.add('current');
        }
      }
    });
  }
  
  /**
   * Inicia a transmissão ao vivo (reproduz o vídeo atual da programação)
   */
  function startLiveStream() {
    // Obter o horário atual
    const now = new Date();
    const currentDay = now.getDay();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // Encontrar o programa atual na programação
    const daySchedule = programSchedule[currentDay];
    let currentProgram = null;
    
    // Procurar o programa atual (último programa que começou antes da hora atual)
    for (let i = daySchedule.length - 1; i >= 0; i--) {
      const program = daySchedule[i];
      const [hour, minute] = program.time.split(':').map(Number);
      
      if (hour < currentHour || (hour === currentHour && minute <= currentMinute)) {
        currentProgram = program;
        break;
      }
    }
    
    // Se não encontrou, verificar se está no início do dia antes do primeiro programa
    if (!currentProgram && daySchedule.length > 0) {
      const firstProgram = daySchedule[0];
      const [firstHour, firstMinute] = firstProgram.time.split(':').map(Number);
      
      if (currentHour < firstHour || (currentHour === firstHour && currentMinute < firstMinute)) {
        // Pegar o último programa do dia anterior
        const yesterdayIndex = (currentDay + 6) % 7; // dia anterior com ciclo (0-6)
        const yesterdaySchedule = programSchedule[yesterdayIndex];
        if (yesterdaySchedule.length > 0) {
          currentProgram = yesterdaySchedule[yesterdaySchedule.length - 1];
        }
      }
    }
    
    // Se ainda não encontrou, usar o primeiro programa do dia
    if (!currentProgram && daySchedule.length > 0) {
      currentProgram = daySchedule[0];
    }
    
    // Reproduzir o programa atual
    if (currentProgram) {
      playVideo(currentProgram.url, currentProgram.title);
      
      // Garantir que a interface esteja no modo de visualização de vídeo
      videoContainer.classList.remove('minimized');
      programContainer.classList.remove('expanded');
      
      // Destacar o programa atual na programação
      showDayProgram(currentDay);
    }
  }
  
  /**
   * Reproduz um vídeo
   */
  function playVideo(url, title) {
    // Extrair o ID do vídeo do YouTube
    const videoId = getVideoIdFromUrl(url);
    
    if (!videoId) return;
    
    // Salvar o vídeo atual
    currentPlayingVideoId = videoId;
    
    // Atualizar iframe do player
    videoPlayer.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    videoTitle.textContent = title;
    
    // Garantir que a interface esteja no modo de visualização de vídeo
    videoContainer.classList.remove('minimized');
    programContainer.classList.remove('expanded');
    
    // Rolar para o topo para ver o vídeo
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  /**
   * Abre o player em uma janela popup
   */
  function openPlayerPopup() {
    if (!currentPlayingVideoId) return;
    
    const popupWindow = window.open(
      `https://www.youtube.com/embed/${currentPlayingVideoId}?autoplay=1&rel=0`,
      'playerPopup',
      'width=800,height=450,resizable=yes,scrollbars=yes,status=yes'
    );
    
    if (popupWindow) {
      popupWindow.focus();
    } else {
      alert('O popup foi bloqueado pelo navegador. Por favor, permita popups para este site.');
    }
  }
});