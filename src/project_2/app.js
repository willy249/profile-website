import "./styles/style.css";

let i = 0;
let imgArr = [
  require("./images/日本櫻花.jpg"),
  require("./images/京都古城.jpg"),
  require("./images/大阪街頭.jpg"),
];

let changeImg = () => {
  let topBackground = document.querySelector("section.background-img");

  // 檢查是否超出陣列範圍，若超出則歸零
  if (i >= imgArr.length - 1) {
    i = 0;
  } else {
    i++;
  }

  topBackground.style.backgroundImage = `url(${imgArr[i]})`;
};

setInterval(changeImg, 5000);
