<template>
  <div class="body">
    <div class="wordLogo">
      <img src="~/assets/skrunkleWord.png" alt="Skrunkle" />
    </div>
    <div class="small">
      <div class="box">
        <div class="namebox">
          <h3 class="enterName-namebox">Enter name</h3>
          <button class="generateName-namebox">Generate name</button>
        </div>
        <button class="joinButton-namebox">Join</button>
      </div>
      <div class="characterCircle">
        <div class="circle"></div>
        <img class="chicken" src="~/assets/chicken.png" alt="" />
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
}
.small {
  display: flex;
  justify-content: center;
}
.namebox {
  background-color: #fd551b;
  width: 50rem;
  border-radius: 35px;
  height: 30rem;
}
.circle {
  background-color: #fd551b;
  height: 30rem;
  width: 30rem;
  border-radius: 50%;
  position: relative;
}
.chicken {
  height: 30rem;
  position: absolute;
  top: 50%;
  right: 0;
}
</style>
