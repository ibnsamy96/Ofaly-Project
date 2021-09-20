import { galleryImages } from "./gallery-images.js";

const imgsContainersObjects = [];
let lastWidth;
let lastClickedImage;

function getDocumentWidth() {
  return (
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth
  );
}

function getElementHeightByCalculatingAspectRatio({
  element,
  mainRatio,
  responsiveRatios,
}) {
  lastWidth = getDocumentWidth();

  let ratio = mainRatio;

  for (let maxWidthValue in responsiveRatios) {
    if (parseFloat(lastWidth) <= parseInt(maxWidthValue)) {
      ratio = responsiveRatios[maxWidthValue];
    }
  }

  console.log(ratio);

  const elementWidth = parseFloat(
    window.getComputedStyle(element).getPropertyValue("width")
  );
  const elementHeight = elementWidth * (1 / ratio);

  console.log(elementWidth);
  console.log(elementHeight);

  return elementHeight;
}

function addImagesToGallery(imageObject) {
  const galleryRow = document.querySelector("#gallery .container .row");

  const galleryCol = document.createElement("div");
  const imgContainer = document.createElement("a");
  const galleryImg = document.createElement("div");

  galleryCol.setAttribute("class", "col");
  imgContainer.setAttribute("class", "img-container");
  imgContainer.setAttribute("href", imageObject.hrefValue);
  imgContainer.setAttribute("data-number", imageObject.number);

  galleryImg.setAttribute("class", "gallery-img");
  galleryImg.style.backgroundImage = `url('${imageObject.imgLink}')`;
  galleryImg.addEventListener("click", (e) => {
    // console.log(this);
    // console.log("e.target ->");
    e.preventDefault();
    console.log(e.target);

    try {
      lastClickedImage.style.borderColor = "transparent";
    } catch (error) {}

    lastClickedImage = e.target;
    lastClickedImage.style.borderColor = "black";

    setTimeout(() => {
      window.location.href = imageObject.hrefValue;
    }, 200);
  });

  galleryCol.appendChild(imgContainer);
  imgContainer.appendChild(galleryImg);

  galleryRow.appendChild(galleryCol);

  // specifying gallery images aspect-ratio
  if (!CSS.supports("aspect-ratio: 1")) {
    console.log("no aspect-ratio support");
    const elementObject = {
      element: imgContainer,
      mainRatio: 1,
      responsiveRatios: {},
    };
    imgContainer.style.height = `${getElementHeightByCalculatingAspectRatio(
      elementObject
    )}px`;
    imgsContainersObjects.push(elementObject);
  }
}

galleryImages.forEach((image, index) => {
  console.log(index);
  const imageObject = { number: index + 1, ...image };
  addImagesToGallery(imageObject);
});

if (galleryImages.length % 3 !== 0) {
  const imagesTempVar = [
    ...document.querySelectorAll("#gallery .row .col:nth-of-type(3n-2)"),
  ];

  const lastImageContainer =
    imagesTempVar[imagesTempVar.length - 1].querySelector(".img-container");

  console.log(lastImageContainer);
  lastImageContainer.classList.add("m-auto");
}

if (!CSS.supports("aspect-ratio: 1")) {
  window.addEventListener("resize", () => {
    if (lastWidth !== getDocumentWidth()) {
      imgsContainersObjects.forEach((elementObject) => {
        elementObject[
          "element"
        ].style.height = `${getElementHeightByCalculatingAspectRatio(
          elementObject
        )}px`;
      });
    }
  });
}
