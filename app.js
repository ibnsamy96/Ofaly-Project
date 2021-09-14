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
  const imageDiv = document.createElement("div");
  const imageDivNumber = document.createElement("p");

  galleryCol.setAttribute("class", "col");
  imgContainer.setAttribute("class", "img-container");
  imageDiv.setAttribute("class", "gallery-img");
  imageDivNumber.setAttribute("class", "gallery-img-number");

  imageDiv.style.backgroundImage = `url('${imageObject.thumbnailLink}')`;
  imageDivNumber.innerText = imageObject.number;

  galleryCol.appendChild(imgContainer);
  imgContainer.appendChild(imageDiv);
  imgContainer.appendChild(imageDivNumber);

  galleryRow.appendChild(galleryCol);
}

const toggleMenu = () => {};
document.querySelector("button").addEventListener("click", toggleMenu);

galleryImages.forEach((image, index) => {
  console.log(index);
  const imageObject = { number: index + 1, ...image };
  addImagesToGallery(imageObject);
});
