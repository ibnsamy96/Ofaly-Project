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

// toggles the body overflow => helpful to stop scrolling after clicking gallery image or the hamburger-menu
const togglePageScroll = (neededAction) => {
  if (neededAction === "show-scroll") {
    document.body.style.overflow = "visible";
  } else if (neededAction === "hide-scroll") {
    document.body.style.overflow = "hidden";
  }
};

const hamburgerNav = document.querySelector("#hamburger-menu nav");
const hamburgerNavUL = document.querySelector("#hamburger-menu nav ul");
const hamburgerMenuBTN = document.querySelector("#hamburger-menu button");
const linksElements = [
  ...document.querySelectorAll("#hamburger-menu nav ul .nav-item"),
];

// toggles the hamburger-menu and its transparent overlay
const toggleMenu = () => {
  const oldMenuState = hamburgerNav.style.display;

  if (oldMenuState === "flex") {
    hamburgerNavUL.style.opacity = 0;
    hamburgerNavUL.style.top = "10px";
    setTimeout(() => {
      hamburgerNav.style.display = "none";
    }, 500);
  } else {
    toggleOverlay({ isMenu: true });
    hamburgerNav.style.display = "flex";
    setTimeout(() => {
      hamburgerNavUL.style.opacity = 1;
      hamburgerNavUL.style.top = "0px";
    }, 100);
  }
};

hamburgerMenuBTN.addEventListener("click", toggleMenu);

// this loop is made to toggleOverlay before navigating to another link
linksElements.forEach((linkElement) => {
  linkElement.addEventListener("click", (e) => {
    e.preventDefault();
    toggleOverlay({ isMenu: true });
    const link = e.target.href || e.target.parentElement.href;
    if (window.location.href !== link) {
      window.location.href = link;
    }
  });
});

const overlay = document.querySelector("#overlay");

// show the overlay and hides it
const toggleOverlay = ({ isMenu }) => {
  togglePageScroll();

  const oldOverlayState = overlay.style.display;
  let newOverlayState;

  if (oldOverlayState === "block") {
    // overlay was clicked => hide it and do some actions
    if (overlay.dataset.state === "menu-opened") {
      // if overlay is clicked and the menu is open, toggle the menu to close it before removing the overlay
      toggleMenu();
    } else {
      // if overlay is clicked and an image container is open, remove the effect class before removing the overlay
      overlay.className = "z-index-1";
    }
    overlay.removeAttribute("data-state");
    togglePageScroll("show-scroll");
    newOverlayState = "none";
  } else {
    // other element was clicked and needs an overlay => show it and do tell type of element
    if (isMenu) {
      overlay.setAttribute("data-state", "menu-opened");
    } else {
      overlay.setAttribute("data-state", "img-shown");

      const isBrowserSupportBlur = CSS.supports("backdrop-filter: blur(15px)");

      const overlayBGClass = isBrowserSupportBlur
        ? "blurry-effect"
        : "solid-effect";
      overlay.classList.add(overlayBGClass);
    }
    togglePageScroll("hide-scroll");
    newOverlayState = "block";
  }

  overlay.style.display = newOverlayState;
};

overlay.addEventListener("click", toggleOverlay);

/*
 returns element height based on its width and its specified aspect-ratio
 => helpful to replace aspect-ratio css property as it doesn't work on Safari
*/
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

// holds all elements that have aspect ratio to keep track of them at resizing the page
const resizableElementWithAspectRatio = [];

/*
takes an imageObject:{ number , thumbnailLink , imgLink , imgText} as an argument, creates element for the image
and and adds it to the gallery section in the page
*/
function addImageToGallery(imageObject) {
  const galleryRow = document.querySelector("#gallery .container .row");

  const galleryCol = document.createElement("div");
  const imgContainer = document.createElement("div");
  const galleryImg = document.createElement("div");
  const galleryImgNumber = document.createElement("p");

  galleryCol.setAttribute("class", "col");
  imgContainer.setAttribute("class", "img-container");
  imgContainer.setAttribute("data-index", imageObject.index);

  imgContainer.addEventListener("click", (e) => {
    try {
      showGalleryImage(e.target.dataset.index);
    } catch (error) {
      try {
        showGalleryImage(e.target.parentElement.dataset.index);
      } catch (error) {
        try {
          showGalleryImage(
            e.explicitOriginalTarget.parentElement.dataset.index
          );
        } catch (error) {
          console.log(error);
        }
      }
    }
  });

  galleryImg.setAttribute("class", "gallery-img");
  galleryImgNumber.setAttribute("class", "gallery-img-number");

  galleryImg.style.backgroundImage = `url('${imageObject.thumbnailLink}')`;
  galleryImgNumber.innerText = imageObject.index + 1;

  galleryCol.appendChild(imgContainer);
  imgContainer.appendChild(galleryImg);
  imgContainer.appendChild(galleryImgNumber);

  galleryRow.appendChild(galleryCol);

  // specifying gallery images aspect-ratio if the browser doesn't support aspect-ratio css property
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

    // adding the image to resizableElementWithAspectRatio
    resizableElementWithAspectRatio.push(resizableElementObject);
  }
}

// holds the clicked gallery image container div
const clickedImageContainer = document.querySelector(
  "#clicked-image-container"
);
// at clicking on a gallery image, show it in a large size
const showGalleryImage = (imageIndex) => {
  const { imgLink, imgText } = galleryImages[imageIndex];
  clickedImageContainer.querySelector("img").setAttribute("src", imgLink);
  clickedImageContainer.querySelector("p").innerText = imgText;

  toggleOverlay({ isMenu: false });
  hamburgerMenuBTN.style.display = "none";
  clickedImageContainer.style.display = "block";
};

// at closing the large size container, hide every thing
const hideGalleryImage = () => {
  clickedImageContainer.style.display = "none";
  toggleOverlay({ isMenu: false });
  hamburgerMenuBTN.style.display = "block";
};

clickedImageContainer
  .querySelector("button#hide-large-img")
  .addEventListener("click", hideGalleryImage);

// adds all images from 'galleryImages' to gallery section
galleryImages.forEach((image, index) => {
  console.log(index);
  const imageObject = { index, ...image };
  addImageToGallery(imageObject);
});

// if no aspect-ratio support, then add event listener to window to update images height using getElementHeightByCalculatingAspectRatio()
if (!CSS.supports("aspect-ratio: 1")) {
  window.addEventListener("resize", () => {
    if (lastWidth !== getDocumentWidth()) {
      resizableElementWithAspectRatio.forEach((elementObject) => {
        elementObject[
          "element"
        ].style.height = `${getElementHeightByCalculatingAspectRatio(
          elementObject
        )}px`;
      });
    }
  });
}

// if images isn't 3,6,9,12... then add 'margin:auto' to the last row images
if (galleryImages.length % 3 !== 0) {
  console.log(galleryImages);
  const imagesTempVar = [
    ...document.querySelectorAll("#gallery .row .col:nth-of-type(3n-2)"),
  ];

  const lastImageContainer =
    imagesTempVar[imagesTempVar.length - 1].querySelector(".img-container");

  console.log(lastImageContainer);
  lastImageContainer.classList.add("m-auto");
}
