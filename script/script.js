const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const tecla_pressionada = {"KeyA": false, "KeyD": false}
let game_over = false;
let jogo_iniciado = false;
let jogo_reiniciado = 1;
let array_obstaculos = []

document.addEventListener('keypress', (e)=>{
    if(e.code === 'KeyW'){
        jogo_iniciado = true;
    }
})
//eventListener para iniciar o jogo, é o que faz a bolinha se mexer
//para começar o jogo com a tecla W

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
    //Desenhar no canvas
    atualizar(){
        throw new Error('Implementar nas classes filhas');
    }
    setPosicao(posicaoX,posicaoY){
        this.x = posicaoX;
        this.y = posicaoY;
    }
    //Será utilizado para resetar a plataforma e bola para suas posições
    //iniciais quando o jogo for reiniciado após destruir todos os
    //blocos
    aumentarVelocidade(){
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
    //Se for pressionado para andar para a direita ele aumentara sua posicao X no canvas positivamente, e se for pra esquerda negativamente.
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
        //Caso a tecla esteja pressionada anda pro lado da tecla, caso nao esteja para.
        if(game_over === true){
            this.#velocidade = 0;
        }
        //Se já perdeu não deixa o jogador se mexer mais.
        this.x += this.#velocidade;
    }
    getVelocidade(){
        return this.#velocidade
    }
    aumentarVelocidade(){
        this.#andarDireita++
        this.#andarEsquerda--;
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
        if(jogo_iniciado){
            this.x -= this.#velocidadeX;
            this.y -= this.#velocidadeY
            this.colisaoHorizontal();
            this.colisaoVertical();
            this.colisaoPlataforma();
            this.colisaoObstaculo();
        }else{
            this.x += plataforma.getVelocidade();
        }
    }
    colisaoHorizontal(){
        if(this.x <= 0 || this.x + this.largura >= canvas.width){
            this.#velocidadeX *= -1;
        }
        //Caso a bolinha tenha colidido com as paredes horizontais do canvas
        //so redireciona ela para o outro lado
    }
    colisaoVertical(){
        if(this.y <= 0){
            this.#velocidadeY *= -1
        }
        //Caso a bolinha tenha colidido com o teto do canvas, redireciona ela
        //para baixo
        if(this.y + this.altura >= canvas.height){
            this.#velocidadeX = 0;
            this.#velocidadeY = 0;
            game_over = true;
        }
        //Se a bolinha bateu no chao do canvas, para a bolinha e atualiza a variavel game_over para
        //aplicar as mudanças de quando o jogo foi perdido
    }
    colisaoPlataforma(){
        if(
            this.y + this.altura >= plataforma.y &&
            this.x + this.largura >= plataforma.x &&
            this.x <= plataforma.x + plataforma.largura &&
            this.y + this.altura <= plataforma.y + plataforma.largura
        ){
            this.#velocidadeY *= -1
        }
    }
    colisaoObstaculo(){
        array_obstaculos.forEach((obstaculo) => {
            if(
                this.y + this.altura >= obstaculo.y &&
                this.y <= obstaculo.y + obstaculo.altura &&
                (
                    (this.x + this.largura > obstaculo.x && this.x < obstaculo.x) ||
                    (this.x < obstaculo.x + obstaculo.largura && this.x > this.largura > obstaculo.x + obstaculo.largura)
                )
                //Aqui está tentando descobrir se a bolinha colidiu com cada obstaculo,
                //está bem confuso mas é o que está "funcionando", não encontrei nenhuma outra
                //forma que funcione melhor, eu não aguento mais. E nem funcionando direito está, meu deus.
            ){
                this.#velocidadeX *= -1
                obstaculo.colidiu(obstaculo);
            }else if(
                this.x + this.largura >= obstaculo.x &&
                this.x <= obstaculo.x + obstaculo.largura &&
                (
                    (this.y + this.altura > obstaculo.y && this.y < obstaculo.y) ||
                    (this.y < obstaculo.y + obstaculo.altura && this.y + this.altura > obstaculo.y + obstaculo.altura)
                )
            ){
                this.#velocidadeY *= -1
                obstaculo.colidiu(obstaculo);
            }
        })
    }
    aumentarVelocidade(){
        if(this.#velocidadeX > 0){
            this.#velocidadeX++;
        }else{
            this.#velocidadeX--;
        }
        if(this.#velocidadeY > 0){
            this.#velocidadeY++;
        }else{
            this.#velocidadeY--;
        }
        //Aumenta a velocidade da bolinha ao destruir todos os blocos
        //como a bolinha pode terminar com numero negativo ou positivo
        //foi necessario criar estas condições, pois se ela começasse 
        //com um numero negativo e recebe ++ iria diminuir a velocidade
    }
}

class Obstaculos extends Objetos{
    #valorPonto
    constructor(x, y, largura, altura, valorPonto = 0){
        super(x, y, largura, altura);
        this.#valorPonto = valorPonto;
    }
    colidiu(obstaculoColidido){
        pontuacao.setPontuacao(this.#valorPonto);
        //Quando objeto for destruido, acrescenta na pontuacao maxima
        //o ponto que o objeto vale
        array_obstaculos = array_obstaculos.filter(
            (obstaculo) => {
                return obstaculo !== obstaculoColidido;
                //Caso o objeto tenha sido colidido, ele é removido do array
            }
        )
    }
}
class Pontuacao {
    #pontuacaoTotal
    constructor(){
        this.#pontuacaoTotal = 0;
    }
    setPontuacao(valorPonto){
        this.#pontuacaoTotal += valorPonto;
    }
    getPontuacaoTotal(){
        return this.#pontuacaoTotal;
    }
    resetaPontuacao(){
        this.#pontuacaoTotal = 0;
    }
    desenhaPontuacao(ctx, color, font){
        ctx.fillStyle = color
        ctx.font = font
        ctx.fillText(`Pontos: ${pontuacao.getPontuacaoTotal()}`,30, 50)
    }
}

function desenhaGameOver(){
    ctx.fillStyle='white'
    ctx.font="40px Arial"
    ctx.fillText(`Pontuação máxima`,canvas.width - 450, canvas.height/3)
    ctx.fillStyle='white'
    ctx.font="40px Arial"
    ctx.fillText(`${pontuacao.getPontuacaoTotal()}`,canvas.width- 300, canvas.height/2.3)
    desenhaBotaoGameOver()
}
function desenhaBotaoGameOver(){
    document.addEventListener('click',(e)=>{
        location.reload();
    })
    ctx.fillStyle = 'grey'
    ctx.fillRect(canvas.width-480, canvas.height - 320, 420, 100)
    ctx.fillStyle='white'
    ctx.font="40px Arial"
    ctx.fillText(`Recomeçar`,canvas.width - 380, canvas.height - 255)
}

const pontuacao = new Pontuacao();
const plataforma = new Plataforma(canvas.width - 330, canvas.height - 50, 100, 15)
const bolinha = new Bola(canvas. width - 290, canvas.height - 71, 20, 20)

function obstaculoBuilder(){
    for(let linha = 1; linha <= 6; linha++){
        for(let coluna = 1; coluna <= 6; coluna++){
            //Se quiser testar as mêcanicas de aumento de pontos/velocidade e so diminuir o maximo de linhas e colunas para ficar mais facil
            let distanciaY = 40;
            let distanciaX = 90;
            array_obstaculos.push(new Obstaculos(canvas.width - 630 + (distanciaX * linha), canvas.height - 650 + (distanciaY * coluna), 80, 30, (700 - (100 * coluna)) * (jogo_reiniciado * 0.2)))
            //Obstaculos(x, y, largura, altura, valorPonto)
            //valorPonto é para dar uma pontuação maior caso o jogador quebre um obstaculo da primeira linha de blocos
        }
    }
}
//Essa função é a qual está criando obstaculos dentro da array.

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
    //Cada case é uma linha de Y, isso é o que faz ter linhas de cores
    //diferentes. 
}

function loop() {
    if(game_over){
        ctx.clearRect(0,0,canvas.width, canvas.height)
        desenhaGameOver()
        return
        //Se o jogador perdeu, reseta a tela do canvas e desenha
        //a tela de game over
    }
    if(array_obstaculos.length === 0){
        //se o array de obstaculo estiver vazio
        bolinha.setPosicao(canvas. width - 290, canvas.height - 71);
        plataforma.setPosicao(canvas.width - 330, canvas.height - 50);
        //Reseta a bolinha e a plataforma para suas posições originais
        jogo_iniciado = false;
        //Faz com que quando for resetado a bolinha fique grudada novamente na
        //plataforma ate o jogador pressionar "W" novamente
        jogo_reiniciado++;
        //Essa variavel aumenta o valor da velocidade e pontuacao
        bolinha.aumentarVelocidade();
        plataforma.aumentarVelocidade();
        obstaculoBuilder();
        //Cria a array obstaculos novamente
    }
    ctx.clearRect(0,0,canvas.width, canvas.height)
    pontuacao.desenhaPontuacao(ctx,'white',"30px Arial")
    desenhaObstaculos();
    bolinha.desenha(ctx, 'white');
    bolinha.atualizar();
    plataforma.desenha(ctx,'red')
    plataforma.atualizar();
    requestAnimationFrame(loop)
}
obstaculoBuilder();
loop();