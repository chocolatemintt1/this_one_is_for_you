const noButton = document.getElementById('no-button');
const yesButton = document.getElementById('yes-button');
let noClicks = 0;

noButton.addEventListener('mouseover', function() {
    shrinkNoButton();
});

noButton.addEventListener('click', function() {
    shrinkNoButton();
});

function shrinkNoButton() {
    noClicks++;
    const newScale = Math.max(1 - noClicks * 0.1, 0); // Shrinks the button by 10% each time
    
    noButton.style.transform = `scale(${newScale})`;
    yesButton.style.transform = `scale(${1 + noClicks * 0.1})`;

    if (newScale <= 0) {
        noButton.style.display = 'none';
    }
}



yesButton.addEventListener('click', function() {
    window.location.href = 'yes.html';
});
