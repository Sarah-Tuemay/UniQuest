const logo = document.querySelector('.logo');
const signUp = document.querySelector(".sign-up");
const signIn = document.querySelector(".sign-in");
const loginForm = document.querySelector(".loginForm");
const signUpForm = document.querySelector(".sign-up-form");
const signInForm = document.querySelector(".sign-in-form");

const signInButton = document.querySelector('.signInButton');
const signUpButton = document.querySelector('.signUpButton');

signInButton.addEventListener('click',()=>{
    window.location = 'jobs.html';
})

signUpButton.addEventListener('click',()=>{
    window.location = 'jobs.html';
})


logo.addEventListener('click', ()=>{
    window.location.href = '../index.html';
})
signUp.addEventListener("click", function() {
    signUpForm.style.display = 'block';
    signInForm.style.display = 'none';
    signUp.classList.add('clicked'); 
    signIn.classList.remove('clicked');
    loginForm.innerHTML = signUpForm.innerHTML;
})


signIn.addEventListener("click", function() {
    signUp.classList.remove('clicked'); 
    signInForm.style.display = 'block';
    signUpForm.style.display = 'none';
    signIn.classList.add('clicked'); 
    loginForm.innerHTML = signInForm.innerHTML;
})

function loginPage() {
    signInForm.style.display = 'block';
    signUpForm.style.display = 'none';
    loginForm.innerHTML = signInForm.innerHTML;
}

loginPage();
 
