import { galleryImages } from "./gallery-images.js";

const aspectRatioElements = [];

function getElementHeightByCalculatingAspectRatio({
  element,
  mainRatio,
  responsiveRatios,
}) {
  const documentWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;

  let ratio = mainRatio;

  for (let maxWidthValue in responsiveRatios) {
    if (parseFloat(documentWidth) <= parseInt(maxWidthValue)) {
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
  const imgContainer = document.createElement("div");
  const galleryImg = document.createElement("div");
  const galleryImgNumber = document.createElement("p");

  galleryCol.setAttribute("class", "col");
  imgContainer.setAttribute("class", "img-container");
  imgContainer.setAttribute("data-number", imageObject.number);

  if (!CSS.supports("aspect-ratio: 1")) {
    console.log("no aspect-ratio support");
    const resizableElementObject = {
      element: imgContainer,
      mainRatio: 365 / 404,
      responsiveRatios: { 1025: 175 / 195 },
    };
    imgContainer.style.height = `${getElementHeightByCalculatingAspectRatio(
      resizableElementObject
    )}px`;
    aspectRatioElements.push(resizableElementObject);
  }

  imgContainer.addEventListener("click", (e) => {
    try {
      showGalleryImage(e.target.dataset.number);
    } catch (error) {
      try {
        showGalleryImage(e.path[1]["dataset"]["number"]);
      } catch (error) {
        showGalleryImage(e.explicitOriginalTarget.parentElement.dataset.number);
      }
    }
  });

  galleryImg.setAttribute("class", "gallery-img");
  galleryImgNumber.setAttribute("class", "gallery-img-number");

  galleryImg.style.backgroundImage = `url('${imageObject.thumbnailLink}')`;
  galleryImgNumber.innerText = imageObject.number;

  galleryCol.appendChild(imgContainer);
  imgContainer.appendChild(galleryImg);
  imgContainer.appendChild(galleryImgNumber);

  galleryRow.appendChild(galleryCol);
}

const hamburgerNav = document.querySelector("#hamburger-menu nav");
const hamburgerNavUL = document.querySelector("#hamburger-menu nav ul");

const toggleMenu = () => {
  const oldState = hamburgerNav.style.display;
  let newDisplay;
  let newOpacity;
  let newTop;

  if (oldState === "block") {
    newDisplay = "none";
    newTop = "10px";
    newOpacity = 0;
  } else {
    toggleOverlay({ isMenu: true });
    newDisplay = "block";
    newTop = "0px";
    newOpacity = 1;
  }

  if (oldState === "block") {
    hamburgerNavUL.style.opacity = newOpacity;
    hamburgerNavUL.style.top = newTop;
    setTimeout(() => {
      hamburgerNav.style.display = newDisplay;
    }, 500);
  } else {
    hamburgerNav.style.display = newDisplay;
    setTimeout(() => {
      hamburgerNavUL.style.opacity = newOpacity;
      hamburgerNavUL.style.top = newTop;
    }, 100);
  }
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

const toggleOverlay = ({ isMenu }) => {
  togglePageScroll();

  const oldState = overlay.style.display;
  let newState;

  if (oldState === "block") {
    if (overlay.dataset.state === "menu-opened") {
      toggleMenu();
    } else {
      overlay.classList.remove("blurryEffect");
    }
    overlay.removeAttribute("data-state");
    togglePageScroll("show-scroll");
    newState = "none";
  } else {
    if (isMenu) {
      overlay.setAttribute("data-state", "menu-opened");
    } else {
      overlay.setAttribute("data-state", "img-shown");
      overlay.classList.add("blurryEffect");
    }
    togglePageScroll("hide-scroll");
    newState = "block";
  }

  overlay.style.display = newState;
};

overlay.addEventListener("click", toggleOverlay);

const hamburgerMenuBTN = document.querySelector("#hamburger-menu button");
hamburgerMenuBTN.addEventListener("click", toggleMenu);

const showGalleryImage = (imageNumber) => {
  // TODO fetch all images right after opening the page so that they open fast when clicked
  const { imgLink, imgText } = galleryImages[imageNumber - 1];
  clickedImageContainer.querySelector("img").setAttribute("src", imgLink);
  clickedImageContainer.querySelector("p").innerText = imgText;

  toggleOverlay({ isMenu: false });
  hamburgerMenuBTN.style.display = "none";
  clickedImageContainer.style.display = "flex";
};

const hideGalleryImage = () => {
  clickedImageContainer.style.display = "none";
  toggleOverlay({ isMenu: false });
  hamburgerMenuBTN.style.display = "flex";
};

clickedImageContainer
  .querySelector("button")
  .addEventListener("click", hideGalleryImage);

galleryImages.forEach((image, index) => {
  console.log(index);
  const imageObject = { number: index + 1, ...image };
  addImagesToGallery(imageObject);
});

const linksElements = [
  ...document.querySelectorAll("#hamburger-menu nav ul .nav-item"),
];
linksElements.forEach((linkElement) => {
  linkElement.addEventListener("click", (e) => {
    e.preventDefault();
    toggleOverlay({ isMenu: true });
    const link = e.target.href || e.path[1]["href"];
    if (window.location.href !== link) {
      window.location.href = link;
    }
  });
});

if (!CSS.supports("aspect-ratio: 1")) {
  window.addEventListener("resize", () => {
    aspectRatioElements.forEach((elementObject) => {
      elementObject[
        "element"
      ].style.height = `${getElementHeightByCalculatingAspectRatio(
        elementObject
      )}px`;
    });
  });
}
