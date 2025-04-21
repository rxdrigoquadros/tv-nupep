/**
 * TV NUPEP - Script Principal
 * Responsável pela lógica de reprodução de vídeos e interface do usuário
 */

document.addEventListener('DOMContentLoaded', function() {
    // Acessar os dados processados do CSV
    const { videos, categories, videosByCategory } = window.tvNupepData;
    
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
    
    // Configurações da programação
    const PROGRAM_INTERVAL = 30; // minutos entre cada programa
    const DAYS_OF_WEEK = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    
    // Inicializar a interface
    initializeInterface();
    
    /**
     * Inicializa a interface do usuário e a programação
     */
    function initializeInterface() {
      createContentSections();
      generateProgramSchedule();
      setupEventListeners();
      startLiveStream();
      
      // Mostrar programação do dia atual
      const today = new Date().getDay();
      showDayProgram(today);
      
      // Ativar o botão do dia atual
      const todayButton = document.querySelector(`.day-button[data-day="${today}"]`);
      if (todayButton) todayButton.classList.add('active');
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
        
        sectionElement.appendChild(cardsContainer);
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
            showSchedule();
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
        });
        
        programList.appendChild(listItem);
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
      
      for (let i = 0; i < daySchedule.length; i++) {
        const program = daySchedule[i];
        const [hour, minute] = program.time.split(':').map(Number);
        
        if (hour > currentHour || (hour === currentHour && minute > currentMinute)) {
          // Encontramos o próximo programa, então o anterior é o atual
          if (i > 0) {
            currentProgram = daySchedule[i - 1];
          } else {
            // Se estivermos antes do primeiro programa do dia, pegar o último de ontem
            const yesterdayIndex = currentDay === 0 ? 6 : currentDay - 1;
            const yesterdaySchedule = programSchedule[yesterdayIndex];
            currentProgram = yesterdaySchedule[yesterdaySchedule.length - 1];
          }
          break;
        }
      }
      
      // Se não encontrou, pegar o último programa do dia
      if (!currentProgram && daySchedule.length > 0) {
        currentProgram = daySchedule[daySchedule.length - 1];
      }
      
      // Reproduzir o programa atual
      if (currentProgram) {
        playVideo(currentProgram.url, currentProgram.title);
        
        // Destacar o programa atual na lista
        const programItems = document.querySelectorAll('.program-item');
        programItems.forEach(item => {
          const time = item.querySelector('.program-time').textContent;
          if (time === currentProgram.time) {
            item.classList.add('current');
          }
        });
      }
    }
    
    /**
     * Exibe a interface de programação
     */
    function showSchedule() {
      videoContainer.classList.add('minimized');
      programContainer.classList.add('expanded');
    }
    
    /**
     * Reproduz um vídeo
     */
    function playVideo(url, title) {
      // Extrair o ID do vídeo do YouTube
      const videoId = url.split('v=')[1]?.split('&')[0] || '';
      
      if (!videoId) return;
      
      // Atualizar iframe do player
      videoPlayer.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
      videoTitle.textContent = title;
      
      // Voltar para modo de visualização do vídeo se estiver em modo de programação
      if (!isLiveMode) {
        isLiveMode = true;
        document.getElementById('live-button').classList.add('active');
        videoContainer.classList.remove('minimized');
        programContainer.classList.remove('expanded');
      }
      
      // Rolar para o topo para ver o vídeo
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    /**
     * Abre o player em uma janela popup
     */
    function openPlayerPopup() {
      const videoId = videoPlayer.src.split('embed/')[1]?.split('?')[0] || '';
      if (!videoId) return;
      
      const popupWindow = window.open(
        `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`,
        'playerPopup',
        'width=800,height=450,resizable=yes,scrollbars=yes,status=yes'
      );
      
      if (popupWindow) {
        popupWindow.focus();
      } else {
        alert('O popup foi bloqueado pelo navegador. Por favor, permita popups para este site.');
      }
    }
    
    /**
     * Formata a duração de segundos para formato MM:SS
     */
    function formatDuration(seconds) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
  });