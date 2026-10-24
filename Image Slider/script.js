
const imageContainer = document.querySelector(".image-container");
const images = document.querySelectorAll(".image-container img");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const counter = document.getElementById("counter");

let currentIndex = 0;
const totalImages = images.length;

function showImage() {
  imageContainer.style.transform =
    `translateX(-${currentIndex * 100}%)`;

  counter.textContent = `${currentIndex + 1} / ${totalImages}`;
}

function nextImage() {
  currentIndex++;

  if (currentIndex >= totalImages) {
    currentIndex = 0;
  }

  showImage();
}

function prevImage() {
  currentIndex--;

  if (currentIndex < 0) {
    currentIndex = totalImages - 1;
  }

  showImage();
}

nextButton.addEventListener("click", nextImage);
prevButton.addEventListener("click", prevImage);

// Automatically change images every 3 seconds
let slideInterval = setInterval(nextImage, 3000);

// Restart the timer after manual navigation
function resetTimer() {
  clearInterval(slideInterval);
  slideInterval = setInterval(nextImage, 3000);
}

nextButton.addEventListener("click", resetTimer);
prevButton.addEventListener("click", resetTimer);

showImage();
