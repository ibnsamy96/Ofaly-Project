import { launcherImages } from "./launcher-images.js";

console.log = () => {}; // to hide all logs

// Holds the document width => helpful to be checked to maintain responsiveness
let lastWidth;

// returns the current document width
function getDocumentWidth() {
  return (
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth
  );
}

/*
 returns element height based on its width and its specified aspect-ratio
 => helpful to replace aspect-ratio css property as it doesn't work on Safari
*/
function getElementHeightByCalculatingAspectRatio({ element, mainRatio }) {
  lastWidth = getDocumentWidth();

  const elementWidth = parseFloat(
    window.getComputedStyle(element).getPropertyValue("width")
  );
  const elementHeight = elementWidth * (1 / mainRatio);

  console.log(elementWidth);
  console.log(elementHeight);

  return elementHeight;
}

let lastClickedImage;
const imgsContainersObjects = [];
/*
takes an imageObject:{ index , hrefValue , imgLink } as an argument, creates element for the image
and and adds it to the gallery section in the page
*/
function addImagesToLauncher(imageObject) {
  const launcherRow = document.querySelector("#launcher .container .row");

  const launcherCol = document.createElement("div");
  const imgContainer = document.createElement("a");
  const launcherImg = document.createElement("div");

  launcherCol.setAttribute("class", "col");
  imgContainer.setAttribute("class", "img-container");
  imgContainer.setAttribute("href", imageObject.hrefValue);
  imgContainer.setAttribute("data-index", imageObject.index);

  launcherImg.setAttribute("class", "launcher-img");
  launcherImg.style.backgroundImage = `url('${imageObject.imgLink}')`;
  launcherImg.addEventListener("click", (e) => {
    e.preventDefault();
    try {
      lastClickedImage.style.borderColor = "transparent";
    } catch (error) {}
    lastClickedImage = e.target;
    lastClickedImage.style.borderColor = "black";
    setTimeout(() => {
      window.location.href = imageObject.hrefValue;
    }, 200);
  });

  launcherCol.appendChild(imgContainer);
  imgContainer.appendChild(launcherImg);

  launcherRow.appendChild(launcherCol);

  // specifying launcher images aspect-ratio
  if (!CSS.supports("aspect-ratio: 1")) {
    console.log("no aspect-ratio support");
    const elementObject = {
      element: imgContainer,
      mainRatio: 1,
    };
    imgContainer.style.height = `${getElementHeightByCalculatingAspectRatio(
      elementObject
    )}px`;
    imgsContainersObjects.push(elementObject);
  }
}

// adds all images from 'launcherImages' to the launcher
launcherImages.forEach((image, index) => {
  console.log(index);
  const imageObject = { index, ...image };
  addImagesToLauncher(imageObject);
});

// if images isn't 3,6,9,12... then add 'margin:auto' to the last row images
if (launcherImages.length % 3 !== 0) {
  console.log(launcherImages);
  const imagesTempVar = [
    ...document.querySelectorAll("#launcher .row .col:nth-of-type(3n-2)"),
  ];

  const lastImageContainer =
    imagesTempVar[imagesTempVar.length - 1].querySelector(".img-container");

  console.log(lastImageContainer);
  lastImageContainer.classList.add("m-auto");
}

// if no aspect-ratio support, then add event listener to window to update images height using getElementHeightByCalculatingAspectRatio()
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
