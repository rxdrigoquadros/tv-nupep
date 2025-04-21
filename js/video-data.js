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
    const videoId = url.split('v=')[1]?.split('&')[0] || '';
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  }
  
  // Função para formatar a duração do vídeo (segundos para MM:SS)
  function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  // Seus dados CSV (versão completa do CSV)
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
  Aula do prof Jorge;Vamos refletir e rever os próprios conhecimentos? - Sáb. 16h com o Prof. Jorge Melchiades;https://www.youtube.com/shorts/R1qPhiXyP9U;425
  Aula do prof Jorge;"Grupo Comenta o Programa : ""Consciência; luz que deflora trevas""";https://www.youtube.com/watch?v=ARIQWMWSrv8;767
  Aula do prof Jorge;7 - Vivendo a Vida Alienado de Si - Prof. Jorge Melchiades Carvalho Filho;https://www.youtube.com/watch?v=99V9xZx4NH0;819
  Aula do prof Jorge;"Grupo comenta; reflexões do Prof. Jorge Melchiades #jorgemelchiades";https://www.youtube.com/shorts/--AoNJP2nIA;827
  Aula do prof Jorge;Grupo comenta  MOTIVAÇÃO - aula 9 - Psicologia Racional -  Prof. Jorge Melchiades;https://www.youtube.com/watch?v=yabBeXvIdAc;838
  Aula do prof Jorge;Grupo comenta  aula 5 do curso de Psicologia Racional -  Prof. Jorge Melchiades;https://www.youtube.com/watch?v=hzaRE1-18rA;876
  Aula do prof Jorge;Grupo comenta  aula 7 do curso de Psicologia Racional -  Prof. Jorge Melchiades;https://www.youtube.com/watch?v=p6JSbCgUVBU;911
  Aula do prof Jorge;Grupo comenta A EXPERIÊNCIA DE EVOLUIR   -   Psicologia Racional- Prof. Jorge Melchiades;https://www.youtube.com/watch?v=-Zs3661hth0;923
  Aula do prof Jorge;FELIZ ANO NOVO – 2022;https://www.youtube.com/watch?v=FAmTEnC_myQ;991
  Aula do prof Jorge;OS FILHOS DA LUTA SEM ÉTICA  - Psicologia Racional -Prof. Jorge Melchiades;https://www.youtube.com/watch?v=1NR9L7LlNJY;992
  Aula do prof Jorge;"Boas Festas; Feliz Natal e Feliz Ano Novo!! - Prof. Jorge Melchiades";https://www.youtube.com/watch?v=OYhM0Cgked4;997
  Aula do prof Jorge;4 - Correndo por fora do sagrado - Prof. Jorge Melchiades Carvalho Filho;https://www.youtube.com/watch?v=oS4cNMYncy0;1009
  Aula do prof Jorge;Grupo comenta  aula 6 do curso de Psicologia Racional -  Prof. Jorge Melchiades;https://www.youtube.com/watch?v=VcIcscLrrHY;1088
  Aula do prof Jorge;5 - A morte da bezerra - Prof. Jorge Melchiades Carvalho Filho;https://www.youtube.com/watch?v=OyX26Srilvc;1190
  Aula do prof Jorge;"Filosofia; Semiótica e Poder 5/5 - Prof. Jorge Melchiades Carvalho Filho";https://www.youtube.com/watch?v=EYtW8PYqPMw;1202
  Aula do prof Jorge;Deus e o Idiota - Aula Prof. Jorge Melchiades Carvalho Filho;https://www.youtube.com/watch?v=bG1M5ibrHRY;1247
  Aula do prof Jorge;3 - O nome não é a coisa que nomeia - Prof. Jorge Melchiades;https://www.youtube.com/watch?v=pliZu3FB-wo;1249
  Aula do prof Jorge;Grupo comenta OS DOIS PRIMEIROS PRINCÍPIOS      -   Psicologia Racional- Prof. Jorge Melchiades;https://www.youtube.com/watch?v=oE0i6kvCeQs;1258
  Aula do prof Jorge;"Mentira; Linguagem e Poder- Prof. Jorge Melchiades Carvalho Filho";https://www.youtube.com/watch?v=oQ_e3VdAzSE;1270
  Aula do prof Jorge;6 - No Fim da Picada - Prof. Jorge Melchiades Carvalho Filho;https://www.youtube.com/watch?v=JvbK-V2RZHk;1318
  Aula do prof Jorge;Vocabulário  da  Psicologia Racional 9 - Prof. Jorge Melchiades;https://www.youtube.com/watch?v=P8ZNg5NE4-8;1323
  Aula do prof Jorge;"Filosofia; Semiótica e Poder 4/5 - Prof. Jorge Melchiades Carvalho Filho";https://www.youtube.com/watch?v=URjiwNOHuRg;1333
  Aula do prof Jorge;NÃO MORRA! SEJA ESPERTO!  - Aula 4 da Morte é uma farsa - Prof. Jorge Melchiades;https://www.youtube.com/watch?v=2hKITEF1yYk;1333
  Aula do prof Jorge;"Filosofia; Psicologia e Verdade 6/6  - Prof. Jorge Melchiades Carvalho Filho";https://www.youtube.com/watch?v=Go7xQr0ZD0g;1343
  Aula do prof Jorge;Grupo comenta  aula 4 do curso de Psicologia Racional -  Prof. Jorge Melchiades;https://www.youtube.com/watch?v=-zPCgZcWZPM;1343
  Aula do prof Jorge;Autogestão e Razão 2 - Grupo comenta aula de Psicologia Racional -  Prof. Jorge Melchiades;https://www.youtube.com/watch?v=RJGgPlUmI-U;1375
  Aula do prof Jorge;Conhecendo a si mesmo 4/5 - Prof. Jorge Melchiades Carvalho F.;https://www.youtube.com/watch?v=Bs_fPZMYOj0;1378
  Aula de teste;"Aula inédita - Platão; Jesus e Preconceito - Prof. Jorge Melchiades  #jorgemelchiades #etica #jesus";https://www.youtube.com/shorts/aXYiK3zh-eU;1400
  Aula de teste;"Filosofia; Psicologia e Verdade 5/6  - Prof. Jorge Melchiades Carvalho Filho";https://www.youtube.com/watch?v=ArauncQ3kM0;1427
  Aula de teste;Nietzsche 1 - Sob Suspeita - Prof. Jorge Melchiades Carvalho Filho;https://www.youtube.com/watch?v=FJj9ymyZvIc;1443
  Aula de teste;Autogestão e Razão 1 - Prof. Jorge Melchiades Carvalho Filho;https://www.youtube.com/watch?v=WAJmZI8HvSE;1472
  Aula de teste;Ben - Michael Jackson - Coral Nupep em Som Maior;https://www.youtube.com/watch?v=2ACM1dOfNPw;1506
  Aula de teste;2 - O Valor que me dou - Prof. Jorge Melchiades Carvalho Filho;https://www.youtube.com/watch?v=KCRUp33nmaY;1513
  Aula de teste;"PLATÃO; JESUS E A TRAIÇÃO    -   Psicologia Racional- Prof. Jorge Melchiades";https://www.youtube.com/watch?v=yk8NmHifMJ0;1532
  Aula de teste;"Jesus; Platão; Verdade e Justiça    -   Psicologia Racional- Prof. Jorge Melchiades";https://www.youtube.com/watch?v=KA1sH-3i71c;1536
  Aula de teste;"Ao nosso mestre; com carinho. Nosso eterno agradecimento; Prof. Jorge Melchiades";https://www.youtube.com/watch?v=U8bjtB7OwDU;1558
  Aula de teste;I'll Be There - Michael Jackson - Coral Nupep em Som Maior;https://www.youtube.com/watch?v=Fbt3r-_nafo;1593
  Aula de teste;O Eu e o Condicionamento Operante - Curso  de Psicologia Racional - Prof. Jorge Melchiades;https://www.youtube.com/watch?v=SG1GlnibhzU;1605
  Aula de teste;Curso de Psicologia Racional por Conceitos 6 - Prof. Jorge Melchiades;https://www.youtube.com/watch?v=LW9zIISCDRU;1640
  Aula de teste;"Filosofia; Psicologia e Verdade 2/6 - Prof. Jorge Melchiades Carvalho Filho";https://www.youtube.com/watch?v=apZzLQP_5RM;1662
  Aula de teste;Jesus não come o pão que o diabo amassou - Curso de Psicologia Racional - Prof. Jorge Melchiades;https://www.youtube.com/watch?v=0qjuJ6szuhA;1662
  Aula de teste;Valores - Curso  de Psicologia Racional por Conceitos - Prof. Jorge Melchiades;https://www.youtube.com/watch?v=sOiOLe4pylI;1672
  Aula de teste;"Aula inédita! - ""Os filhos da luta sem ética"" Prof. Jorge Melchiades";https://www.youtube.com/shorts/g8H9n_Ef37M;1700
  Aula de teste;Comunicação e Desinformação  - Curso  de Psicologia Racional por Conceitos - Prof. Jorge Melchiades;https://www.youtube.com/watch?v=95vcSEpg-Ow;1710
  Aula de teste;"Filosofia; Psicologia e Mentira -4/4 - Palestra de Psicologia Racional - Prof. Jorge Melchiades";https://www.youtube.com/watch?v=vgO6b-lR8Oc;1720
  Aula de teste;CIÊNCIA  E VIDA  APÓS  A  VIDA  -  Prof. Jorge Melchiades;https://www.youtube.com/watch?v=tXe6JSwJ0zM;1750
  Aula de teste;A PROVA DA EXISTÊNCIA DE JESUS   -   Psicologia Racional- Prof. Jorge Melchiades;https://www.youtube.com/watch?v=4xaboGLJgys;1756
  Aula de teste;O Eu e a Ordem Mestra  - Curso  de Psicologia Racional por Conceitos - Prof. Jorge Melchiades;https://www.youtube.com/watch?v=S84GQMwlnsc;1778
  Aula de teste;IN-TENSÃO CONSCIENTE E IN-TENSÃO INCONSCIENTE - Prof. Jorge Melchiades Carvalho Filho;https://www.youtube.com/watch?v=UczkwQQCbJ4;1781
  Aula de teste;"Aula inédita! - Da Série: ""A Morte é uma Farsa: Ciência e Vida após a Vida"" Prof. Jorge Melchiades";https://www.youtube.com/shorts/BmWcGSMF4TU;1800
  Aula de teste;Aula inédita! Empirismo no vocabulário 10 da Psicologia Racional - Prof. Jorge Melchiades;https://www.youtube.com/shorts/KpP_p-9rF1k;1800
  Aula de teste;"ESTREIA do novo programa ""Mensagens do Amor Distante"" sob a direção do Prof. Jorge Melchiades";https://www.youtube.com/shorts/hxSkWkzcg0g;1800
  Aula de teste;"Aula inédita! ""Vida após a Vida: Quem Morre?"" - Série ""A Morte é uma farsa"" Prof. Jorge Melchiades";https://www.youtube.com/shorts/wRv-hqzMAhI;1800
  Aula de teste;Conhecendo a si mesmo 3/5 - Prof. Jorge Melchiades Carvalho Filho;https://www.youtube.com/watch?v=-yKJsxpPDQw;1812
  Aula de teste;Autogestão e Razão - Curso de Psicologia Racional - Prof. Jorge Melchiades;https://www.youtube.com/watch?v=j2cf1FhM5Mc;1825
  Aula de teste;Vocabulário  da  Psicologia Racional 8 - Prof. Jorge Melchiades;https://www.youtube.com/watch?v=uBXrt9OQT6E;1833
  Aula de teste;A Evolução da Inteligência - Curso  de Psicologia Racional por Conceitos - Prof. Jorge Melchiades;https://www.youtube.com/watch?v=k1Ze9IFKV40;1841
  Aula de teste;Tipos de Conhecimento - Curso de Psicologia Racional por Conceitos - Prof. Jorge Melchiades;https://www.youtube.com/watch?v=XDsAxv_Vy3o;1855
  Aula de teste;Jesus errou também? - Curso de Psicologia Racional - Prof. Jorge Melchiades;https://www.youtube.com/watch?v=qv_mOXAraWI;1856
  Aula de teste;Como Mateus percebeu Jesus?    - Curso de Psicologia Racional - Prof. Jorge;https://www.youtube.com/watch?v=yT-0nLPZHbM;1858
  Aula de teste;A Experiência de Evoluir - Prof. Jorge Melchiades;https://www.youtube.com/watch?v=auhaPt8kc9s;1866
  Aula de teste;Os dois primeiros princípios   -   Psicologia Racional- Prof. Jorge Melchiades;https://www.youtube.com/watch?v=P-_TFl9P_hw;1871
  Aula de teste;Motivação - Curso  de Psicologia Racional por Conceitos - Prof. Jorge Melchiades;https://www.youtube.com/watch?v=jedDRPcHKQM;1881
  Aula de teste;O Eu e a Fobia  - Curso  de Psicologia Racional por Conceitos - Prof. Jorge Melchiades;https://www.youtube.com/watch?v=_3Rk5N66KuU;1882
  Grupo;O Eu e a Matéria  - Curso  de Psicologia Racional por Conceitos - Prof. Jorge Melchiades;https://www.youtube.com/watch?v=nV7aPNccZ4s;1882
  Grupo;JESUS E OS SINAIS   - Curso de Psicologia Racional- Prof. Jorge Melchiades;https://www.youtube.com/watch?v=8u1_I1dVk5c;1894
  Grupo;"Direito de Expressão; Eu; Nós e Jesus   - Curso de Psicologia Racional- Prof. Jorge Melchiades";https://www.youtube.com/watch?v=r5CoVgJWb6g;1900
  Grupo;Curso de Psicologia Racional por Conceitos 4 - Prof. Jorge Melchiades;https://www.youtube.com/watch?v=07BIZNG4GfE;1902
  Grupo;Epistemologia e Valorização das coisas - Curso  de Psicologia Racional - Prof. Jorge Melchiades;https://www.youtube.com/watch?v=1YJ1kjqA-D8;1913
  Grupo;EMPIRISMO no Vocabulário  10 da  Psicologia Racional - Prof. Jorge Melchiades;https://www.youtube.com/watch?v=Np4Mql53OqM;1915
  Grupo;Jesus foi Malandro?   -   Psicologia Racional- Prof. Jorge Melchiades;https://www.youtube.com/watch?v=dDsoP02w0KM;1927
  Grupo;Jesus foi crucificado por divulgar fake news? - Curso de Psicologia Racional- Prof. Jorge Melchiades;https://www.youtube.com/watch?v=kKJLnu-tsDM;1939
  Grupo;Curso de Psicologia Racional por Conceitos 7 - Prof. Jorge Melchiades;https://www.youtube.com/watch?v=iA8T0afzF_w;1941
  Grupo;O Eu e a Liberdade  - Curso  de Psicologia Racional por Conceitos - Prof. Jorge Melchiades;https://www.youtube.com/watch?v=_yHM7hh5gbw;1942
  Grupo;No Sonho de Mateus com Jesus - Curso de Psicologia Racional - Prof. Jorge Melchiades;https://www.youtube.com/watch?v=KCq-50yN9iY;1943
  Grupo;"Freud; Jesus e o fantasma      -   Psicologia Racional- Prof. Jorge Melchiades";https://www.youtube.com/watch?v=t7EkW6ab75o;1946
  Grupo;"Jesus; Verdade e Milagres   - Curso de Psicologia Racional- Prof. Jorge Melchiades";https://www.youtube.com/watch?v=fYnqeLRx2A4;1960
  Grupo;A CULPA DE NÃO SER COMO JESUS - Curso de Psicologia Racional- Prof. Jorge Melchiades;https://www.youtube.com/watch?v=Oqm5Mwk2qjM;1961
  Grupo;"Alma; Justiça e Jesus    -   Psicologia Racional- Prof. Jorge Melchiades";https://www.youtube.com/watch?v=GFQ7rK3LeuQ;1962
  Grupo;"Alma; Fantasma;  Jesus e Nós    -   Psicologia Racional- Prof. Jorge Melchiades";https://www.youtube.com/watch?v=bMBJbG2qqVo;1966
  Grupo;A verdade de Jesus ao Pilatos de hoje - Curso de Psicologia Racional- Prof. Jorge Melchiades;https://www.youtube.com/watch?v=EdHTgehsma0;1967
  Grupo;Jesus e o crente que é cavalo   - Curso de Psicologia Racional- Prof. Jorge Melchiades;https://www.youtube.com/watch?v=2qAh-YATImo;1976
  Grupo;O diabo usa poder político para o bem? - Curso de Psicologia Racional - Prof. Jorge Melchiades;https://www.youtube.com/watch?v=vWrZN7BaxVE;1980
  Grupo;"Jesus; um refém do poder ideológico  - Curso de Psicologia Racional - Prof. Jorge Melchiades";https://www.youtube.com/watch?v=49sxEW9YyCE;1984
  Grupo;Curso de Psicologia Racional por Conceitos 5 - Prof. Jorge Melchiades;https://www.youtube.com/watch?v=-M4gufPI54w;1984
  Grupo;Jesus frente ao mal e ao bem safado - Curso de Psicologia Racional - Prof. Jorge Melchiades;https://www.youtube.com/watch?v=1HPzkkISl1Y;1986
  Grupo;JESUS FOI UM CORDEIRO ARMADO? - Curso de Psicologia Racional -  Prof. Jorge Melchiades;https://www.youtube.com/watch?v=rKmMZPV_aE4;1989
  Grupo;O FINALISMO DE JESUS - Curso de Psicologia Racional- Prof. Jorge Melchiades;https://www.youtube.com/watch?v=DfRZA-H_p70;1998
  Grupo;"Aula inédita! ""Razão Terapêutica e o Anjo Morcego"" - Prof. Jorge Melchiades";https://www.youtube.com/shorts/kJhqUlFItBk;2000
  Grupo;Aula inédita e SÉRIE inédita do Prof. Jorge Melchiades - Psicologia Racional e Transcendente.;https://www.youtube.com/shorts/FLqfK5_pW7E;2000
  Grupo;Jesus é Deus mesmo?  - Curso de Psicologia Racional- Prof. Jorge Melchiades;https://www.youtube.com/watch?v=7tKE5HpaSDY;2001
  Grupo;O que tanto tenta os crentes no deserto das  aflições? - Curso de Psicologia Racional - Prof. Jorge;https://www.youtube.com/watch?v=9HAu6s_pjz4;2002
  Grupo;Níveis de Inteligência - Curso  de Psicologia Racional por Conceitos - Prof. Jorge Melchiades;https://www.youtube.com/watch?v=rqOHn-UjbsU;2007
  Grupo;"Freud; libido; prazer e personalidade - prof. Jorge Melchiades Carvalho Filho";https://www.youtube.com/watch?v=k9jNEDRLjyU;2009
  Grupo;"PLATÃO; JESUS E PRECONCEITO     -   Psicologia Racional- Prof. Jorge Melchiades";https://www.youtube.com/watch?v=q3UbvRi-lpI;2010
  Grupo;RAZÃO TERAPÊUTICA E O ANJO MORCEGO - Psicologia Racional e Transcendente 2- Prof. Jorge Melchiades;https://www.youtube.com/watch?v=I-mnmUuH0Sk;2015
  Outros;JESUS E O CABEÇA DE PULA-PULA   - Curso de Psicologia Racional- Prof. Jorge Melchiades;https://www.youtube.com/watch?v=qwfFtKJe33o;2016
  Outros;Quem vence a luta metafísica entre diabo e espírito?  - Curso de Psicologia Racional - Prof. Jorge;https://www.youtube.com/watch?v=JgWKvGSoaOM;2024
  Outros;Como você percebe a existência de Jesus?    - Curso de Psicologia Racional - Prof. Jorge;https://www.youtube.com/watch?v=WlC_relYgkc;2025
  Outros;Conhecendo a si mesmo 5/5 -  Prof. Jorge Melchiades  - Psicologia Racional;https://www.youtube.com/watch?v=9Ht85lOPyHw;2028
  Outros;A boa nova de Jesus é ética? - Curso de Psicologia Racional - Prof. Jorge Melchiades;https://www.youtube.com/watch?v=1kh_sw6z3zg;2031
  Outros;Jesus foi de sistema?  - Curso de Psicologia Racional- Prof. Jorge Melchiades;https://www.youtube.com/watch?v=7E4Sn4h1NYk;2037
  Outros;A Comunhão com Jesus - Curso de Psicologia Racional - Prof. Jorge Melchiades;https://www.youtube.com/watch?v=QreZJvQQN3w;2041
  Outros;Jesus era crente que sabia tudo? - Curso de Psicologia Racional - Prof. Jorge Melchiades;https://www.youtube.com/watch?v=xsmN_IB_gXs;2042
  Outros;JESUS DEFENDIA QUAL VERDADE? - Curso de Psicologia Racional- Prof. Jorge Melchiades;https://www.youtube.com/watch?v=9jGm_cVdBH8;2050
  Outros;Sobre Jesus Homem e Deus - Prof. Jorge Melchiades;https://www.youtube.com/watch?v=rHDEIX8q1BI;2051
  Outros;A ÉTICA DO JESUS ARMADO - Curso de Psicologia Racional -  Prof. Jorge Melchiades;https://www.youtube.com/watch?v=ZRVoXfP6Fmc;2055
  Outros;Al di la - 2º Canta Inverno Vinhedo - NUPEP;https://www.youtube.com/watch?v=98OsTaXuVms;2059
  Outros;O sistema inteligente de Jesus  - Curso de Psicologia Racional - Prof. Jorge Melchiades;https://www.youtube.com/watch?v=xufd4kwWRyE;2060
  Outros;COMO É O HOMEM JESUS?    - Curso de Psicologia Racional - Prof. Jorge;https://www.youtube.com/watch?v=R1zr7kdED7w;2061
  Outros;Grupo comenta  TIPOS DE CONHECIMENTO - aula 8 - Psicologia Racional -  Prof. Jorge Melchiades;https://www.youtube.com/watch?v=ENYXXhPD4Us;2074
  Outros;Foi Deus que criou o diabo e o espírito?  - Curso de Psicologia Racional - Prof. Jorge;https://www.youtube.com/watch?v=bRFOSVkCP9Y;2078
  Outros;Foi o diabo metafísico que tentou Jesus no deserto?  - Curso de Psicologia Racional - Prof. Jorge;https://www.youtube.com/watch?v=1bPY03ueLMo;2095
  Outros;"Jesus; Platão; a verdade e o otário    -   Psicologia Racional- Prof. Jorge Melchiades";https://www.youtube.com/watch?v=75l4W35WBsY;2096
  Outros;Religiosidade e Religião - Curso de Psicologia Racional - Prof. Jorge Melchiades;https://www.youtube.com/watch?v=Vax9bGSJWho;2099
  Outros;PLATÃO E JESUS NÃO FORAM OTÁRIOS!    -   Psicologia Racional- Prof. Jorge Melchiades;https://www.youtube.com/watch?v=Mg0yRb8r6rc;2104
  Outros;Que espírito ou diabo manda em Jesus?  - Curso de Psicologia Racional - Prof. Jorge;https://www.youtube.com/watch?v=eA4maqBuAQE;2114
  Outros;O alienado de Jesus não crê nele - Curso de Psicologia Racional - Prof. Jorge Melchiades;https://www.youtube.com/watch?v=iBFMdRqWNSg;2131
  Outros;"Filosofia; Semiótica e Poder 2/5 - Prof. Jorge Melchiades Carvalho Filho";https://www.youtube.com/watch?v=p00lsUV0GvM;2139
  Outros;Mensagens do Amor Distante 1 - Direção Prof. Jorge Melchiades;https://www.youtube.com/watch?v=K6Aa4WBqdDw;2140
  Outros;SOBRE JESUS HOMEM E DEUS  2 - Curso de Psicologia Racional- Prof. Jorge Melchiades;https://www.youtube.com/watch?v=SPv1mFgomFw;2144
  Outros;Jesus e o fantasma de Hamlet      -   Psicologia Racional- Prof. Jorge Melchiades;https://www.youtube.com/watch?v=CX7J_tH8TU0;2145
  Outros;Vocabulário  da  Psicologia Racional 7 - Mentiras e Verdades -  Prof. Jorge Melchiades;https://www.youtube.com/watch?v=zmL-ygtP7vQ;2148
  Outros;Frigidez Sexual e Trauma - Prof. Jorge Melchiades Carvalho Filho;https://www.youtube.com/watch?v=zMO8JZ1YG9c;2210
  Outros;Ética 1 - O Problema Ético -  Prof. Jorge Melchiades Carvalho Filho;https://www.youtube.com/watch?v=N2uOAWzvQk4;2220
  Outros;Jesus existiu? - Curso  de Psicologia Racional - Prof. Jorge Melchiades;https://www.youtube.com/watch?v=eptoF4IZmJw;2234
  Outros;"Otário Acredita no Mentiroso; Jesus Não!    -   Psicologia Racional- Prof. Jorge Melchiades";https://www.youtube.com/watch?v=tt8bUG9K6DA;2241
  Outros;O Crente que é Racional -- Curso de Psicologia Racional - Prof. Jorge Melchiades;https://www.youtube.com/watch?v=0exXaZbPAqc;2271
  Outros;MAIS PROVAS DE QUE A MORTE É UMA MENTIRA   -  Psicologia Racional- Prof. Jorge Melchiades;https://www.youtube.com/watch?v=vduwdCitJbE;2296
  Outros;Quem disse que o seu destino é morrer? - Aula 3 da Morte é uma farsa - Prof. Jorge Melchiades;https://www.youtube.com/watch?v=nalZFQcQBNU;2313
  Outros;"PLATÃO; JESUS E O MUNDO DAS IDEIAS     -   Psicologia Racional- Prof. Jorge Melchiades";https://www.youtube.com/watch?v=Qa9wCkno1ag;2313
  Outros;DEFESAS DA PERSONALIDADE no tema JESUS EXISTIU? - Prof. Jorge Melchiades;https://www.youtube.com/watch?v=uzqxdqKpBXk;2322
  Outros;A Vida Falsa de Jesus  - Curso de Psicologia Racional - Prof. Jorge Melchiades;https://www.youtube.com/watch?v=NaOxDblmeak;2324
  Outros;"Compensação;  Política e Consciência -Curso de Psicologia Racional - Prof. Jorge Melchiades";https://www.youtube.com/watch?v=wPqt1PLsSXc;2369
  Outros;"Os ignorantes de si; o ódio e Jesus  - Curso de Psicologia Racional - Prof. Jorge Melchiades";https://www.youtube.com/watch?v=e2G3c9Bzky4;2389
  Outros;A ÉTICA E O PARASITA SOCIAL - Psicologia Racional - Prof. Jorge Melchiades;https://www.youtube.com/watch?v=pRy7FSZaQg4;2398
  Outros;JESUS SÓ EXISTIU NA CABEÇA DOS CRENTES?  - Curso de Psicologia Racional - Prof. Jorge Melchiades;https://www.youtube.com/watch?v=0ncDJXOE2p8;2399
  Outros;Jesus é Deus??? - Curso de Psicologia Racional - Prof. Jorge Melchiades;https://www.youtube.com/watch?v=nN0H1mmiYfQ;2409
  Outros;Jesus Homem e Verdade  -Curso de Psicologia Racional - Prof. Jorge Melchiades;https://www.youtube.com/watch?v=TPRATbFElCk;2413
  Outros;Vocabulário  da  Psicologia Racional 6 - Associação de ideias  e Verdade -  Prof. Jorge Melchiades;https://www.youtube.com/watch?v=F7acL_thgo4;2421
  Outros;TODO CRENTE SABE SE JESUS EXISTIU OU NÃO - Curso de Psicologia Racional - Prof. Jorge Melchiades;https://www.youtube.com/watch?v=LlrsomZMKek;2425
  Outros;Aula INÉDITA! com o Prof. Jorge Melchiades. Não perca!;https://www.youtube.com/watch?v=sFXARO9Kins;2433
  Outros;Vocabulário Simplificado da  Psicologia Racional 2- Prof. Jorge Melchiades;https://www.youtube.com/watch?v=5jt4HgKNBcI;2461
  Outros;Liderança 1 e Consciência - Palestra de Psicologia do Prof. Jorge Melchiades Carvalho Filho;https://www.youtube.com/watch?v=2Ol-DcEhsRg;2471
  Outros;A Ambivalente Dependência -- Curso de Psicologia Racional - Prof. Jorge Melchiades;https://www.youtube.com/watch?v=pi4yHpS8Lp4;2475
  Outros;"Nós; Religiosidade; Política e Ciência -Curso de Psicologia Racional - Prof. Jorge Melchiades";https://www.youtube.com/watch?v=AOULMagV-jk;2483
  Outros;A Ambivalência -- Curso de Psicologia Racional - Prof. Jorge Melchiades;https://www.youtube.com/watch?v=t_pAsi0LaoU;2484
  Outros;Aula inédita do Prof. Jorge Melchiades. Não perca!;https://www.youtube.com/shorts/XlpzkDLUPSE;2500
  Outros;Religiosidade e Poder - Curso de Psicologia Racional - Prof. Jorge Melchiades;https://www.youtube.com/watch?v=x8L2a45lrwU;2538
  Outros;Funiculi Funicula - ENACOPI V - Coral NUPEP em Som Maior;https://www.youtube.com/watch?v=P4fmY9CQ_1E;2544
  Outros;O Complexo de Édipo e o Crente Revolucionário- Curso de Psicologia Racional - Prof. Jorge Melchiades;https://www.youtube.com/watch?v=uqH5x1haqqc;2549
  Outros;Onde Procurar Jesus? -- Curso de Psicologia Racional - Prof. Jorge Melchiades;https://www.youtube.com/watch?v=6mnC-ASYn1c;2550
  Outros;Vocabulário Simplificado da  Psicologia Racional 3- Prof. Jorge Melchiades;https://www.youtube.com/watch?v=PfWqNjaxeYs;2557
  Outros;Vocabulário  da  Psicologia Racional 4- Prof. Jorge Melchiades;https://www.youtube.com/watch?v=XsRWnoXfd_4;2566
  Outros;Vocabulário  da  Psicologia Racional 5 - Prof. Jorge Melchiades;https://www.youtube.com/watch?v=R71QNU49AK0;2597
  Outros;A RAZÃO É TERAPÊUTICA - Psicologia Racional e Transcendente 1- Prof. Jorge Melchiades;https://www.youtube.com/watch?v=4K6wYLcGm7c;2599
  Outros;"Aula inédita com o Prof. Jorge Melchiades - Jesus; Platão e o Mundo das Ideias.";https://www.youtube.com/shorts/lwCB84oYc04;2600
  Outros;"Aula e série inéditas! ""Vida após a vida: As provas aumentam"" Prof. Jorge Melchiades";https://www.youtube.com/shorts/QV40uO9_52A;2600
  Outros;Jesus e a Alma Penada    -   Psicologia Racional- Prof. Jorge Melchiades;https://www.youtube.com/watch?v=LkgSnjGgfyY;2628
  Outros;Conhecimento Vulgar - Prof. Jorge Melchiades Carvalho Filho;https://www.youtube.com/watch?v=7ItIEvD7Y6c;2642
  Outros;Quem disse que o seu destino é morrer? - Aula inédita do Prof. Jorge Melchiades;https://www.youtube.com/shorts/Xxu_rFgq_ZE;2700
  Outros;"Aula inédita! ""Jesus; Platão; Verdade de Justiça"" - Psicologia Racional - Prof. Jorge Melchiades";https://www.youtube.com/shorts/BO0n77t3n0w;2700
  Outros;Jesus ainda está proibido da livre expressão?    -   Psicologia Racional- Prof. Jorge Melchiades;https://www.youtube.com/watch?v=YG_SdaGfQXw;2755
  Outros;"Filosofia; Semiótica e Poder 3/5 - Prof. Jorge Melchiades Carvalho Filho";https://www.youtube.com/watch?v=MHq52DQpQbc;2758
  Outros;"O Mentiroso; Jesus e a Justiça   -   Psicologia Racional- Prof. Jorge Melchiades";https://www.youtube.com/watch?v=BwqMXbrtKko;2772
  Outros;"EM BREVE! Programa ""Mensagens do Amor Distante"" sob a direção do Prof. Jorge Melchiades";https://www.youtube.com/shorts/r9iLcwHAvl8;2800
  Outros;Aula inédita com o Prof. Jorge Melchiades! Vocabulário da Psicologia Racional 9;https://www.youtube.com/shorts/tHDGMAG0g3k;2800
  Outros;Conhecendo a si mesmo 2/5 - Palestra do Prof. Jorge Melchiades;https://www.youtube.com/watch?v=4AJ3rq3NC5s;2910
  Outros;"Filosofia; Psicologia e Mentira -3/4 - Palestra de Psicologia Racional - Prof Jorge Melchiades";https://www.youtube.com/watch?v=_VJPLK8wXXs;3073
  Outros;1 - Quem sou? - Prof. Jorge Melchiades Carvalho Filho;https://www.youtube.com/watch?v=mR3rWq09wmo;3167
  Outros;My Way - Coral Nupep em Som Maior - VI Canta Inverno Vinhedo;https://www.youtube.com/watch?v=fysdPuQULCo;3203
  Outros;Os 2 primeiros princípios da Psicologia Racional - Prof. Jorge Melchiades;https://www.youtube.com/watch?v=kw1aLetuRM8;3277
  Outros;"Aula inédita do Prof. Jorge Melchiades. ""A Ética e o Parasita Social"".";https://www.youtube.com/shorts/SyKN9o-HXPE;3300
  Outros;VOCABULÁRIO SIMPLIFICADO DA PSICOLOGIA RACIONAL 1 - Prof. Jorge Melchiades;https://www.youtube.com/watch?v=hkk37OQmoO4;3654
  Outros;"Filosofia; Psicologia e Mentira - 2/4 -  Palestra de Psicologia Racional - Prof. Jorge Melchiades";https://www.youtube.com/watch?v=lqi91f5erHE;3725
  Outros;Por una cabeza - Coral do NUPEP - 3º Canta Inverno - Vinhedo;https://www.youtube.com/watch?v=iH-bI184LfM;3787
  Outros;"O Prof. Jorge Melchiades está de volta! Aula inédita! Tema: ""Jesus; Platão; a Verdade e o Otário"".";https://www.youtube.com/watch?v=7T2z_Bx65zM;3798
  Outros;VIDA APÓS A VIDA: AS PROVAS AUMENTAM - A morte é uma farsa - Aula 1- Prof. Jorge Melchiades;https://www.youtube.com/watch?v=HsDsgTkmqg8;3944
  Outros;Dalizio Moura como Elvis Presley e Coral Nupep em Som Maior no Show Terapia;https://www.youtube.com/watch?v=E1-hOrQVwBM;4070
  Outros;"Filosofia; Semiótica e Poder 1/5 - Prof. Jorge Melchiades Carvalho Filho";https://www.youtube.com/watch?v=hSPmQNAyzWc;4090
  Outros;QUEM MORRE? - Aula 2 da Morte é uma farsa - Prof. Jorge Melchiades;https://www.youtube.com/watch?v=VTrtI5QLtYE;4385
  Outros;I'll Be There - Michael Jackson - Coral Nupep em Som Maior - IV Canta Inverno de Vinhedo;https://www.youtube.com/watch?v=1nl-Wp4aKfw;5063
  Outros;"Freud; Complexo de Édipo e regressão na autocracia - Prof. Jorge Melchiades Carvalho Filho";https://www.youtube.com/watch?v=TNiKIhbiXg8;5254
  Outros;"Hipnose; Freud e Catarse - Palestra do Prof. Jorge Melchiades Carvalho Filho";https://www.youtube.com/watch?v=5BKvRUFN4ss;5449
  Outros;"Filosofia; Psicologia e Verdade 1/6 - Prof. Jorge Melchiades";https://www.youtube.com/watch?v=b4n16T6EdBM;5545
  Outros;Ouvindo-te - Coral Nupep em Som Maior - IV Canta Inverno de Vinhedo;https://www.youtube.com/watch?v=_xnLC0F-yDc;5584
  Outros;Capoeira - documento raro de 1970;https://www.youtube.com/watch?v=mnWvWSPKmTQ;6331
  Outros;"Aristóteles; Freud e Catarse - Palestra do Prof. Jorge Melchiades Carvalho Filho";https://www.youtube.com/watch?v=f3ejajL6CE4;6444
  Outros;"Freud; Instinto e Fase Oral - Prof. Jorge Melchiades Carvalho Filho";https://www.youtube.com/watch?v=JVNMP7k4-QI;6697
  Outros;Jesus hipnotizou os discípulos?      -   Psicologia Racional- Prof. Jorge Melchiades;https://www.youtube.com/watch?v=pu0LJ4dvdL0;6952
  Outros;BOAS FESTAS! - Prof. Jorge Melchiades.;https://www.youtube.com/shorts/lzZ-GFIFKe8;7700
  Outros;Novas turmas! Inscreva-se no Curso de Psicologia Racional On-line.;https://www.youtube.com/shorts/I216sQkO3uM;8200
  Outros;Conhecendo a si mesmo 1/5 - Prof. Jorge Melchiades Carvalho Filho;https://www.youtube.com/watch?v=6SUnsbHkgdM;8627
  Outros;Curso on-line de Psicologia Racional - A Razão Terapêutica. Participe!;https://www.youtube.com/shorts/KXmTjt82WLg;9700
  Outros;A Razão Terapêutica - Curso de Psicologia Racional on-line. Inscrições abertas!;https://www.youtube.com/watch?v=SAuPDEim9Us;10271
  Outros;"Filosofia; Psicologia e Mentira -1/4 - Palestra de Psicologia Racional - Prof. Jorge Melchiades";https://www.youtube.com/watch?v=wvDQvt61AdA;11451
  Outros;Complexo de Édipo / Regressão / Fixação - Autogestão e Razão 5 - Prof. Jorge Melchiades;https://www.youtube.com/watch?v=zK6HtCmhaVk;14258
  Outros;Provas de que a morte é uma mentira - Curso de Psicologia Racional - Prof. Jorge Melchiades;https://www.youtube.com/watch?v=qbYx0u17A4I;21123
  Outros;"Histeria; Freud e Catarse - Palestra do Prof. Jorge Melchiades Carvalho Filho";https://www.youtube.com/watch?v=MYWNxEWJXFI;27132
  Outros;"Catarse; Freud; Breuer e Hipnose";https://www.youtube.com/watch?v=E6KvNzFp42s;27646
  Outros;"Freud e Id; Ego e Superego - Palestra do Prof. Jorge Melchíades Carvalho Filho";https://www.youtube.com/watch?v=Lx7y4emORko;128723`;
  
  // Processar os dados do CSV para obter objetos utilizáveis
  const { videos, categories } = processCSVData(csvData);
  const videosByCategory = groupVideosByCategory(videos);
  
  // Exportar variáveis para uso em outros scripts
  window.tvNupepData = {
    videos,
    categories,
    videosByCategory
  };