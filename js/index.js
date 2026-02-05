const card_3 = document.querySelector('.card-3');
const card_1 = document.querySelector('.card-1');
const card_2 = document.querySelector('.card-2');
const menu = document.querySelector('.hum-menu');
const navigator = document.querySelector('.navigator');

card_3.addEventListener('click', ()=>{
    window.location.href = 'pages/jobs.html';
})
card_1.addEventListener('click', ()=>{
    console.log('working');
    window.location.href = 'pages/profile.html';
})
card_2.addEventListener('click', ()=>{
    console.log('working');
    window.location.href = 'pages/jobs.html';
})

menu.addEventListener('click', ()=>{
    navigator.style.display = 'block';
})