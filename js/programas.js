const programasInicial = [
    {
        "nome": "16 - Ainda o Mágico de Boz",
        "youtubeId": "VKoUTwBXyd8",
        "duracao": 1799,
    },
    {
        "nome": "20 - A Identidade da Ilusão",
        "youtubeId": "dhypr37xhc0",
        "duracao": 3432,
    },
    {
        "nome": "17 - O Cinismo do Mágico de Bozz- Prof. Jorge Melchiades",
        "youtubeId": "YD00p_vtC_8",
        "duracao": 3447,
    },
    {
        "nome": "23 - As aparências enganam",
        "youtubeId": "7DEx70957vo",
        "duracao": 3456,
    },
    {
        "nome": "4 – Correndo por fora do sagrado – Reflexão sobre a Vida",
        "youtubeId": "jAKldqLjcpY",
        "duracao": 3462,
    },
    {
        "nome": "6 - No Fim da Picada",
        "youtubeId": "KJppsWoRX24",
        "duracao": 3475,
    },
    {
        "nome": "22 - Atenção na comunicação",
        "youtubeId": "gY9-vgrgxsc",
        "duracao": 3478,
    },
    {
        "nome": "21 - Experimente a Plenitude da Existência",
        "youtubeId": "6i5E1zLqPEU",
        "duracao": 3490,
    },
    {
        "nome": "5 - A morte da bezerra - Reflexão sobre a vida",
        "youtubeId": "zJevF3rzzls",
        "duracao": 3525,
    },
    {
        "nome": "15- O Mágico de Boz",
        "youtubeId": "FSL5XgwfpO4",
        "duracao": 3532,
    },
    {
        "nome": "10 – A Forma do Atrevimento Ideológico – Reflexão sobre a vida",
        "youtubeId": "ME4Q4R204MM",
        "duracao": 3546,
    },
    {
        "nome": "8 – Vida é raciocínio - Reflexão sobre a vida",
        "youtubeId": "W6f1166CbWQ",
        "duracao": 3559,
    },
    {
        "nome": "9 - Os ovos estão podres – Reflexão sobre a vida",
        "youtubeId": "3SIawanHOJc",
        "duracao": 3573,
    },
    {
        "nome": "11 – Movimento Gerador da Vida - Reflexão sobre a vida",
        "youtubeId": "h4rjFS_o_qI",
        "duracao": 3590,
    },
    {
        "nome": "14 - Sobre  nada e ilusão",
        "youtubeId": "IoQlciMh09Y",
        "duracao": 3594,
    },
    {
        "nome": "12 - Sobre atividades características do EU",
        "youtubeId": "9_4AIqEnRfU",
        "duracao": 3597,
    },
    {
        "nome": "7 - Vivendo a Vida Alienado de Si – Reflexão sobre a vida",
        "youtubeId": "zxWYIo098lo",
        "duracao": 3601,
    },
    {
        "nome": "13 - O Filósofo do Princípio",
        "youtubeId": "sIPrv_W76vk",
        "duracao": 3602,
    },
];

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
