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
    <div class="small">
      <div class="characterCircle">
        <div class="circle"></div>
        <img class="chicken" src="~/assets/chicken.png" alt="" />
      </div>
      <div class="box">
        <label for="name">Enter name:</label>
        <div class="namebox">
          <input class="enterName-namebox" type="text" id="name" name="name" />
          <button class="generateName-namebox">
            <img src="~/assets/dice.png" alt="random generator" class="dice" />
          </button>
        </div>
        <button class="joinButton-namebox">Join</button>
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
.small {
  display: flex;
  justify-content: center;
  margin-top: 4rem;
}
.generateName-namebox {
  position: absolute;
  border-radius: 5px;
  right: 13rem;
  border: none;
  top: 35.5%;
  background-color: #fd551b;
}
.box {
  background-color: #fd551b;
  width: 50rem;
  border-radius: 35px;
  height: 20rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.namebox {
  display: flex;
  justify-content: center;
}
.dice {
  width: 3rem;
  padding-top: 0.3rem;
}
label {
  margin-top: 3rem;
  margin-left: 5rem;
}
.enterName-namebox {
  background-color: #feefdd;
  border-radius: 35px;
  width: 83%;
  height: 4rem;
  margin: auto;
  margin-bottom: 2rem;
}
.joinButton-namebox {
  width: 83%;
  border-radius: 35px;
  height: 9rem;
  margin: auto;
  margin-bottom: 3rem;
  background-color: #feefdd;
}
.circle {
  background-color: #fd551b;
  height: 35rem;
  width: 35rem;
  border-radius: 50%;
  position: relative;
  margin-right: 8rem;
}
.chicken {
  height: 30rem;
  position: absolute;
  top: 40%;
  right: 61%;
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
.wrap {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
</style>
