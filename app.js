// console.log = () => {}; // to hide all logs

// ------------------------ Updating Clock ------------------------ //

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

// ------------------------ Adding Icons ------------------------ //

let lastClickedIcon;
/*
takes an iconObject:{ index , hrefValue , iconLink } as an argument, creates element for the icon
and and adds it to the gallery section in the page
*/
function addIconsToLauncher(iconObject) {
  const iconsSection = document.querySelector(
    "#launcher-inner-container > nav"
  );

  const iconContainerAnchor = document.createElement("a");
  const iconImg = document.createElement("img");

  iconContainerAnchor.setAttribute("href", iconObject.hrefValue);

  const iconID = iconObject.hrefValue.split("/").pop() + "-logo";
  iconContainerAnchor.setAttribute("id", iconID);

  iconImg.setAttribute("src", iconObject.iconLink);
  iconImg.setAttribute("alt", `${iconID.toUpperCase()} service.`);

  iconContainerAnchor.addEventListener("click", (e) => {
    e.preventDefault();
    try {
      lastClickedIcon.classList.remove("selected");
    } catch (error) {}

    lastClickedIcon =
      e.target.tagName === "A" ? e.target : e.target.parentElement;
    lastClickedIcon.classList.add("selected");

    setTimeout(() => {
      // TODO uncomment the next line
      // window.location.href = iconObject.hrefValue;
    }, 200);
  });

  iconContainerAnchor.appendChild(iconImg);
  iconsSection.appendChild(iconContainerAnchor);
}

// adds all icons from 'launcherIcons' to the launcher
launcherIcons.forEach((icon, index) => {
  console.log(index);
  const iconObject = { index, ...icon };
  addIconsToLauncher(iconObject);
});

// ------------------------ Handling Aspect Ratio ------------------------ //

// returns the current document width
function getDocumentWidth() {
  return (
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth
  );
}

// Holds the document width => helpful to be checked to maintain responsiveness
let lastWidth;
console.log(lastWidth);
/*
 returns element height based on its width and its specified aspect-ratio
 => helpful to replace aspect-ratio css property as it doesn't work on Safari
*/
function getElementWidthByCalculatingAspectRatio({ element, mainRatio }) {
  lastWidth = getDocumentWidth();
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
  if (lastWidth !== getDocumentWidth()) {
    phoneMainElement.style.width = `${getElementWidthByCalculatingAspectRatio({
      element: phoneMainElement,
      mainRatio: 480 / 980,
    })}px`;
  }
};
if (!CSS.supports("aspect-ratio: 1") && getDocumentWidth() > 500) {
  setElementWidthBasedOnAspectRatio();
  window.addEventListener("resize", setElementWidthBasedOnAspectRatio);
}

window.addEventListener("load", () => {
  console.log("loaded");

  const x = document.querySelector("#layer");
  x.style.display = "none";
});
