/**
 * TV NUPEP - Módulo de Dados de Vídeo
 * Responsável pelo processamento dos dados de vídeos do CSV
 */

// Função para processar o CSV e extrair os dados dos vídeos
function processCSVData(csvData) {
  const lines = csvData.trim().split('\n');
  const videos = [];
  const categories = new Set(); // Para armazenar categorias únicas
  
  lines.forEach(line => {
    const parts = line.split(';');
    if (parts.length >= 4) {
      const category = parts[0];
      const title = parts[1];
      const url = parts[2];
      const duration = parseInt(parts[3]);
      
      videos.push({
        category,
        title,
        url,
        duration,
        thumbnail: getThumbnailFromUrl(url)
      });
      
      // Adicionar categoria ao conjunto de categorias únicas
      categories.add(category);
    }
  });
  
  return {
    videos,
    categories: Array.from(categories) // Converter Set para Array
  };
}

// Função para agrupar vídeos por categoria
function groupVideosByCategory(videos) {
  const groupedVideos = {};
  
  videos.forEach(video => {
    if (!groupedVideos[video.category]) {
      groupedVideos[video.category] = [];
    }
    groupedVideos[video.category].push(video);
  });
  
  return groupedVideos;
}

// Função para extrair thumbnail do YouTube
function getThumbnailFromUrl(url) {
  const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
}

// Função para extrair o ID do vídeo do YouTube a partir da URL
function getVideoIdFromUrl(url) {
  if (url.includes('youtu.be/')) {
    return url.split('youtu.be/')[1].split('?')[0];
  } else if (url.includes('youtube.com/watch')) {
    return url.split('v=')[1]?.split('&')[0] || '';
  } else if (url.includes('youtube.com/embed/')) {
    return url.split('embed/')[1].split('?')[0];
  } else if (url.includes('youtube.com/shorts/')) {
    return url.split('shorts/')[1].split('?')[0];
  }
  return '';
}

// Função para formatar a duração do vídeo (segundos para MM:SS)
function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Seus dados CSV (substitua isso pelo conteúdo real do seu CSV)
const csvData = `Aula do prof Jorge;Aula inédita 16/03/2024 - A Revolução do Filho da Luta 2 - Prof. Jorge Melchiades;https://www.youtube.com/watch?v=DQWHvllQfow;208
Aula do prof Jorge;Nossa Posição na Existência - Grupo Comenta Reflexões do Professor Jorge Melchiades;https://www.youtube.com/watch?v=WOwGehTnsIY;213
Aula do prof Jorge;A REVOLUÇÃO DO FILHO DA LUTA 2  - Psicologia Racional - Prof. Jorge Melchiades;https://www.youtube.com/watch?v=M6QvjLNDLD0;266
Aula do prof Jorge;Da Mitologia à Esquerda - Grupo Comenta o programa da Série Nossa Posição do Prof. Jorge Melchiades;https://www.youtube.com/watch?v=XaOjIKbuaIg;273
Aula do prof Jorge;O Desejo do Filho da Luta - Série: Os Filhos da Luta com o Prof. Jorge Melchiades;https://www.youtube.com/watch?v=gVu_bnU1ZOM;283
Aula do prof Jorge;A REVOLUÇÃO DO FILHO DA LUTA  - Psicologia Racional - Prof. Jorge Melchiades;https://www.youtube.com/watch?v=cAL6tDgATDs;295
Aula do prof Jorge;"""O Revolucionário Conservador"" - Grupo Comenta o programa do Prof. Jorge Melchiades";https://www.youtube.com/watch?v=mXpsrUXPwTM;304
Aula do prof Jorge;A Revolução do Filho da LUTA - Aula inédita! #dialética #metafisica #etica #jorgemelchiades;https://www.youtube.com/shorts/Wi1qv-KB6PI;309
Aula do prof Jorge;Freud e a Nossa Posição - Grupo Comenta a aula do Professor Jorge Melchiades;https://www.youtube.com/watch?v=YEWMVHTS6K0;333
Aula do prof Jorge;Quem sou? - Aula  de Psicologia Racional - Prof. Jorge Melchiades;https://www.youtube.com/watch?v=J8ZdLy-GIa4;336
Aula de teste;"Aula inédita - Platão; Jesus e Preconceito - Prof. Jorge Melchiades  #jorgemelchiades #etica #jesus";https://www.youtube.com/shorts/aXYiK3zh-eU;1400
Aula de teste;"Filosofia; Psicologia e Verdade 5/6  - Prof. Jorge Melchiades Carvalho Filho";https://www.youtube.com/watch?v=ArauncQ3kM0;1427
Aula de teste;Nietzsche 1 - Sob Suspeita - Prof. Jorge Melchiades Carvalho Filho;https://www.youtube.com/watch?v=FJj9ymyZvIc;1443
Grupo;O Eu e a Matéria  - Curso  de Psicologia Racional por Conceitos - Prof. Jorge Melchiades;https://www.youtube.com/watch?v=nV7aPNccZ4s;1882
Grupo;JESUS E OS SINAIS   - Curso de Psicologia Racional- Prof. Jorge Melchiades;https://www.youtube.com/watch?v=8u1_I1dVk5c;1894
Grupo;"Direito de Expressão; Eu; Nós e Jesus   - Curso de Psicologia Racional- Prof. Jorge Melchiades";https://www.youtube.com/watch?v=r5CoVgJWb6g;1900
Outros;JESUS E O CABEÇA DE PULA-PULA   - Curso de Psicologia Racional- Prof. Jorge Melchiades;https://www.youtube.com/watch?v=qwfFtKJe33o;2016
Outros;Quem vence a luta metafísica entre diabo e espírito?  - Curso de Psicologia Racional - Prof. Jorge;https://www.youtube.com/watch?v=JgWKvGSoaOM;2024
Outros;Como você percebe a existência de Jesus?    - Curso de Psicologia Racional - Prof. Jorge;https://www.youtube.com/watch?v=WlC_relYgkc;2025`;

// Processar os dados do CSV para obter objetos utilizáveis
const { videos, categories } = processCSVData(csvData);
const videosByCategory = groupVideosByCategory(videos);

// Exportar variáveis para uso em outros scripts
window.tvNupepData = {
  videos,
  categories,
  videosByCategory,
  getVideoIdFromUrl,
  formatDuration
};