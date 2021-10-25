console.log = () => {}; // to hide all logs

// ------------------------ Clock Logic ------------------------ //

const clockSpan = document.querySelector("#clock");

// Checks if the hours/minutes number is one digit number
const isItOneDigitNumber = (number) => String(number).split("").length === 1;

// gets the new time and renders the minutes and hours
const updateTime = () => {
  const time = new Date();
  const hours = isItOneDigitNumber(time.getHours())
    ? `0${time.getHours()}`
    : time.getHours();
  const minutes = isItOneDigitNumber(time.getMinutes())
    ? `0${time.getMinutes()}`
    : time.getMinutes();

  clockSpan.innerText = `${hours}:${minutes}`;
};

// update time right after the document is loaded and every second
const updatingClockInterval = setInterval(updateTime, 1000);

if (clockSpan) updateTime();
else clearInterval(updatingClockInterval);

// ------------------------ Adding Icons Logic ------------------------ //

let lastClickedIcon;

async function fetchFile(url) {
  try {
    const request = await fetch(url);
    const code = await request.text();
    return code;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function fetchSVGs(linksArray) {
  const responseArray = await Promise.allSettled(
    linksArray.map((linkObject) => {
      return fetchFile(linkObject.iconLink);
    })
  );
  return responseArray;
}

// adds all icons from 'launcherIcons' to the launcher
fetchSVGs(launcherIcons)
  .then((responseArray) => {
    launcherIcons.forEach((icon, index) => {
      const iconObject = { response: responseArray[index], ...icon };
      addIconsToLauncher(iconObject);
    });
    console.log(responseArray);
  })
  .then(() => {
    pageData.isIconsLoaded = true;
    removeLoaderLayer();
  })
  .catch((err) => {
    console.log(err);
  });

/*
takes an iconObject:{ index , hrefValue , iconLink } as an argument, creates element for the icon
and and adds it to the gallery section in the page
*/
const iconsSection = document.querySelector("#launcher-inner-container > nav");

function addIconsToLauncher(iconObject) {
  const iconContainerAnchor = document.createElement("a");

  if (iconObject.hrefValue) {
    if (iconObject.response.status !== "fulfilled") {
      console.error(
        "An error happened while fetching: " + iconObject.hrefValue
      );
      return;
    }
  } else iconContainerAnchor.classList.add("disabled");

  const iconSVGCode = iconObject.response.value;
  iconContainerAnchor.innerHTML = iconSVGCode;

  iconContainerAnchor.querySelector("svg").removeAttribute("width");
  iconContainerAnchor.querySelector("svg").removeAttribute("height");

  iconContainerAnchor.addEventListener("click", (e) => {
    e.preventDefault();
    try {
      lastClickedIcon.classList.remove("selected");
    } catch (error) {}

    lastClickedIcon =
      e.target.tagName === "A" ? e.target : e.target.parentElement;
    lastClickedIcon.classList.add("selected");

    setTimeout(() => {
      // window.location.href = iconObject.hrefValue;
    }, 200);
  });

  iconsSection.appendChild(iconContainerAnchor);
}

// ------------------------ Aspect Ratio Logic ------------------------ //

// returns the current document width
function getDocumentHeight() {
  return (
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight
  );
}

// Holds the document width => helpful to be checked to maintain responsiveness
let lastHeight;
console.log(lastHeight);
/*
 returns element height based on its width and its specified aspect-ratio
 => helpful to replace aspect-ratio css property as it doesn't work on Safari
*/
function getElementWidthByCalculatingAspectRatio({ element, mainRatio }) {
  lastHeight = getDocumentHeight();
  // elementWidth;
  const elementHeight = parseFloat(
    window.getComputedStyle(element).getPropertyValue("height")
  );
  const elementWidth = elementHeight * mainRatio;

  console.log(elementWidth + " elementWidth");
  console.log(elementHeight + " elementHeight");

  return elementWidth;
}

const phoneMainElement = document.querySelector("main");

// if no aspect-ratio support, then add event listener to window to update mobile height using getElementWidthByCalculatingAspectRatio()
const setElementWidthBasedOnAspectRatio = () => {
  if (lastHeight !== getDocumentHeight()) {
    const newWidth = `${getElementWidthByCalculatingAspectRatio({
      element: phoneMainElement,
      mainRatio: 480 / 980,
    })}`;

    console.log(newWidth);

    // phoneMainElement.style.width = newWidth + 'px';
    phoneMainElement.style.setProperty("--new-width", newWidth + "px");
    console.log(phoneMainElement.style.getPropertyValue("--new-width"));
  }
};
// if (getDocumentHeight() > 500) {
setElementWidthBasedOnAspectRatio();
window.addEventListener("resize", setElementWidthBasedOnAspectRatio);
// }

// ------------------------ Loader Logic ------------------------ //

window.addEventListener("load", () => {
  console.log("loaded");

  const loadingLayer = document.querySelector("#loading-layer");
  const ofalyLogo = document.querySelector(
    "#launcher-inner-container #logo-bar img"
  );

  loadingLayer.querySelector("img").style.opacity = 0;
  loadingLayer.style.bottom = "110%";
  loadingLayer.style.top = "-110%";

  setTimeout(() => {
    ofalyLogo.style.margin = "0";
  }, 1500);

  setTimeout(() => {
    loadingLayer.style.display = "none";
  }, 2500);
});
