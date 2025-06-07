const programasInicial = [
    {
        "nome": "Aula do prof Jorge - Aula inédita 16/03/2024 - A Revolução do Filho da Luta 2 - Prof. Jorge Melchiades",
        "youtubeId": "DQWHvllQfow",
        "duracao": 89,
    }, {
        "nome": "Grupo Comenta - Nossa Posição na Existência - Grupo Comenta Reflexões do Professor Jorge Melchiades",
        "youtubeId": "WOwGehTnsIY",
        "duracao": 3016,
    }, {
        "nome": "Aula do prof Jorge - A REVOLUÇÃO DO FILHO DA LUTA 2 - Psicologia Racional - Prof. Jorge Melchiades",
        "youtubeId": "M6QvjLNDLD0",
        "duracao": 1595,
    }, {
        "nome": "Grupo Comenta - Da Mitologia à Esquerda - Grupo Comenta o programa da Série Nossa Posição do Prof. Jorge Melchiades",
        "youtubeId": "XaOjIKbuaIg",
        "duracao": 2299,
    }, {
        "nome": "Aula do prof Jorge - O Desejo do Filho da Luta - Série: Os Filhos da Luta com o Prof. Jorge Melchiades",
        "youtubeId": "gVu_bnU1ZOM",
        "duracao": 1776,
    }, {
        "nome": "Aula do prof Jorge - A REVOLUÇÃO DO FILHO DA LUTA - Psicologia Racional - Prof. Jorge Melchiades",
        "youtubeId": "cAL6tDgATDs",
        "duracao": 2013,
    }, {
        "nome": "Grupo Comenta - O Revolucionário Conservador - Grupo Comenta o programa do Prof. Jorge Melchiades",
        "youtubeId": "mXpsrUXPwTM",
        "duracao": 2345,
    }, {
        "nome": "Aula do prof Jorge - A Revolução do Filho da LUTA - Aula inédita! #dialética #metafisica #etica #jorgemelchiades",
        "youtubeId": "Wi1qv-KB6PI",
        "duracao": 17,
    }, {
        "nome": "Grupo Comenta - Freud e a Nossa Posição - Grupo Comenta a aula do Professor Jorge Melchiades",
        "youtubeId": "YEWMVHTS6K0",
        "duracao": 2285,
    }, {
        "nome": "Aula do prof Jorge - Quem sou? - Aula de Psicologia Racional - Prof. Jorge Melchiades",
        "youtubeId": "J8ZdLy-GIa4",
        "duracao": 1982,
    }
]

let seconds = 0;
for (const programa of programasInicial) {
    let date = new Date(null);
    date.setSeconds(seconds);
    programa["inicio"] = date.toISOString().slice(11,19);

    date = new Date(null);
    seconds = seconds + programa["duracao"];
    date.setSeconds(seconds);
    programa["fim"] = date.toISOString().slice(11,19);

    seconds = date.getTime()/1000 + 1;
}

// popula a lista de programas até meia-noite
const programas = [...programasInicial];

let index = 0;
let [hh, mm, ss] = programasInicial[programasInicial.length - 1]["fim"].split(':');
let date = new Date(null);
date.setHours(+hh);
date.setMinutes(mm);
date.setSeconds(ss);
seconds = date.getTime()/1000;
while (seconds < 86400) {
    // TODO: remover o último programa ultrapassando meia-noite
    // e preencher com programas menores

    // proximo programa a inserir no final da lista
    let programa = JSON.parse(JSON.stringify(programasInicial[index % programasInicial.length]));

    let date = new Date(null);
    date.setSeconds(seconds + 1);
    programa["inicio"] = date.toISOString().slice(11,19);

    date = new Date(null);
    seconds = seconds + programa["duracao"];
    date.setSeconds(seconds);
    programa["fim"] = date.toISOString().slice(11,19);

    seconds = date.getTime()/1000 + 1;
    programas.push(programa);

    index = index + 1;
}
