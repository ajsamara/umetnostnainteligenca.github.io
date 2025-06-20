let newX = 0, newY = 0, startX = 0, startY = 0;
let activeCard = null;

const cards = document.querySelectorAll('.card');

cards.forEach(card => {
  card.addEventListener('mousedown', (e) => {
    activeCard = card;
    startX = e.clientX;
    startY = e.clientY;

    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseup', mouseUp);
  });
});

function mouseMove(e) {
  if (!activeCard) return;

  newX = startX - e.clientX;
  newY = startY - e.clientY;

  startX = e.clientX;
  startY = e.clientY;

  activeCard.style.top = (activeCard.offsetTop - newY) + 'px';
  activeCard.style.left = (activeCard.offsetLeft - newX) + 'px';
}

function mouseUp() {
  document.removeEventListener('mousemove', mouseMove);
  document.removeEventListener('mouseup', mouseUp);
  activeCard = null;
}

