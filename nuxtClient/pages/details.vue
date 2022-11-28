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
            value="generatedNamePlaceholder5375"
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
    </div>
  </div>
</template>
<style>
* {
  overflow: hidden;
  padding: 0;
  margin: 0;
}
.wordLogo {
  text-align: center;
}
.body,
html {
  background-color: #feefdd;
  margin: auto;
  margin-top: 2rem;
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
.box1 {
  background-color: #fd551b;
  width: 100%;
  border-radius: 35px;
  height: 17rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.box2 {
  background-color: #fd551b;
  width: 100%;
  border-radius: 35px;
  height: 17rem;
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
}
.customizeButton {
  width: 83%;
  border-radius: 35px;
  height: 9rem;
  margin: auto;
  margin-bottom: 2rem;
  background-color: #feefdd;
}
.joinButton {
  width: 20rem;
  border-radius: 35px;
  height: 6rem;
  margin: auto;
  margin-bottom: 2rem;
  background-color: #fd551b;
}
.circle {
  background-color: #fd551b;
  height: 30rem;
  width: 30rem;
  border-radius: 50%;
  position: relative;
  margin-right: 8rem;
}
.chicken {
  height: 30rem;
  position: absolute;
  top: 40%;
  right: 20%;
}
/* The switch - the box around the slider */
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
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
