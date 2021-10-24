// console.log = () => {}; // to hide all logs

// ------------------- General Purpose Functions ------------------- //

// returns the current document width
function getDocumentWidth() {
  return (
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth
  );
}

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
updateTime();
setInterval(updateTime, 1000);

// ------------------------ Adding Icons ------------------------ //

// Holds the document width => helpful to be checked to maintain responsiveness
let lastWidth;

// /*
//  returns element height based on its width and its specified aspect-ratio
//  => helpful to replace aspect-ratio css property as it doesn't work on Safari
// */
// function getElementHeightByCalculatingAspectRatio({ element, mainRatio }) {
//   lastWidth = getDocumentWidth();

//   const elementWidth = parseFloat(
//     window.getComputedStyle(element).getPropertyValue("width")
//   );
//   const elementHeight = elementWidth * (1 / mainRatio);

//   console.log(elementWidth);
//   console.log(elementHeight);

//   return elementHeight;
// }

let lastClickedIcon;
// const iconsContainersObjects = [];
/*
takes an iconObject:{ index , hrefValue , iconLink } as an argument, creates element for the icon
and and adds it to the gallery section in the page
*/
function addIconsToLauncher(iconObject) {
  const iconsSection = document.querySelector(
    "#launcher-inner-container > section"
  );

  const iconContainerAnchor = document.createElement("a");
  const iconImg = document.createElement("img");

  iconContainerAnchor.setAttribute("href", iconObject.hrefValue);

  const iconID = iconObject.hrefValue.split("/").pop() + "-logo";
  iconContainerAnchor.setAttribute("id", iconID);

  iconImg.setAttribute("src", iconObject.iconLink);

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

  // // specifying launcher icons aspect-ratio
  // if (!CSS.supports("aspect-ratio: 1")) {
  //   console.log("no aspect-ratio support");
  //   const elementObject = {
  //     element: iconContainerAnchor,
  //     mainRatio: 1,
  //   };
  //   iconContainerAnchor.style.height = `${getElementHeightByCalculatingAspectRatio(
  //     elementObject
  //   )}px`;
  // iconsContainersObjects.push(elementObject);
  // }
}

// adds all icons from 'launcherIcons' to the launcher
launcherIcons.forEach((icon, index) => {
  console.log(index);
  const iconObject = { index, ...icon };
  addIconsToLauncher(iconObject);
});

// // if icons isn't 3,6,9,12... then add 'margin:auto' to the last row icons
// if (launcherIcons.length % 3 !== 0) {
//   console.log(launcherIcons);
//   const iconsTempVar = [
//     ...document.querySelectorAll("#launcher .row .col:nth-of-type(3n-2)"),
//   ];

//   const lastIconContainer =
//     iconsTempVar[iconsTempVar.length - 1].querySelector(".icon-container");

//   console.log(lastIconContainer);
//   lastIconContainer.classList.add("m-auto");
// }

// // if no aspect-ratio support, then add event listener to window to update icons height using getElementHeightByCalculatingAspectRatio()
// if (!CSS.supports("aspect-ratio: 1")) {
//   window.addEventListener("resize", () => {
//     if (lastWidth !== getDocumentWidth()) {
//       iconsContainersObjects.forEach((elementObject) => {
//         elementObject[
//           "element"
//         ].style.height = `${getElementHeightByCalculatingAspectRatio(
//           elementObject
//         )}px`;
//       });
//     }
//   });
// }
