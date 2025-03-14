const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const tecla_pressionada = {"KeyA": false, "KeyD": false}
let game_over = false;
const array_obstaculos = []

document.addEventListener('keydown', (e) =>{
    switch(e.code) {
        case 'KeyA':
            tecla_pressionada.KeyA = true;
            break
        case 'KeyD':
            tecla_pressionada.KeyD = true;
            break
    }
})
document.addEventListener('keyup', (e) =>{
    switch(e.code) {
        case 'KeyA':
            tecla_pressionada.KeyA = false;
            break
        case 'KeyD':
            tecla_pressionada.KeyD = false;
            break
    }
})
//eventListeners para que quando o usuário pressione o botão a plataforma ande
//e quando pare de pressionar ela pare.

class Objetos {
    constructor(x, y, largura, altura){
        this.x = x;
        this.y = y;
        this.largura = largura;
        this.altura = altura;
    }
    desenha(ctx, cor){
        ctx.fillStyle = cor
        ctx.fillRect(this.x, this.y, this.largura, this.altura)
    }
    atualizar(){
        throw new Error('Implementar nas classes filhas');
    }
}

class Plataforma extends Objetos{
    #velocidade
    #andarEsquerda
    #andarDireita
    constructor(x, y, largura, altura){
        super(x, y, largura, altura);
        this.#velocidade = 0;
        this.#andarDireita = 5;
        this.#andarEsquerda = -5
    }
    andar(valorDirecao){
        this.#velocidade = valorDirecao;
    }
    atualizar(){
        if(tecla_pressionada.KeyA === true ){
            if(this.x > 0){
                this.andar(this.#andarEsquerda);
            }else{
                this.#velocidade = 0
            }
        }else if(tecla_pressionada.KeyD == true){
            if(this.x + 100 < canvas.width){
                this.andar(this.#andarDireita);
            }else{
                this.#velocidade = 0;
            }
            
        }else{
            this.#velocidade = 0;
        }
        if(game_over === true){
            this.#velocidade = 0;
        }
        this.x += this.#velocidade;
    }
}

class Bola extends Objetos{
    #velocidadeY
    #velocidadeX
    constructor(x, y, largura, altura){
        super(x, y, largura, altura);
        this.#velocidadeY = 3;
        this.#velocidadeX = 3;
    }
    atualizar(){
        this.x -= this.#velocidadeX;
        this.y -= this.#velocidadeY
        this.colisaoHorizontal();
        this.colisaoVertical();
        this.colisaoPlataforma();
        //this.colisaoObstaculos();
    }
    colisaoHorizontal(){
        if(this.x <= 0 || this.x + this.largura >= canvas.width){
            this.#velocidadeX *= -1;
        }
    }
    colisaoVertical(){
        if(this.y <= 0){
            this.#velocidadeY *= -1
        }
        if(this.y + this.altura >= canvas.height){
            this.#velocidadeX = 0;
            this.#velocidadeY = 0;
            game_over = true;
        }
    }
    colisaoPlataforma(){
        if(
            this.y + this.altura >= plataforma.y &&
            this.x + this.largura >= plataforma.x &&
            this.x <= plataforma.x + plataforma.largura
        ){
            this.#velocidadeY *= -1
        }
    }
    //colisaoObstaculos(){
        //if(
            //this.y + this.altura >= array_obstaculos.linha1.y &&
            //this.x + this.largura >= array_obstaculos.linha1.x &&
            //this.x <= array_obstaculos.linha1.x + array_obstaculos.linha1.largura &&
            //this.y <= array_obstaculos.linha1.y + array_obstaculos.linha1.altura
        //){
            //this.#velocidadeY *= -1
        //}
    //}
    //Implementação básica, será mexido completamente quando eu começar a mexer com os obstaculos,
    //apenas feito para ter uma base da colisão e a função já estar iniciada.

    //Existe um bug estranho que as vezes quando a bola bate no eixo X do obstaculo ela fica presa
    //numa colisão sem parar até sair de cima do obstaculo, resolver.

    //Aparemente o bug do eixo X está presente na colisão da plataforma também, averiguar o que está errado
    //na condição if.
}

class Obstaculos extends Objetos{
    constructor(x, y, largura, altura){
        super(x, y, largura, altura);
    }
}

desenhaPontuacao = function(){
    ctx.fillStyle='white'
    ctx.font="30px Arial"
    ctx.fillText(`Pontos: 0`,30, 50)
}

const plataforma = new Plataforma(canvas.width - 330, canvas.height - 50, 100, 15)
const bolinha = new Bola(canvas. width - 290, canvas.height - 71, 20, 20)

function obstaculoBuilder(){
    for(let linha = 1; linha <= 6; linha++){
        for(let coluna = 1; coluna <= 6; coluna++){
            console.log(array_obstaculos)
            let distanciaY = 40;
            let distanciaX = 90;
            array_obstaculos.push(new Obstaculos(canvas.width - 630 + (distanciaX * linha), canvas.height - 650 + (distanciaY * coluna), 80, 30))
        }
    }
}

function desenhaObstaculos(){
    array_obstaculos.forEach((obstaculo) => {
        switch(obstaculo.y){
            case 90:
                obstaculo.desenha(ctx, 'red');
                break
            case 130:
                obstaculo.desenha(ctx, 'orange');
                break
            case 170:
                obstaculo.desenha(ctx, 'yellow');
                break
            case 210:
                obstaculo.desenha(ctx, 'green');
                break
            case 250:
                obstaculo.desenha(ctx, 'blue');
                break
            case 290:
                obstaculo.desenha(ctx, 'purple');
                break
            default:
                obstaculo.desenha(ctx, 'white');
    }}) 
}

function loop() {
    ctx.clearRect(0,0,canvas.width, canvas.height)
    desenhaObstaculos();
    bolinha.desenha(ctx, 'white');
    bolinha.atualizar();
    plataforma.desenha(ctx,'red')
    plataforma.atualizar();
    desenhaPontuacao();
    requestAnimationFrame(loop)
}
obstaculoBuilder();
loop();