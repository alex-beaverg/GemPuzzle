'use strict';
const body = document.querySelector('body');
document.body.innerHTML = '<audio class="audio" style="display:none" src="assets/click.mp3"></audio><audio class="audio2" style="display:none" src="assets/victory.mp3"></audio>';
const brick = document.createElement('div');
brick.className = 'params';
body.append(brick);
const timer = document.createElement('div');
timer.className = 'timer';
timer.id = 'timer';
brick.append(timer);
const counter = document.createElement('div');
counter.className = 'counter';
brick.append(counter);
let click_counter = 0;
let mute = false;
let saveGame;

let sec, min;
let interval;
let firstclick = true;
document.getElementById('timer').innerHTML = 'Время: 00:00';

counter.innerHTML = 'Ходы: ' + click_counter; 
const field = document.createElement('div');
field.className = 'gamefield';
body.append(field);

const createIconHTML = (icon_name) => {
    return `<i class="material-icons">${icon_name}</i>`;
};

const brick_down = document.createElement('div');
brick_down.className = 'bttns';
body.append(brick_down);
const button = document.createElement('button');
button.setAttribute('type', 'button');
button.classList.add('newgame');
button.innerHTML = 'Новая игра';
brick_down.append(button);
const sound_btn = document.createElement('button');
sound_btn.setAttribute('type', 'button');
sound_btn.classList.add('sound');
sound_btn.innerHTML = createIconHTML("volume_up");
brick_down.append(sound_btn);

function game() {
    let bones = random();
    let empty;
    for (let i = 0; i < 16; i++) {    
        const cell = document.createElement('div');        
        if (i !== 15) cell.className = 'cell';
        else cell.className = 'empty';
            
        field.append(cell);    
        if (i !== 15) cell.innerHTML = bones[i];
        if (i !== 11 && i !== 14) cell.style.pointerEvents = 'none'; 
        else cell.style.pointerEvents = 'auto';        
        cell.id = 'c' + i;
        
        cell.addEventListener('click', () => {            
            if (cell.className !== 'empty') {       
                document.querySelector('.audio').play();
                click_counter++;            
                counter.innerHTML = 'Ходы: ' + click_counter; 
                if (firstclick === true) init();
                firstclick = false;
            }
            document.querySelector('.empty').innerHTML = cell.innerHTML;        
            document.querySelector('.empty').className = 'cell';                  
            cell.className = 'empty';
            cell.innerHTML = '';
            cells_fill(cell);             
            if (check() === true) {
                clearInterval(interval);
                for (let k = 0; k < 15; k++) {
                    document.getElementById('c' + k).style.backgroundColor = 'rgb(54, 54, 54)';
                }
                document.getElementById('c11').style.pointerEvents = 'none';
                document.getElementById('c14').style.pointerEvents = 'none';
                document.querySelector('.audio2').play();
                showPrompt(`Ваш результат:<br><br>Время: ${document.getElementById('timer').innerHTML.slice(7)}<br>Количество ходов: ${click_counter}<br><br>Введите ваше имя:`);
            }
        });
    }
}

function showCover() {
    let popupCover = document.createElement('div');
    popupCover.id = 'popup-cover';
    document.body.style.overflowY = 'hidden';
    document.body.append(popupCover);    
}
function hideCover() {
    document.getElementById('popup-cover').remove();
    document.getElementById('popup').remove();    
    document.body.style.overflowY = '';
    new_game();
    game();
}
function showPrompt(text) {
    showCover();
    let popup = document.createElement('div');
    popup.id = 'popup';
    popup.innerHTML = text;
    document.body.append(popup);

    const name_field = document.createElement('input');
    name_field.setAttribute('type', 'input');
    name_field.className = 'name';
    name_field.id = 'name';
    popup.append(name_field);
    name_field.focus();

    const save_result = document.createElement('button');
    save_result.setAttribute('type', 'button');
    save_result.className = 'save_res';
    save_result.id = 'save_res';
    save_result.innerHTML = 'Сохранить результат';
    popup.append(save_result);

    save_result.addEventListener('click', () => {
        let results = [];
        let currentResult = {
            'name': name_field.value,
            'minutes': min,
            'seconds': sec,
            'count': click_counter,
            'points': click_counter + min * 60 + sec
        }        
        if (localStorage.getItem('Best results') !== null) {
            results = JSON.parse(localStorage.getItem('Best results'));
        }        
        results.push(currentResult);
        results.sort(function (a, b) {
            if (a.points > b.points) return 1;
            if (a.points < b.points) return -1;            
            return 0;
        });
        let best5Results = [];
        for (let i = 0; i < 5; i++) {
            if (results[i] !== undefined) best5Results.push(results[i]);
        }
        localStorage.setItem('Best results', JSON.stringify(best5Results));  
        clear_results();      
        print_results();
        hideCover(); 
    });

    const close_popup = document.createElement('button');
    close_popup.setAttribute('type', 'button');
    close_popup.classList.add('cl_pop');
    close_popup.id = 'cl_pop';
    close_popup.innerHTML = createIconHTML('close');
    popup.append(close_popup);   

    close_popup.addEventListener('click', () => {
        hideCover();        
    });
}

if (localStorage.getItem('Auto Save') !== null) {
    game();
    load_game('Auto Save');
} else game();

button.addEventListener('click', () => {
    new_game();
    game();
});

function new_game() {
    localStorage.removeItem('Auto Save');
    click_counter = 0;
    counter.innerHTML = 'Ходы: ' + click_counter;
    firstclick = true;
    sec = 0;
    min = 0;
    clearInterval(interval);
    document.getElementById('timer').innerHTML = 'Время: 00:00';
    field.innerHTML = '';   
}

sound_btn.addEventListener('click', () => {    
    mute = !mute;
    muting();
});

function muting () {
    if (mute) {
        document.querySelector('.audio').muted = true;
        document.querySelector('.audio2').muted = true;
        sound_btn.innerHTML = createIconHTML("volume_off");
        document.querySelector('.sound').style.color = 'rgb(255, 100, 100)';
    }
    else {
        document.querySelector('.audio').muted = false;
        document.querySelector('.audio2').muted = false;
        sound_btn.innerHTML = createIconHTML("volume_up");
        document.querySelector('.sound').style.color = 'rgb(255, 255, 255)';        
    }
}

const brick_down2 = document.createElement('div');
brick_down2.className = 'bttns2';
body.append(brick_down2);
const button2 = document.createElement('button');
button2.setAttribute('type', 'button');
button2.classList.add('save');
button2.innerHTML = 'Сохранить';
brick_down2.append(button2);
const button3 = document.createElement('button');
button3.setAttribute('type', 'button');
button3.classList.add('load')
button3.innerHTML = 'Загрузить';
brick_down2.append(button3);

button2.addEventListener('click', () => {
    if (sec !== undefined) {
        save_game('Save Game');
    }
});

function save_game(data) {
    saveGame = {
        'minutes': min,
        'seconds': sec,
        'count': click_counter,
        'zero': document.getElementById('c0').innerHTML,
        'one': document.getElementById('c1').innerHTML,
        'two': document.getElementById('c2').innerHTML,
        'three': document.getElementById('c3').innerHTML,
        'four': document.getElementById('c4').innerHTML,
        'five': document.getElementById('c5').innerHTML,
        'six': document.getElementById('c6').innerHTML,
        'seven': document.getElementById('c7').innerHTML,
        'eight': document.getElementById('c8').innerHTML,
        'nine': document.getElementById('c9').innerHTML,
        'ten': document.getElementById('c10').innerHTML,
        'eleven': document.getElementById('c11').innerHTML,
        'twelve': document.getElementById('c12').innerHTML,
        'therteen': document.getElementById('c13').innerHTML,
        'fourteen': document.getElementById('c14').innerHTML,
        'fifteen': document.getElementById('c15').innerHTML,
        'muted': mute
    }
    localStorage.setItem(data, JSON.stringify(saveGame));
}

button3.addEventListener('click', () => {
    if (localStorage.getItem('Save Game') !== null) {   
        load_game('Save Game')
    }   
});

function load_game(data) {
    saveGame = JSON.parse(localStorage.getItem(data));    
        click_counter = saveGame.count;
        counter.innerHTML = 'Ходы: ' + click_counter; 
        document.getElementById('c0').innerHTML = saveGame.zero;
        document.getElementById('c1').innerHTML = saveGame.one;
        document.getElementById('c2').innerHTML = saveGame.two;
        document.getElementById('c3').innerHTML = saveGame.three;
        document.getElementById('c4').innerHTML = saveGame.four;
        document.getElementById('c5').innerHTML = saveGame.five;
        document.getElementById('c6').innerHTML = saveGame.six;
        document.getElementById('c7').innerHTML = saveGame.seven;
        document.getElementById('c8').innerHTML = saveGame.eight;
        document.getElementById('c9').innerHTML = saveGame.nine;
        document.getElementById('c10').innerHTML = saveGame.ten;
        document.getElementById('c11').innerHTML = saveGame.eleven;
        document.getElementById('c12').innerHTML = saveGame.twelve;
        document.getElementById('c13').innerHTML = saveGame.therteen;
        document.getElementById('c14').innerHTML = saveGame.fourteen;
        document.getElementById('c15').innerHTML = saveGame.fifteen;
        mute = saveGame.muted;        
        muting();
        for (let k = 0; k < 16; k++) {
            if (document.getElementById('c' + k).innerHTML === '') document.getElementById('c' + k).className = 'cell empty';
            else document.getElementById('c' + k).className = 'cell';
        }    
        cells_fill(document.querySelector('.empty'));
        min = saveGame.minutes;
        sec = saveGame.seconds;    
        firstclick = false;
        clearInterval(interval);
        interval = setInterval(tick, 1000); 
}

function random() {
    let res = [];
    let x;
    while (res.length < 15) {  
        x = Math.round(14*Math.random()) + 1;
        if (res.indexOf(x, 0) === -1) res.push(x);
    }    
    let sum = 0;
    for (let i = 0; i < res.length; i++) {
        for (let j = i + 1; j < res.length; j++) {
            if (res[i] > res[j]) sum++;
        }
    }
    sum += 4;      
    if (sum % 2 === 0) {        
        return res;    
    }
    else return random();
}

function check() {
    let count = 0;
    for (let i = 0; i < 15; i++) {
        if(1 + Number(document.getElementById('c' + i).id.slice(1)) - document.getElementById('c' + i).innerHTML === 0) count++;                 
    }    
    if (count === 15) return true;
    else return false;
}

function init() {
    min = 0;
    sec = 0;
    interval = setInterval(tick, 1000);
}
            
function tick() {
    sec++;
    save_game('Auto Save');
    if (min < 10) {
        if (sec < 10) document.getElementById("timer").childNodes[0].nodeValue = `Время: 0${min}:0${sec}`;
        else if (sec > 9 && sec < 60) document.getElementById("timer").childNodes[0].nodeValue = `Время: 0${min}:${sec}`;
        else if (sec === 60) {
            min++;
            sec = 0;
            document.getElementById("timer").childNodes[0].nodeValue = `Время: 0${min}:00`;
        }
    } else if (min > 9 && min < 60) {
        if (sec < 10) document.getElementById("timer").childNodes[0].nodeValue = `Время: ${min}:0${sec}`;
        else if (sec > 9 && sec < 60) document.getElementById("timer").childNodes[0].nodeValue = `Время: ${min}:${sec}`;
        else if (sec === 60) {
            min++;
            sec = 0;
            document.getElementById("timer").childNodes[0].nodeValue = `Время: ${min}:00`;
        }
    } 
}

function cells_fill (cell) {
    if (cell.id === 'c0') {
        document.getElementById('c0').style.pointerEvents = 'none';
        document.getElementById('c1').style.pointerEvents = 'auto';
        document.getElementById('c2').style.pointerEvents = 'none';
        document.getElementById('c3').style.pointerEvents = 'none';
        document.getElementById('c4').style.pointerEvents = 'auto';
        document.getElementById('c5').style.pointerEvents = 'none';
        document.getElementById('c6').style.pointerEvents = 'none';
        document.getElementById('c7').style.pointerEvents = 'none';
        document.getElementById('c8').style.pointerEvents = 'none';
        document.getElementById('c9').style.pointerEvents = 'none';
        document.getElementById('c10').style.pointerEvents = 'none';
        document.getElementById('c11').style.pointerEvents = 'none';
        document.getElementById('c12').style.pointerEvents = 'none';
        document.getElementById('c13').style.pointerEvents = 'none';
        document.getElementById('c14').style.pointerEvents = 'none';
        document.getElementById('c15').style.pointerEvents = 'none';        
    }
    if (cell.id === 'c1') {
        document.getElementById('c0').style.pointerEvents = 'auto';
        document.getElementById('c1').style.pointerEvents = 'none';
        document.getElementById('c2').style.pointerEvents = 'auto';
        document.getElementById('c3').style.pointerEvents = 'none';
        document.getElementById('c4').style.pointerEvents = 'none';
        document.getElementById('c5').style.pointerEvents = 'auto';
        document.getElementById('c6').style.pointerEvents = 'none';
        document.getElementById('c7').style.pointerEvents = 'none';
        document.getElementById('c8').style.pointerEvents = 'none';
        document.getElementById('c9').style.pointerEvents = 'none';
        document.getElementById('c10').style.pointerEvents = 'none';
        document.getElementById('c11').style.pointerEvents = 'none';
        document.getElementById('c12').style.pointerEvents = 'none';
        document.getElementById('c13').style.pointerEvents = 'none';
        document.getElementById('c14').style.pointerEvents = 'none';
        document.getElementById('c15').style.pointerEvents = 'none';        
    }
    if (cell.id === 'c2') {
        document.getElementById('c0').style.pointerEvents = 'none';
        document.getElementById('c1').style.pointerEvents = 'auto';
        document.getElementById('c2').style.pointerEvents = 'none';
        document.getElementById('c3').style.pointerEvents = 'auto';
        document.getElementById('c4').style.pointerEvents = 'none';
        document.getElementById('c5').style.pointerEvents = 'none';
        document.getElementById('c6').style.pointerEvents = 'auto';
        document.getElementById('c7').style.pointerEvents = 'none';
        document.getElementById('c8').style.pointerEvents = 'none';
        document.getElementById('c9').style.pointerEvents = 'none';
        document.getElementById('c10').style.pointerEvents = 'none';
        document.getElementById('c11').style.pointerEvents = 'none';
        document.getElementById('c12').style.pointerEvents = 'none';
        document.getElementById('c13').style.pointerEvents = 'none';
        document.getElementById('c14').style.pointerEvents = 'none';
        document.getElementById('c15').style.pointerEvents = 'none';        
    }
    if (cell.id === 'c3') {
        document.getElementById('c0').style.pointerEvents = 'none';
        document.getElementById('c1').style.pointerEvents = 'none';
        document.getElementById('c2').style.pointerEvents = 'auto';
        document.getElementById('c3').style.pointerEvents = 'none';
        document.getElementById('c4').style.pointerEvents = 'none';
        document.getElementById('c5').style.pointerEvents = 'none';
        document.getElementById('c6').style.pointerEvents = 'none';
        document.getElementById('c7').style.pointerEvents = 'auto';
        document.getElementById('c8').style.pointerEvents = 'none';
        document.getElementById('c9').style.pointerEvents = 'none';
        document.getElementById('c10').style.pointerEvents = 'none';
        document.getElementById('c11').style.pointerEvents = 'none';
        document.getElementById('c12').style.pointerEvents = 'none';
        document.getElementById('c13').style.pointerEvents = 'none';
        document.getElementById('c14').style.pointerEvents = 'none';
        document.getElementById('c15').style.pointerEvents = 'none';        
    }
    if (cell.id === 'c4') {
        document.getElementById('c0').style.pointerEvents = 'auto';
        document.getElementById('c1').style.pointerEvents = 'none';
        document.getElementById('c2').style.pointerEvents = 'none';
        document.getElementById('c3').style.pointerEvents = 'none';
        document.getElementById('c4').style.pointerEvents = 'none';
        document.getElementById('c5').style.pointerEvents = 'auto';
        document.getElementById('c6').style.pointerEvents = 'none';
        document.getElementById('c7').style.pointerEvents = 'none';
        document.getElementById('c8').style.pointerEvents = 'auto';
        document.getElementById('c9').style.pointerEvents = 'none';
        document.getElementById('c10').style.pointerEvents = 'none';
        document.getElementById('c11').style.pointerEvents = 'none';
        document.getElementById('c12').style.pointerEvents = 'none';
        document.getElementById('c13').style.pointerEvents = 'none';
        document.getElementById('c14').style.pointerEvents = 'none';
        document.getElementById('c15').style.pointerEvents = 'none';        
    }
    if (cell.id === 'c5') {
        document.getElementById('c0').style.pointerEvents = 'none';
        document.getElementById('c1').style.pointerEvents = 'auto';
        document.getElementById('c2').style.pointerEvents = 'none';
        document.getElementById('c3').style.pointerEvents = 'none';
        document.getElementById('c4').style.pointerEvents = 'auto';
        document.getElementById('c5').style.pointerEvents = 'none';
        document.getElementById('c6').style.pointerEvents = 'auto';
        document.getElementById('c7').style.pointerEvents = 'none';
        document.getElementById('c8').style.pointerEvents = 'none';
        document.getElementById('c9').style.pointerEvents = 'auto';
        document.getElementById('c10').style.pointerEvents = 'none';
        document.getElementById('c11').style.pointerEvents = 'none';
        document.getElementById('c12').style.pointerEvents = 'none';
        document.getElementById('c13').style.pointerEvents = 'none';
        document.getElementById('c14').style.pointerEvents = 'none';
        document.getElementById('c15').style.pointerEvents = 'none';        
    }
    if (cell.id === 'c6') {
        document.getElementById('c0').style.pointerEvents = 'none';
        document.getElementById('c1').style.pointerEvents = 'none';
        document.getElementById('c2').style.pointerEvents = 'auto';
        document.getElementById('c3').style.pointerEvents = 'none';
        document.getElementById('c4').style.pointerEvents = 'none';
        document.getElementById('c5').style.pointerEvents = 'auto';
        document.getElementById('c6').style.pointerEvents = 'none';
        document.getElementById('c7').style.pointerEvents = 'auto';
        document.getElementById('c8').style.pointerEvents = 'none';
        document.getElementById('c9').style.pointerEvents = 'none';
        document.getElementById('c10').style.pointerEvents = 'auto';
        document.getElementById('c11').style.pointerEvents = 'none';
        document.getElementById('c12').style.pointerEvents = 'none';
        document.getElementById('c13').style.pointerEvents = 'none';
        document.getElementById('c14').style.pointerEvents = 'none';
        document.getElementById('c15').style.pointerEvents = 'none';        
    }
    if (cell.id === 'c7') {
        document.getElementById('c0').style.pointerEvents = 'none';
        document.getElementById('c1').style.pointerEvents = 'none';
        document.getElementById('c2').style.pointerEvents = 'none';
        document.getElementById('c3').style.pointerEvents = 'auto';
        document.getElementById('c4').style.pointerEvents = 'none';
        document.getElementById('c5').style.pointerEvents = 'none';
        document.getElementById('c6').style.pointerEvents = 'auto';
        document.getElementById('c7').style.pointerEvents = 'none';
        document.getElementById('c8').style.pointerEvents = 'none';
        document.getElementById('c9').style.pointerEvents = 'none';
        document.getElementById('c10').style.pointerEvents = 'none';
        document.getElementById('c11').style.pointerEvents = 'auto';
        document.getElementById('c12').style.pointerEvents = 'none';
        document.getElementById('c13').style.pointerEvents = 'none';
        document.getElementById('c14').style.pointerEvents = 'none';
        document.getElementById('c15').style.pointerEvents = 'none';        
    }
    if (cell.id === 'c8') {
        document.getElementById('c0').style.pointerEvents = 'none';
        document.getElementById('c1').style.pointerEvents = 'none';
        document.getElementById('c2').style.pointerEvents = 'none';
        document.getElementById('c3').style.pointerEvents = 'none';
        document.getElementById('c4').style.pointerEvents = 'auto';
        document.getElementById('c5').style.pointerEvents = 'none';
        document.getElementById('c6').style.pointerEvents = 'none';
        document.getElementById('c7').style.pointerEvents = 'none';
        document.getElementById('c8').style.pointerEvents = 'none';
        document.getElementById('c9').style.pointerEvents = 'auto';
        document.getElementById('c10').style.pointerEvents = 'none';
        document.getElementById('c11').style.pointerEvents = 'none';
        document.getElementById('c12').style.pointerEvents = 'auto';
        document.getElementById('c13').style.pointerEvents = 'none';
        document.getElementById('c14').style.pointerEvents = 'none';
        document.getElementById('c15').style.pointerEvents = 'none';        
    }
    if (cell.id === 'c9') {
        document.getElementById('c0').style.pointerEvents = 'none';
        document.getElementById('c1').style.pointerEvents = 'none';
        document.getElementById('c2').style.pointerEvents = 'none';
        document.getElementById('c3').style.pointerEvents = 'none';
        document.getElementById('c4').style.pointerEvents = 'none';
        document.getElementById('c5').style.pointerEvents = 'auto';
        document.getElementById('c6').style.pointerEvents = 'none';
        document.getElementById('c7').style.pointerEvents = 'none';
        document.getElementById('c8').style.pointerEvents = 'auto';
        document.getElementById('c9').style.pointerEvents = 'none';
        document.getElementById('c10').style.pointerEvents = 'auto';
        document.getElementById('c11').style.pointerEvents = 'none';
        document.getElementById('c12').style.pointerEvents = 'none';
        document.getElementById('c13').style.pointerEvents = 'auto';
        document.getElementById('c14').style.pointerEvents = 'none';
        document.getElementById('c15').style.pointerEvents = 'none';        
    }
    if (cell.id === 'c10') {
        document.getElementById('c0').style.pointerEvents = 'none';
        document.getElementById('c1').style.pointerEvents = 'none';
        document.getElementById('c2').style.pointerEvents = 'none';
        document.getElementById('c3').style.pointerEvents = 'none';
        document.getElementById('c4').style.pointerEvents = 'none';
        document.getElementById('c5').style.pointerEvents = 'none';
        document.getElementById('c6').style.pointerEvents = 'auto';
        document.getElementById('c7').style.pointerEvents = 'none';
        document.getElementById('c8').style.pointerEvents = 'none';
        document.getElementById('c9').style.pointerEvents = 'auto';
        document.getElementById('c10').style.pointerEvents = 'none';
        document.getElementById('c11').style.pointerEvents = 'auto';
        document.getElementById('c12').style.pointerEvents = 'none';
        document.getElementById('c13').style.pointerEvents = 'none';
        document.getElementById('c14').style.pointerEvents = 'auto';
        document.getElementById('c15').style.pointerEvents = 'none';        
    }
    if (cell.id === 'c11') {
        document.getElementById('c0').style.pointerEvents = 'none';
        document.getElementById('c1').style.pointerEvents = 'none';
        document.getElementById('c2').style.pointerEvents = 'none';
        document.getElementById('c3').style.pointerEvents = 'none';
        document.getElementById('c4').style.pointerEvents = 'none';
        document.getElementById('c5').style.pointerEvents = 'none';
        document.getElementById('c6').style.pointerEvents = 'none';
        document.getElementById('c7').style.pointerEvents = 'auto';
        document.getElementById('c8').style.pointerEvents = 'none';
        document.getElementById('c9').style.pointerEvents = 'none';
        document.getElementById('c10').style.pointerEvents = 'auto';
        document.getElementById('c11').style.pointerEvents = 'none';
        document.getElementById('c12').style.pointerEvents = 'none';
        document.getElementById('c13').style.pointerEvents = 'none';
        document.getElementById('c14').style.pointerEvents = 'none';
        document.getElementById('c15').style.pointerEvents = 'auto';         
    }
    if (cell.id === 'c12') {
        document.getElementById('c0').style.pointerEvents = 'none';
        document.getElementById('c1').style.pointerEvents = 'none';
        document.getElementById('c2').style.pointerEvents = 'none';
        document.getElementById('c3').style.pointerEvents = 'none';
        document.getElementById('c4').style.pointerEvents = 'none';
        document.getElementById('c5').style.pointerEvents = 'none';
        document.getElementById('c6').style.pointerEvents = 'none';
        document.getElementById('c7').style.pointerEvents = 'none';
        document.getElementById('c8').style.pointerEvents = 'auto';
        document.getElementById('c9').style.pointerEvents = 'none';
        document.getElementById('c10').style.pointerEvents = 'none';
        document.getElementById('c11').style.pointerEvents = 'none';
        document.getElementById('c12').style.pointerEvents = 'none';
        document.getElementById('c13').style.pointerEvents = 'auto';
        document.getElementById('c14').style.pointerEvents = 'none';
        document.getElementById('c15').style.pointerEvents = 'none';        
    }
    if (cell.id === 'c13') {
        document.getElementById('c0').style.pointerEvents = 'none';
        document.getElementById('c1').style.pointerEvents = 'none';
        document.getElementById('c2').style.pointerEvents = 'none';
        document.getElementById('c3').style.pointerEvents = 'none';
        document.getElementById('c4').style.pointerEvents = 'none';
        document.getElementById('c5').style.pointerEvents = 'none';
        document.getElementById('c6').style.pointerEvents = 'none';
        document.getElementById('c7').style.pointerEvents = 'none';
        document.getElementById('c8').style.pointerEvents = 'none';
        document.getElementById('c9').style.pointerEvents = 'auto';
        document.getElementById('c10').style.pointerEvents = 'none';
        document.getElementById('c11').style.pointerEvents = 'none';
        document.getElementById('c12').style.pointerEvents = 'auto';
        document.getElementById('c13').style.pointerEvents = 'none';
        document.getElementById('c14').style.pointerEvents = 'auto';
        document.getElementById('c15').style.pointerEvents = 'none';        
    }
    if (cell.id === 'c14') {
        document.getElementById('c0').style.pointerEvents = 'none';
        document.getElementById('c1').style.pointerEvents = 'none';
        document.getElementById('c2').style.pointerEvents = 'none';
        document.getElementById('c3').style.pointerEvents = 'none';
        document.getElementById('c4').style.pointerEvents = 'none';
        document.getElementById('c5').style.pointerEvents = 'none';
        document.getElementById('c6').style.pointerEvents = 'none';
        document.getElementById('c7').style.pointerEvents = 'none';
        document.getElementById('c8').style.pointerEvents = 'none';
        document.getElementById('c9').style.pointerEvents = 'none';
        document.getElementById('c10').style.pointerEvents = 'auto';
        document.getElementById('c11').style.pointerEvents = 'none';
        document.getElementById('c12').style.pointerEvents = 'none';
        document.getElementById('c13').style.pointerEvents = 'auto';
        document.getElementById('c14').style.pointerEvents = 'none';
        document.getElementById('c15').style.pointerEvents = 'auto';        
    }
    if (cell.id === 'c15') {        
        document.getElementById('c0').style.pointerEvents = 'none';
        document.getElementById('c1').style.pointerEvents = 'none';
        document.getElementById('c2').style.pointerEvents = 'none';
        document.getElementById('c3').style.pointerEvents = 'none';
        document.getElementById('c4').style.pointerEvents = 'none';
        document.getElementById('c5').style.pointerEvents = 'none';
        document.getElementById('c6').style.pointerEvents = 'none';
        document.getElementById('c7').style.pointerEvents = 'none';
        document.getElementById('c8').style.pointerEvents = 'none';
        document.getElementById('c9').style.pointerEvents = 'none';
        document.getElementById('c10').style.pointerEvents = 'none';
        document.getElementById('c11').style.pointerEvents = 'auto';
        document.getElementById('c12').style.pointerEvents = 'none';
        document.getElementById('c13').style.pointerEvents = 'none';
        document.getElementById('c14').style.pointerEvents = 'auto';
        document.getElementById('c15').style.pointerEvents = 'none';        
    }
}

const list_container = document.createElement('div');
const list_container_h1 = document.createElement('div');
const list_container_table = document.createElement('table');
list_container.className = 'list_cont';
list_container_h1.className = 'list_cont_h1';
list_container_table.className = 'list_cont_table';
body.append(list_container);
list_container.append(list_container_h1);
list_container.append(list_container_table);
document.querySelector('.list_cont_h1').innerHTML = '<b><i>Лучшие результаты:</i></b>';
clear_results();
print_results();

function print_results() {
    if (localStorage.getItem('Best results') === null) {
        document.querySelector('.list_cont_table').innerHTML = '-';
    } else {
        let res = JSON.parse(localStorage.getItem('Best results'));
        const item_head = document.createElement('tr');
        item_head.className = 'item_head';
        list_container_table.append(item_head);
        document.querySelector('.item_head').innerHTML = `<th></th><th>Имя</th><th>Время</th><th>Ходы</th><th>Баллы</th>`;
        for (let i = 0; i < res.length; i++) {
            const item_list = document.createElement('tr');
            item_list.className = 'item_list';
            item_list.id = `t${i}`;
            list_container_table.append(item_list);

            if (res[i].minutes < 10 && res[i].seconds < 10) {
                document.getElementById(`t${i}`).innerHTML = `<td>${i + 1}.</td><td>${res[i].name}</td><td>0${res[i].minutes}:0${res[i].seconds}</td><td>${res[i].count}</td><td>${res[i].points}</td>`;
            } else if (res[i].minutes < 10 && res[i].seconds > 9) {
                document.getElementById(`t${i}`).innerHTML = `<td>${i + 1}.</td><td>${res[i].name}</td><td>0${res[i].minutes}:${res[i].seconds}</td><td>${res[i].count}</td><td>${res[i].points}</td>`;
            } else {
                document.getElementById(`t${i}`).innerHTML = `<td>${i + 1}.</td><td>${res[i].name}</td><td>${res[i].minutes}:${res[i].seconds}</td><td>${res[i].count}</td><td>${res[i].points}</td>`;
            }
        }
    }
}

function clear_results() {
    document.querySelector('.list_cont_table').innerHTML = '';
}