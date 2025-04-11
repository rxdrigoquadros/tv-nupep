# TV NUPEP

TV NUPEP é uma plataforma de streaming dedicada ao conteúdo educacional do Núcleo de Pesquisa Psíquicas (NUPEP), oferecendo acesso a aulas, palestras e cursos do Prof. Jorge Melchiades com foco na Psicologia Racional.

## 📋 Visão Geral

O projeto consiste em uma plataforma web que simula uma experiência de TV ao vivo, combinando a programação linear tradicional com recursos de vídeo sob demanda. Oferece uma programação regular baseada no horário atual do dia, além de permitir aos usuários navegar e assistir a vídeos específicos de sua escolha.

## 🌟 Funcionalidades

- **Transmissão ao vivo**: Stream contínuo de conteúdo seguindo uma grade de programação predefinida
- **Guia de programação**: Visualização da programação completa por dia da semana
- **Biblioteca de vídeos**: Acesso a todo o catálogo de vídeos organizados por categorias
- **Interface responsiva**: Experiência otimizada para dispositivos desktop e móveis
- **Controles de reprodução**: Opções para mutar, pausar e alternar entre transmissão ao vivo e vídeos selecionados

## 🚀 Tecnologias Utilizadas

- HTML5
- CSS3 (com variáveis e flexbox/grid para layout)
- JavaScript (ES6+)
- YouTube Embedded Player API
- Estrutura de dados CSV para gerenciamento de conteúdo

## 📂 Estrutura do Projeto

```
tv-nupep/
├── index.html # Página principal com a TV ao vivo
├── sobre.html # Página institucional sobre o NUPEP
├── css/
│ └── styles.css # Estilos compartilhados
├── js/
│ ├── video-data.js # Dados e processamento dos vídeos
│ ├── main.js # Lógica principal da TV ao vivo
│ └── main-site.js # JavaScript para páginas institucionais
└── img/ # Pasta para imagens
```

## 🛠️ Instalação e Uso

1. Clone o repositório:
```bash
git clone git@github.com:rxdrigoquadros/tv-nupep.git
```

2. Navegue até a pasta do projeto:
```bash
cd tv-nupep
```

3. Abra o arquivo `index.html` em seu navegador.

## 🎯 Recursos Principais

### Página Principal (TV ao Vivo)

A página principal oferece uma experiência similar a um canal de TV, exibindo:

- **Player de vídeo em destaque**: Reproduz o conteúdo atual da programação
- **Título e descrição do programa atual**
- **Indicador de transmissão ao vivo ou intervalo**
- **Barra de progresso do programa atual**
- **Carrosséis de conteúdo relacionado**: "Aulas Recentes", "Continuar Assistindo" e "Recomendados para Você"

### Guia de Programação

- Painel lateral com a programação completa
- Navegação por dias da semana
- Destaque para o programa atual
- Possibilidade de clicar em qualquer programa para assistir

### Páginas Institucionais

- **Sobre**: Informações sobre o NUPEP e sua missão
- Design consistente e responsivo
- Menu de navegação compartilhado

## 🧩 Componentes Principais

### Player Inteligente

O player de vídeo oferece recursos avançados:

- Sincronização com o horário atual
- Entrada no ponto correto do programa em andamento
- Transição automática entre programas
- Alternância entre modo ao vivo e vídeo sob demanda

## 📱 Responsividade

A plataforma é totalmente responsiva, adaptando-se a diferentes tamanhos de tela:

- **Desktop**: Layout completo com todas as funcionalidades
- **Tablet**: Ajustes no tamanho dos elementos e grid de conteúdo
- **Mobile**: Menu hamburguer, layout simplificado e otimizado para toque

## 🔄 Atualização de Conteúdo

Para adicionar novos vídeos à plataforma:

1. Atualize o arquivo `js/video-data.js` com as novas entradas no formato CSV:
```
"Título do Vídeo";"URL do YouTube";duração_em_segundos
```

2. A plataforma automaticamente integrará os novos vídeos à programação e às listas de recomendação.

## 📝 Notas para Desenvolvedores

- O CSS utiliza variáveis para facilitar a personalização do tema
- O sistema de programação é baseado no horário local do usuário
- O player do YouTube é inicializado via API JavaScript para maior controle
- A estrutura modular permite a fácil adição de novas páginas e funcionalidades