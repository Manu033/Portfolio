var numerosDeBotones= document.querySelectorAll(".drum").length;

var letrasAceptadas = [];


for(var i=0; i<numerosDeBotones; i++){
    document.querySelectorAll(".drum")[i].addEventListener("click", handleClick);
    letrasAceptadas.push(document.querySelectorAll(".drum")[i].innerHTML);
}

function handleClick(){
    
    const botonIndicador = this.innerHTML;

    makeSound(botonIndicador);


    buttonAnimation(botonIndicador);
}

document.addEventListener("keypress", function(event){

    if(letrasAceptadas.includes(event.key)){
    makeSound(event.key);
    buttonAnimation(event.key);
    }else{
        console.log("La tecla " + event.key + " no es válida");
    }
});


function makeSound(key){

    switch(key){
        case "w": 
            var audio1=new Audio("./sounds/tom-1.mp3");
            audio1.play();
            break;
        
        case "a": 
            var audio2=new Audio("./sounds/tom-2.mp3");
            audio2.play();
            break;

        case "s": 
            var audio3=new Audio("./sounds/tom-3.mp3");
            audio3.play();
            break;

        case "d": 
            var audio4=new Audio("./sounds/tom-4.mp3");
            audio4.play();
            break;  
            
        case "j": 
            var audio5=new Audio("./sounds/snare.mp3");
            audio5.play();
            break;

        case "k": 
            var audio6=new Audio("./sounds/crash.mp3");
            audio6.play();
            break;

        case "l": 
            var audio7=new Audio("./sounds/kick-bass.mp3");
            audio7.play();
            break;
        
        default:
            console.log(key);
    }
}

function buttonAnimation(teclaApretada){

    var botonActivado = document.querySelector("." + teclaApretada);

    botonActivado.classList.add("pressed");

    setTimeout(function(){
        botonActivado.classList.remove("pressed");
    }, 100);
}