import { galleryImages } from "./gallery-images.js";

function addImagesToGallery(imageObject) {
  // imageObject = {
  //     text:
  //     link:
  //     number:
  // }

  const marginsArray = ["", "", ""];

  const galleryRow = document.querySelector("#gallery .container .row");

  const galleryCol = document.createElement("div");
  const imgContainer = document.createElement("div");
  const galleryImg = document.createElement("div");
  const galleryImgNumber = document.createElement("p");

  galleryCol.setAttribute("class", "col");
  imgContainer.setAttribute("class", "img-container");
  galleryImg.setAttribute("class", "gallery-img");
  galleryImg.setAttribute("data-number", imageObject.number);
  galleryImg.addEventListener("click", (e) =>
    showGalleryImage(e.target.dataset.number)
  );
  galleryImgNumber.setAttribute("class", "gallery-img-number");

  galleryImg.style.backgroundImage = `url('${imageObject.thumbnailLink}')`;
  galleryImgNumber.innerText = imageObject.number;

  galleryCol.appendChild(imgContainer);
  imgContainer.appendChild(galleryImg);
  imgContainer.appendChild(galleryImgNumber);

  galleryRow.appendChild(galleryCol);
}

const toggleMenu = () => {
  console.log("menu toggled");
};
const clickedImageContainer = document.querySelector(
  "#clicked-image-container"
);

const overlay = document.querySelector("#overlay");

const togglePageScroll = (neededAction) => {
  if (neededAction === "show-scroll") {
    document.body.style.overflow = "visible";
  } else if (neededAction === "hide-scroll") {
    document.body.style.overflow = "hidden";
  }
};

const toggleOverlay = () => {
  togglePageScroll();

  const oldState = overlay.style.display;
  let newState;

  if (oldState === "block") {
    togglePageScroll("show-scroll");
    newState = "none";
  } else {
    togglePageScroll("hide-scroll");
    newState = "block";
  }

  overlay.style.display = newState;
};

const showGalleryImage = (imageNumber) => {
  // TODO fetch all images right after opening the page so that they open fast when clicked
  const { imgLink, imgText } = galleryImages[imageNumber - 1];
  clickedImageContainer.querySelector("img").setAttribute("src", imgLink);
  clickedImageContainer.querySelector("p").innerText = imgText;
  clickedImageContainer
    .querySelector("img")
    .addEventListener("click", hideGalleryImage);

  toggleOverlay();
  clickedImageContainer.style.display = "flex";
};

const hideGalleryImage = () => {
  clickedImageContainer.style.display = "none";
  toggleOverlay();
};

document.querySelector("button").addEventListener("click", toggleMenu);

galleryImages.forEach((image, index) => {
  console.log(index);
  const imageObject = { number: index + 1, ...image };
  addImagesToGallery(imageObject);
});
