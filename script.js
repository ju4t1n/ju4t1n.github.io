const demonstration = document.getElementById("smart-city-video");

if (demonstration) {
  const speedButtons = document.querySelectorAll(".speed-control [data-rate]");

  speedButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const rate = Number(button.dataset.rate);
      demonstration.playbackRate = rate;

      speedButtons.forEach((option) => {
        option.setAttribute("aria-pressed", String(option === button));
      });
    });
  });
}
