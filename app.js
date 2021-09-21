import { launcherImages } from "./launcher-images.js";

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

function addImagesToLauncher(imageObject) {
  const launcherRow = document.querySelector("#launcher .container .row");

  const launcherCol = document.createElement("div");
  const imgContainer = document.createElement("a");
  const launcherImg = document.createElement("div");

  launcherCol.setAttribute("class", "col");
  imgContainer.setAttribute("class", "img-container");
  imgContainer.setAttribute("href", imageObject.hrefValue);
  imgContainer.setAttribute("data-number", imageObject.number);

  launcherImg.setAttribute("class", "launcher-img");
  launcherImg.style.backgroundImage = `url('${imageObject.imgLink}')`;
  launcherImg.addEventListener("click", (e) => {
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

  launcherCol.appendChild(imgContainer);
  imgContainer.appendChild(launcherImg);

  launcherRow.appendChild(launcherCol);

  // specifying launcher images aspect-ratio
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

launcherImages.forEach((image, index) => {
  console.log(index);
  const imageObject = { number: index + 1, ...image };
  addImagesToLauncher(imageObject);
});

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
