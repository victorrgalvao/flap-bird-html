console.log('[DevVi] Flappy bird')

let frames = 0;

const som_HIT = new Audio();
som_HIT.src = './efeitos/hit.wav';

const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');



// obj Get ready

const getReady = {
    spriteX: 133,
    screenY: 0,
    largura: 174,
    altura: 152,
    x: (canvas.width / 2) - 174 / 2,
    y: 58,
    desenhar() {
        contexto.drawImage(
            sprites,
            getReady.spriteX, getReady.screenY,
            getReady.largura, getReady.altura,
            getReady.x, getReady.y,
            getReady.largura, getReady.altura
        );
    },
};



//[obj background]

const fundo = {
    spriteX: 390,
    spriteY: 0,
    largura: 275,
    altura: 204,
    x: 0,
    y: canvas.height - 204,
    desenhar() {
        contexto.fillStyle = '#70c5ce';
        contexto.fillRect(0, 0, canvas.width, canvas.height)

        contexto.drawImage(
            sprites,
            fundo.spriteX, fundo.spriteY,
            fundo.largura, fundo.altura,
            fundo.x + fundo.largura, fundo.y,
            fundo.largura, fundo.altura,

        );
        contexto.drawImage(
            sprites,
            fundo.spriteX, fundo.spriteY,
            fundo.largura, fundo.altura,
            fundo.x, fundo.y,
            fundo.largura, fundo.altura,

        );

    },



};




const fazColisao = (flappBird, chao) => {
    const flappBirdY = flappBird.y + flappBird.altura;
    const chaoY = chao.y;
    if (flappBirdY >= chaoY) {
        return true;
    } else {
        return false;
    }
}


const criarChao = () => {
    //[obj chao]
    const chao = {
        spriteX: 0,
        spriteY: 610,
        largura: 224,
        altura: 112,
        x: 0,
        y: canvas.height - 112,
        atualizar() {
            const repeteEm = chao.largura / 2;

            if (chao.x <= -repeteEm) {
                chao.x = 0
            }

            chao.x = chao.x - 1;

        },
        desenhar() {
            contexto.drawImage(

                sprites,
                chao.spriteX, chao.spriteY, // sprite x , sprite Y
                chao.largura, chao.altura, // tamanho do recorte do sprite
                chao.x, chao.y, //
                chao.largura, chao.altura,




            );
            contexto.drawImage(

                sprites,
                chao.spriteX, chao.spriteY, // sprite x , sprite Y
                chao.largura, chao.altura, // tamanho do recorte do sprite
                chao.x + chao.largura, chao.y, //
                chao.largura, chao.altura,




            );
        },



    };
    return chao;
}


const criaFlappBird = () => {
    //obj flappy
    const flappBird = {
        spriteY: 0,
        spriteX: 0,
        largura: 33,
        altura: 24,
        x: 10,
        y: 50,
        pulo: 4.6,
        pular() {
            console.log(flappBird.velocidade)
            flappBird.velocidade = - flappBird.pulo;
        },
        gravidade: 0.25,
        velocidade: 0,
        atualizar() {
            if (fazColisao(flappBird, globais.chao)) {
                console.log('fez colisao')
                som_HIT.play();

                setTimeout(() => {
                    mudaParaTela(telas.INICIO);
                }, 500);

                return;
            }

            flappBird.velocidade = flappBird.velocidade + flappBird.gravidade;
            flappBird.y = flappBird.y + flappBird.velocidade;
        },


        movimentos: [
            { spriteX: 0, spriteY: 0, }, // asa pra cima
            { spriteX: 0, spriteY: 26, }, // asa no meio 
            { spriteX: 0, spriteY: 52, }, // asa pra baixo
            { spriteX: 0, spriteY: 26, }, // asa no meio 
        ],
        frameAtual: 0,
        atualizaOframeAtual() {
const intervaloFrames = 10;
const passouOintervalo  = frames % intervaloFrames ===9;
console.log(passouOintervalo);

            if(passouOintervalo){

                const baseIncremento = 1;
                const Incremento = baseIncremento + flappBird.frameAtual;
                const baseRepeticao = flappBird.movimentos.length;
                flappBird.frameAtual = Incremento % baseRepeticao;

            }

         
        },



        // Função que desenha o flap
        desenhar() {
            flappBird.atualizaOframeAtual();
            const { spriteX, spriteY } = flappBird.movimentos[flappBird.frameAtual]
            contexto.drawImage(
                sprites,
                spriteX, spriteY, // sprite x , sprite Y
                flappBird.largura, flappBird.altura, // tamanho do recorte do sprite
                flappBird.x, flappBird.y, //
                flappBird.largura, flappBird.altura,

            );
        }
    }
    return flappBird;
}


//
// [Telas]
//
const globais = {};
let telaAtiva = {};
const mudaParaTela = (novaTela) => {
    telaAtiva = novaTela;
    if (telaAtiva.inicializa) {
        telaAtiva.inicializa();
    }
};

const telas = {
    INICIO: {
        inicializa() {
            globais.chao = criarChao();
            globais.flappBird = criaFlappBird();
        },

        desenhar() {
            fundo.desenhar();
            globais.flappBird.desenhar();
            globais.chao.desenhar();
            getReady.desenhar()
        },
        click() {
            mudaParaTela(telas.JOGO);
        },
        atualizar() {
            globais.chao.atualizar();
        },
    }
};

telas.JOGO = {
    desenhar() {
        fundo.desenhar();
        globais.chao.desenhar();
        globais.flappBird.desenhar();
    },
    click() {
        globais.flappBird.pular();
    },
    atualizar() {
        globais.chao.atualizar();
        globais.flappBird.atualizar();


    },

};


const loop = () => { // loop da animação

    telaAtiva.desenhar();
    telaAtiva.atualizar();

    frames = frames + 1;
    requestAnimationFrame(loop)
}

window.addEventListener('click', function () {
    if (telaAtiva.click) {
        telaAtiva.click();
    }
});

mudaParaTela(telas.INICIO);
loop();


