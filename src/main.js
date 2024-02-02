import "./styles/style.css";
import "./styles/bubble.css";

$(function () {
  $(window).on("scroll", function () {
    if ($(window).scrollTop() === 0) {
      $("nav").css("box-shadow", "none");
    } else {
      $("nav").css("box-shadow", "0 10px 6px -6px #777");
    }
  });
});
