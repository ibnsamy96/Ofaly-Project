import { galleryImages } from "./gallery-images.js";

function addImagesToGallery(imageObject) {
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

const showGalleryImage = (imageNumber) => {
  // TODO fetch all images right after opening the page so that they open fast when clicked
  const { imgLink, imgText } = galleryImages[imageNumber - 1];
  clickedImageContainer.querySelector("img").setAttribute("src", imgLink);
  clickedImageContainer.querySelector("p").innerText = imgText;

  toggleOverlay({ isMenu: false });
  clickedImageContainer.style.display = "flex";
};

const hideGalleryImage = () => {
  clickedImageContainer.style.display = "none";
  toggleOverlay({ isMenu: false });
};

clickedImageContainer
  .querySelector("button")
  .addEventListener("click", hideGalleryImage);

const hamburgerMenuBTN = document.querySelector("#hamburger-menu button");
hamburgerMenuBTN.addEventListener("click", toggleMenu);

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
