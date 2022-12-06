<template>
  <div class="body">
    <div class="wrap">
      <div class="wordLogo">
        <img src="~/assets/skrunkleWord.png" alt="Skrunkle" />
      </div>
      <label class="switch">
        <input type="checkbox" />
        <span class="slider round"></span>
      </label>
    </div>

    <div class="main">
      <div class="main-left">
        <div class="box1">
          <input
            class="enterName"
            type="text"
            value="Placeholder5375"
            id="name"
            name="name"
          />
          <button class="customizeButton">Customize</button>
        </div>
        <div class="box2"></div>
      </div>

      <div class="main-middle">
        <div class="characterCircle">
          <div class="circle"></div>
          <img class="chicken" src="~/assets/chicken.png" alt="" />
        </div>
        <button class="joinButton">Join</button>
      </div>
      <div class="main-right">
        <div class="box3"></div>
      </div>
    </div>
  </div>
</template>
<style>
@import url("https://fonts.googleapis.com/css2?family=Titan+One&display=swap");
* {
  overflow: hidden;
  padding: 0;
  margin: 0;
  font-family: "Titan One", cursive;
}
.wordLogo {
  margin-top: 3rem;
  text-align: center;
}
body {
  background-image: url("assets/pattern.png");
  background-size: 130vw;
  animation: animatedBackground 30s infinite linear alternate-reverse;
}
@keyframes animatedBackground {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 100% 0; /* The image width */
  }
}
.theme-light {
  --color-primary: #feefdd;
  --color-secondary: #000000;
  --color-accent: #fd551b;
  --font-color: #000000;
}
.theme-dark {
  --color-primary: #feefdd;
  --color-secondary: #fce762;
  --color-accent: #fd551b;
  --font-color: #000000;
}
.main {
  display: flex;
  justify-content: center;
  margin-top: 4rem;
}
.main-left {
  width: 25%;
  margin-left: 5rem;
  margin-right: 15rem;
}
.main-middle {
  width: 40%;
  margin-right: 15rem;
}
.main-right {
  width: 25%;
  margin-right: 5rem;
}
.box1 {
  background-color: #fd551b;
  width: 100%;
  border-radius: 35px;
  height: 35%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 1rem;
}
.box2 {
  background-color: #fd551b;
  width: 100%;
  border-radius: 35px;
  height: 62%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.box3 {
  background-color: #fd551b;
  width: 100%;
  border-radius: 35px;
  height: 65%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.enterName {
  background-color: #feefdd;
  border-radius: 35px;
  width: 83%;
  height: 3rem;
  margin: auto;
  margin-top: 1rem;
  font-size: 1.5rem;
}
.customizeButton {
  width: 83%;
  border-radius: 35px;
  height: 6rem;
  margin: auto;
  background-color: #feefdd;
  margin-bottom: 1rem;
  font-size: 2.5rem;
}
.joinButton {
  width: 20rem;
  border-radius: 35px;
  height: 6rem;
  margin: 2rem;
  margin-bottom: 0rem;
  margin-left: 5rem;
  background-color: #fd551b;
  font-size: 3rem;
}
.circle {
  background-color: #fd551b;
  height: 32rem;
  width: 32rem;
  border-radius: 50%;
  position: relative;
  margin-right: 8rem;
}
.chicken {
  height: 30rem;
  position: absolute;
  top: 35%;
  right: 38%;
}
/* The switch - the box around the slider */
.switch {
  position: absolute;
  display: inline-block;
  width: 60px;
  height: 34px;
  top: 7%;
  left: 90%;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: black;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #fd551b;
}

input:focus + .slider {
  box-shadow: 0 0 1px #fd551b;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
  margin-right: 0;
  position: absolute;
  left: 0;
}

.slider.round:before {
  border-radius: 50%;
}
.wordLogo {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.wrap {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
</style>
