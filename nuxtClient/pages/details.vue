<template>
  <div class="body">
    <div class="wordLogo">
      <img src="~/assets/skrunkleWord.png" alt="Skrunkle" />
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
</style>
