// Dados dos vídeos em CSV
const videosData = `
"Nupep 40 Anos - Prof. Jorge Melchiades";"https://www.youtube.com/watch?v=V_D_kG9tzWo";119
"Cursos on-line - Psicologia Racional. Saiba mais em www.nupep.org/curso";"https://www.youtube.com/watch?v=dPPaS80FJeo";65
"Aula inédita com o Prof. Jorge Melchiades - Acesse o link abaixo para assistir a aula completa!";"https://www.youtube.com/watch?v=l6GSs0FBp9E";136
"Aula inédita 16/03/2024 - A Revolução do Filho da Luta 2 - Prof. Jorge Melchiades";"https://www.youtube.com/watch?v=DQWHvllQfow";208
"Mensagens do Amor Distante 2 - Direção Prof. Jorge Melchiades";"https://www.youtube.com/watch?v=PoO0fJxjeI0";201
"Estreia nesta segunda! Acompanhe a programação semanal do novo programa ""Mensagens do Amor Distante.";"https://www.youtube.com/watch?v=ohScz8gcbvA";108
"Ao nosso mestre; com carinho. Nosso eterno agradecimento; Prof. Jorge Melchiades";"https://www.youtube.com/watch?v=U8bjtB7OwDU";1558
"Mensagens do Amor Distante 1 - Direção Prof. Jorge Melchiades";"https://www.youtube.com/watch?v=K6Aa4WBqdDw";2140
"Aula INÉDITA! com o Prof. Jorge Melchiades. Não perca!";"https://www.youtube.com/watch?v=sFXARO9Kins";2433
"A Razão Terapêutica - Curso de Psicologia Racional on-line. Inscrições abertas!";"https://www.youtube.com/watch?v=SAuPDEim9Us";10271
"O Prof. Jorge Melchiades está de volta! Aula inédita! Tema: ""Jesus; Platão; a Verdade e o Otário"".";"https://www.youtube.com/watch?v=7T2z_Bx65zM";3798
"VOCABULÁRIO SIMPLIFICADO DA PSICOLOGIA RACIONAL 1 - Prof. Jorge Melchiades";"https://www.youtube.com/watch?v=hkk37OQmoO4";3654
"Boas Festas; Feliz Natal e Feliz Ano Novo!! - Prof. Jorge Melchiades";"https://www.youtube.com/watch?v=OYhM0Cgked4";997
"FELIZ ANO NOVO – 2022";"https://www.youtube.com/watch?v=FAmTEnC_myQ";991
"Sobre Jesus Homem e Deus - Prof. Jorge Melchiades";"https://www.youtube.com/watch?v=rHDEIX8q1BI";2051
"Nossa Posição na Existência - Grupo Comenta Reflexões do Professor Jorge Melchiades";"https://www.youtube.com/watch?v=WOwGehTnsIY";213
"Da Mitologia à Esquerda - Grupo Comenta o programa da Série Nossa Posição do Prof. Jorge Melchiades";"https://www.youtube.com/watch?v=XaOjIKbuaIg";273
"""O Revolucionário Conservador"" - Grupo Comenta o programa do Prof. Jorge Melchiades";"https://www.youtube.com/watch?v=mXpsrUXPwTM";304
"Freud e a Nossa Posição - Grupo Comenta a aula do Professor Jorge Melchiades";"https://www.youtube.com/watch?v=YEWMVHTS6K0";333
"Grupo Comenta o Programa : ""Consciência; luz que deflora trevas""";"https://www.youtube.com/watch?v=ARIQWMWSrv8";767
"IN-TENSÃO CONSCIENTE E IN-TENSÃO INCONSCIENTE - Prof. Jorge Melchiades Carvalho Filho";"https://www.youtube.com/watch?v=UczkwQQCbJ4";1781
"Ética 1 - O Problema Ético -  Prof. Jorge Melchiades Carvalho Filho";"https://www.youtube.com/watch?v=N2uOAWzvQk4";2220
"7 - Vivendo a Vida Alienado de Si - Prof. Jorge Melchiades Carvalho Filho";"https://www.youtube.com/watch?v=99V9xZx4NH0";819
"6 - No Fim da Picada - Prof. Jorge Melchiades Carvalho Filho";"https://www.youtube.com/watch?v=JvbK-V2RZHk";1318
"5 - A morte da bezerra - Prof. Jorge Melchiades Carvalho Filho";"https://www.youtube.com/watch?v=OyX26Srilvc";1190
"4 - Correndo por fora do sagrado - Prof. Jorge Melchiades Carvalho Filho";"https://www.youtube.com/watch?v=oS4cNMYncy0";1009
"3 - O nome não é a coisa que nomeia - Prof. Jorge Melchiades";"https://www.youtube.com/watch?v=pliZu3FB-wo";1249
"2 - O Valor que me dou - Prof. Jorge Melchiades Carvalho Filho";"https://www.youtube.com/watch?v=KCRUp33nmaY";1513
"1 - Quem sou? - Prof. Jorge Melchiades Carvalho Filho";"https://www.youtube.com/watch?v=mR3rWq09wmo";3167
"Freud; libido; prazer e personalidade - prof. Jorge Melchiades Carvalho Filho";"https://www.youtube.com/watch?v=k9jNEDRLjyU";2009
"Capoeira - documento raro de 1970";"https://www.youtube.com/watch?v=mnWvWSPKmTQ";6331
"My Way - Coral Nupep em Som Maior - VI Canta Inverno Vinhedo";"https://www.youtube.com/watch?v=fysdPuQULCo";3203
"Deus e o Idiota - Aula Prof. Jorge Melchiades Carvalho Filho";"https://www.youtube.com/watch?v=bG1M5ibrHRY";1247
"Conhecimento Vulgar - Prof. Jorge Melchiades Carvalho Filho";"https://www.youtube.com/watch?v=7ItIEvD7Y6c";2642
"Dalizio Moura como Elvis Presley e Coral Nupep em Som Maior no Show Terapia";"https://www.youtube.com/watch?v=E1-hOrQVwBM";4070
"Nietzsche 1 - Sob Suspeita - Prof. Jorge Melchiades Carvalho Filho";"https://www.youtube.com/watch?v=FJj9ymyZvIc";1443
"Frigidez Sexual e Trauma - Prof. Jorge Melchiades Carvalho Filho";"https://www.youtube.com/watch?v=zMO8JZ1YG9c";2210
"Freud; Instinto e Fase Oral - Prof. Jorge Melchiades Carvalho Filho";"https://www.youtube.com/watch?v=JVNMP7k4-QI";6697
"Ouvindo-te - Coral Nupep em Som Maior - IV Canta Inverno de Vinhedo";"https://www.youtube.com/watch?v=_xnLC0F-yDc";5584
"I'll Be There - Michael Jackson - Coral Nupep em Som Maior - IV Canta Inverno de Vinhedo";"https://www.youtube.com/watch?v=1nl-Wp4aKfw";5063
"Mentira; Linguagem e Poder- Prof. Jorge Melchiades Carvalho Filho";"https://www.youtube.com/watch?v=oQ_e3VdAzSE";1270
"Freud; Complexo de Édipo e regressão na autocracia - Prof. Jorge Melchiades Carvalho Filho";"https://www.youtube.com/watch?v=TNiKIhbiXg8";5254
"Complexo de Édipo / Regressão / Fixação - Autogestão e Razão 5 - Prof. Jorge Melchiades";"https://www.youtube.com/watch?v=zK6HtCmhaVk";14258
"Ben - Michael Jackson - Coral Nupep em Som Maior";"https://www.youtube.com/watch?v=2ACM1dOfNPw";1506
"I'll Be There - Michael Jackson - Coral Nupep em Som Maior";"https://www.youtube.com/watch?v=Fbt3r-_nafo";1593
"Autogestão e Razão 1 - Prof. Jorge Melchiades Carvalho Filho";"https://www.youtube.com/watch?v=WAJmZI8HvSE";1472
"Por una cabeza - Coral do NUPEP - 3º Canta Inverno - Vinhedo";"https://www.youtube.com/watch?v=iH-bI184LfM";3787
"Catarse; Freud; Breuer e Hipnose";"https://www.youtube.com/watch?v=E6KvNzFp42s";27646
"Hipnose; Freud e Catarse - Palestra do Prof. Jorge Melchiades Carvalho Filho";"https://www.youtube.com/watch?v=5BKvRUFN4ss";5449
"Liderança 1 e Consciência - Palestra de Psicologia do Prof. Jorge Melchiades Carvalho Filho";"https://www.youtube.com/watch?v=2Ol-DcEhsRg";2471
"Histeria; Freud e Catarse - Palestra do Prof. Jorge Melchiades Carvalho Filho";"https://www.youtube.com/watch?v=MYWNxEWJXFI";27132
"Aristóteles; Freud e Catarse - Palestra do Prof. Jorge Melchiades Carvalho Filho";"https://www.youtube.com/watch?v=f3ejajL6CE4";6444
"Freud e Id; Ego e Superego - Palestra do Prof. Jorge Melchíades Carvalho Filho";"https://www.youtube.com/watch?v=Lx7y4emORko";128723
"Al di la - 2º Canta Inverno Vinhedo - NUPEP";"https://www.youtube.com/watch?v=98OsTaXuVms";2059
"Funiculi Funicula - ENACOPI V - Coral NUPEP em Som Maior";"https://www.youtube.com/watch?v=P4fmY9CQ_1E";2544
"Filosofia; Semiótica e Poder 5/5 - Prof. Jorge Melchiades Carvalho Filho";"https://www.youtube.com/watch?v=EYtW8PYqPMw";1202
"Filosofia; Psicologia e Verdade 6/6  - Prof. Jorge Melchiades Carvalho Filho";"https://www.youtube.com/watch?v=Go7xQr0ZD0g";1343
"Filosofia; Semiótica e Poder 4/5 - Prof. Jorge Melchiades Carvalho Filho";"https://www.youtube.com/watch?v=URjiwNOHuRg";1333
"Filosofia; Semiótica e Poder 3/5 - Prof. Jorge Melchiades Carvalho Filho";"https://www.youtube.com/watch?v=MHq52DQpQbc";2758
"Filosofia; Semiótica e Poder 2/5 - Prof. Jorge Melchiades Carvalho Filho";"https://www.youtube.com/watch?v=p00lsUV0GvM";2139
"Filosofia; Semiótica e Poder 1/5 - Prof. Jorge Melchiades Carvalho Filho";"https://www.youtube.com/watch?v=hSPmQNAyzWc";4090
"Filosofia; Psicologia e Verdade 5/6  - Prof. Jorge Melchiades Carvalho Filho";"https://www.youtube.com/watch?v=ArauncQ3kM0";1427
"Filosofia; Psicologia e Mentira -4/4 - Palestra de Psicologia Racional - Prof. Jorge Melchiades";"https://www.youtube.com/watch?v=vgO6b-lR8Oc";1720
"Filosofia; Psicologia e Verdade 2/6 - Prof. Jorge Melchiades Carvalho Filho";"https://www.youtube.com/watch?v=apZzLQP_5RM";1662
"Filosofia; Psicologia e Verdade 1/6 - Prof. Jorge Melchiades";"https://www.youtube.com/watch?v=b4n16T6EdBM";5545
"Filosofia; Psicologia e Mentira -3/4 - Palestra de Psicologia Racional - Prof Jorge Melchiades";"https://www.youtube.com/watch?v=_VJPLK8wXXs";3073
"Filosofia; Psicologia e Mentira - 2/4 -  Palestra de Psicologia Racional - Prof. Jorge Melchiades";"https://www.youtube.com/watch?v=lqi91f5erHE";3725
"Filosofia; Psicologia e Mentira -1/4 - Palestra de Psicologia Racional - Prof. Jorge Melchiades";"https://www.youtube.com/watch?v=wvDQvt61AdA";11451
"Conhecendo a si mesmo 5/5 -  Prof. Jorge Melchiades  - Psicologia Racional";"https://www.youtube.com/watch?v=9Ht85lOPyHw";2028
"Conhecendo a si mesmo 4/5 - Prof. Jorge Melchiades Carvalho F.";"https://www.youtube.com/watch?v=Bs_fPZMYOj0";1378
"Conhecendo a si mesmo 3/5 - Prof. Jorge Melchiades Carvalho Filho";"https://www.youtube.com/watch?v=-yKJsxpPDQw";1812
"Conhecendo a si mesmo 2/5 - Palestra do Prof. Jorge Melchiades";"https://www.youtube.com/watch?v=4AJ3rq3NC5s";2910
"Conhecendo a si mesmo 1/5 - Prof. Jorge Melchiades Carvalho Filho";"https://www.youtube.com/watch?v=6SUnsbHkgdM";8627
`.trim();

// Dias da semana
const daysOfWeek = [
    'Domingo',
    'Segunda',
    'Terça',
    'Quarta',
    'Quinta',
    'Sexta',
    'Sábado'
];

// Função para processar o CSV
function processCSV(data) {
    const lines = data.split('\n');
    return lines.map(line => {
        // Considerando que os campos podem ter aspas duplas
        let fields = [];
        let currentField = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            if (line[i] === '"') {
                inQuotes = !inQuotes;
                continue;
            }
            
            if (line[i] === ';' && !inQuotes) {
                fields.push(currentField);
                currentField = '';
                continue;
            }
            
            currentField += line[i];
        }
        
        // Adicionar o último campo
        fields.push(currentField);
        
        // Extrair o ID do vídeo da URL
        const videoUrl = fields[1];
        const videoId = videoUrl.split('v=')[1];
        
        return {
            title: fields[0],
            url: fields[1],
            videoId: videoId,
            duration: parseInt(fields[2], 10)
        };
    });
}

// Processar todos os vídeos do CSV
const allVideos = processCSV(videosData);

// Criar uma programação semanal equilibrada com os vídeos do Nupep
function createWeeklySchedule(videos) {
    // Vamos organizar os vídeos por duração para criar blocos de programação adequados
    const shortVideos = videos.filter(v => v.duration < 600); // < 10 minutos
    const mediumVideos = videos.filter(v => v.duration >= 600 && v.duration < 1800); // 10-30 minutos
    const longVideos = videos.filter(v => v.duration >= 1800); // > 30 minutos
    
    // Função para criar um bloco de programação com base na hora do dia
    function createDayProgram(dayOfWeek) {
        const schedule = [];
        
        // Manhã cedo (6-9h): Vídeos curtos e motivacionais
        const morningEarly = shortVideos.slice(dayOfWeek % shortVideos.length, (dayOfWeek % shortVideos.length) + 3);
        let currentHour = 6;
        
        for (const video of morningEarly) {
            const startHour = currentHour;
            const duration = Math.max(30, Math.ceil(video.duration / 60)); // Duração mínima de 30 minutos
            
            // Arredondar para hora ou meia hora
            const endHour = startHour + Math.ceil(duration / 30) * 0.5;
            const startTime = `${Math.floor(startHour)}:${(startHour % 1) * 60 || '00'}`;
            const endTime = `${Math.floor(endHour)}:${(endHour % 1) * 60 || '00'}`;
            
            schedule.push({
                dia_da_semana: dayOfWeek,
                hora_inicio: startTime,
                hora_fim: endTime,
                video_id: video.videoId,
                titulo: video.title,
                descricao: `Uma aula do Prof. Jorge Melchiades sobre ${video.title.split('-').pop() || 'Psicologia Racional'}.`,
                duracao_segundos: video.duration
            });
            
            currentHour = endHour;
            if (currentHour >= 9) break;
        }
        
        // Manhã (9-12h): Vídeos médios, aulas básicas
        const morningLate = mediumVideos.slice(dayOfWeek % mediumVideos.length, (dayOfWeek % mediumVideos.length) + 2);
        currentHour = 9;
        
        for (const video of morningLate) {
            const startHour = currentHour;
            const duration = Math.max(60, Math.ceil(video.duration / 60)); // Duração mínima de 60 minutos
            
            // Arredondar para hora ou meia hora
            const endHour = startHour + Math.ceil(duration / 30) * 0.5;
            const startTime = `${Math.floor(startHour)}:${(startHour % 1) * 60 || '00'}`;
            const endTime = `${Math.floor(endHour)}:${(endHour % 1) * 60 || '00'}`;
            
            schedule.push({
                dia_da_semana: dayOfWeek,
                hora_inicio: startTime,
                hora_fim: endTime,
                video_id: video.videoId,
                titulo: video.title,
                descricao: `Uma aula do Prof. Jorge Melchiades sobre ${video.title.split('-').pop() || 'Psicologia Racional'}.`,
                duracao_segundos: video.duration
            });
            
            currentHour = endHour;
            if (currentHour >= 12) break;
        }
        
        // Tarde (12-18h): Vídeos longos, aulas avançadas
        const afternoon = longVideos.slice(dayOfWeek % longVideos.length, (dayOfWeek % longVideos.length) + 3);
        currentHour = 12;
        
        for (const video of afternoon) {
            const startHour = currentHour;
            const duration = Math.max(90, Math.ceil(video.duration / 60)); // Duração mínima de 90 minutos
            
            // Arredondar para hora ou meia hora
            const endHour = startHour + Math.ceil(duration / 30) * 0.5;
            const startTime = `${Math.floor(startHour)}:${(startHour % 1) * 60 || '00'}`;
            const endTime = `${Math.floor(endHour)}:${(endHour % 1) * 60 || '00'}`;
            
            schedule.push({
                dia_da_semana: dayOfWeek,
                hora_inicio: startTime,
                hora_fim: endTime,
                video_id: video.videoId,
                titulo: video.title,
                descricao: `Uma aula do Prof. Jorge Melchiades sobre ${video.title.split('-').pop() || 'Psicologia Racional'}.`,
                duracao_segundos: video.duration
            });
            
            currentHour = endHour;
            if (currentHour >= 18) break;
        }
        
        // Noite (18-23h): Mix de vídeos médios e longos
        const evening = [...mediumVideos, ...longVideos].slice(
            (dayOfWeek + 3) % mediumVideos.length, 
            (dayOfWeek + 3) % mediumVideos.length + 3
        );
        currentHour = 18;
        
        for (const video of evening) {
            const startHour = currentHour;
            const duration = Math.max(60, Math.ceil(video.duration / 60)); // Duração mínima de 60 minutos
            
            // Arredondar para hora ou meia hora
            const endHour = startHour + Math.ceil(duration / 30) * 0.5;
            const startTime = `${Math.floor(startHour)}:${(startHour % 1) * 60 || '00'}`;
            const endTime = `${Math.floor(endHour)}:${(endHour % 1) * 60 || '00'}`;
            
            schedule.push({
                dia_da_semana: dayOfWeek,
                hora_inicio: startTime,
                hora_fim: endTime,
                video_id: video.videoId,
                titulo: video.title,
                descricao: `Uma aula do Prof. Jorge Melchiades sobre ${video.title.split('-').pop() || 'Psicologia Racional'}.`,
                duracao_segundos: video.duration
            });
            
            currentHour = endHour;
            if (currentHour >= 23) break;
        }
        
        // Madrugada (23-6h): Programas de relaxamento e meditação
        const lateNight = longVideos.filter(v => 
            v.title.toLowerCase().includes("relaxa") || 
            v.title.toLowerCase().includes("medita") || 
            v.title.toLowerCase().includes("dormir") ||
            v.title.toLowerCase().includes("coral") ||
            v.title.toLowerCase().includes("música")
        );
        
        // Se não encontrar vídeos específicos, use alguns dos mais longos
        const nightVideos = lateNight.length > 0 ? lateNight : longVideos.slice(0, 3);
        
        schedule.push({
            dia_da_semana: dayOfWeek,
            hora_inicio: "23:00",
            hora_fim: "06:00",
            video_id: nightVideos[dayOfWeek % nightVideos.length].videoId,
            titulo: nightVideos[dayOfWeek % nightVideos.length].title,
            descricao: "Programa noturno de reflexão e relaxamento com o Prof. Jorge Melchiades.",
            duracao_segundos: nightVideos[dayOfWeek % nightVideos.length].duration
        });
        
        return schedule;
    }
    
    // Criar programação para cada dia da semana
    let weeklySchedule = [];
    for (let day = 0; day < 7; day++) {
        const daySchedule = createDayProgram(day);
        weeklySchedule = [...weeklySchedule, ...daySchedule];
    }
    
    return weeklySchedule;
}

// Definir os vídeos para diferentes categorias da interface
const featuredVideos = allVideos.slice(0, 6);
const popularVideos = allVideos.slice(0, 8);
const continueVideos = allVideos.slice(8, 16);
const recommendedVideos = allVideos.slice(16, 24);

// Criar vídeos para a interface
const videos = [
    ...popularVideos.map(v => ({
        id: v.videoId,
        title: v.title,
        description: `Uma aula do Prof. Jorge Melchiades sobre ${v.title.split('-').pop() || 'Psicologia Racional'}.`,
        thumbnail: `https://img.youtube.com/vi/${v.videoId}/mqdefault.jpg`,
        category: 'popular',
        views: `${Math.floor(Math.random() * 10) + 1}k visualizações`
    })),
    ...continueVideos.map(v => ({
        id: v.videoId,
        title: v.title,
        description: `Uma aula do Prof. Jorge Melchiades sobre ${v.title.split('-').pop() || 'Psicologia Racional'}.`,
        thumbnail: `https://img.youtube.com/vi/${v.videoId}/mqdefault.jpg`,
        category: 'continue',
        views: `${Math.floor(Math.random() * 10) + 1}k visualizações`
    })),
    ...recommendedVideos.map(v => ({
        id: v.videoId,
        title: v.title,
        description: `Uma aula do Prof. Jorge Melchiades sobre ${v.title.split('-').pop() || 'Psicologia Racional'}.`,
        thumbnail: `https://img.youtube.com/vi/${v.videoId}/mqdefault.jpg`,
        category: 'recommended',
        views: `${Math.floor(Math.random() * 10) + 1}k visualizações`
    }))
];

// Gerar a programação semanal
const generatedSchedule = createWeeklySchedule(allVideos);

// Converter em formato CSV para o código
let weeklyScheduleData = "dia_da_semana,hora_inicio,hora_fim,video_id,titulo,descricao,duracao_segundos\n";
generatedSchedule.forEach(item => {
    weeklyScheduleData += `${item.dia_da_semana},${item.hora_inicio},${item.hora_fim},${item.video_id},"${item.titulo}","${item.descricao}",${item.duracao_segundos}\n`;
});

// Configuração para o vídeo de intervalo (utilizando um vídeo adequado da lista)
const intervaloVideo = allVideos.find(v => 
    v.title.toLowerCase().includes("psicologia racional") && 
    v.duration > 1800
) || allVideos[9]; // Fallback para um vídeo longo caso não encontre

const offAirConfig = {
    videoId: intervaloVideo.videoId,
    title: "Intervalo de Programação - Psicologia Racional",
    description: "Estamos em um intervalo entre programas. A programação regular retornará em breve. Aproveite este conteúdo especial.",
    isOffAir: true
};