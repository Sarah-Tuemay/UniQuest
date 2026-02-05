const logo = document.querySelector('.logo');
const imageFile = document.querySelector('.imageFile');
const studentId = document.querySelector('.studentId');
const submitButton = document.querySelector('.submitButton');
const profile = document.querySelector('.profile');
const message = document.querySelector('.submit-message');


logo.addEventListener('click', ()=>{
    window.location.href = '../index.html';
})
imageFile.addEventListener('change', (event) => {
    const file = event.target.files[0]; 
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();

        reader.onload = function(e) {
            studentId.src = e.target.result; 
            studentId.style.display = 'block';
        };

        reader.readAsDataURL(file);
    } else {
        imagePreview.style.display = 'none';
    }
});

profile.addEventListener('submit', (e)=>{
    e.preventDefault();
    const inputs = document.querySelectorAll('input, select');
    let valueEntered = true;
    inputs.forEach(input=>{
        if(!input.value){
            valueEntered = false;
        }
    });
    profile.style.display = 'block';
    profile.innerHTML = message.innerHTML;
})
