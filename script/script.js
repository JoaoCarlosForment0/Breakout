const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const tecla_pressionada = {"KeyA": false, "KeyD": false}

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
}

class Plataforma extends Objetos{
    #velocidade
    constructor(x, y, largura, altura){
        super(x, y, largura, altura);
        this.#velocidade = 0;
    }
    andar(valorDirecao){
        this.#velocidade = valorDirecao;
    }
    atualizar(){
        if(tecla_pressionada.KeyA === true ){
            if(this.x > 0){
                plataforma.andar(-10);
            }else{
                this.#velocidade = 0
            }
        }else if(tecla_pressionada.KeyD == true){
            if(this.x + 100 < canvas.width){
                plataforma.andar(10);
            }else{
                this.#velocidade = 0;
            }
            
        }else{
            this.#velocidade = 0;
        }
        this.x += this.#velocidade;
        
    }
    getVelocidade(){
        return this.#velocidade;
    }
}
class Bola extends Objetos{
    constructor(x, y, largura, altura){
        super(x, y, largura, altura);
    }
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
const array_obstaculos = {linha1 : new Obstaculos(canvas.width/2 - 50, canvas.height - 600, 90, 40)}
const plataforma = new Plataforma(canvas.width - 330, canvas.height - 50, 100, 15)
const bolinha = new Bola(canvas. width - 290, canvas.height - 71, 20, 20)

function loop() {
    ctx.clearRect(0,0,canvas.width, canvas.height)
    array_obstaculos.linha1.desenha(ctx, 'yellow');
    bolinha.desenha(ctx, 'white');
    plataforma.desenha(ctx,'red')
    plataforma.atualizar();
    desenhaPontuacao();
    requestAnimationFrame(loop)
}
loop();