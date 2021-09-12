import { galleryImages } from "./gallery-images.js";

function addImagesToGallery(imageObject) {
  // imageObject = {
  //     text:
  //     link:
  //     number:
  // }

  const gallery = document.querySelector("#gallery");

  const imgContainer = document.createElement("div");
  const galleryImage = document.createElement("div");
  const galleryImageNumber = document.createElement("p");

  imgContainer.setAttribute("id", "img-container");
  galleryImage.setAttribute("class", "gallery-img");
  galleryImageNumber.setAttribute("class", "gallery-img-number");

  galleryImage.style.backgroundImage = `url('${imageObject.link}')`;
  galleryImageNumber.innerText = imageObject.number;

  imgContainer.appendChild(galleryImage);
  imgContainer.appendChild(galleryImageNumber);

  gallery.appendChild(imgContainer);
}

const toggleMenu = () => {};
document.querySelector("button").addEventListener("click", toggleMenu);

galleryImages.forEach((image, index) => {
  console.log(index);
  const imageObject = { number: index + 1, ...image };
  addImagesToGallery(imageObject);
});
