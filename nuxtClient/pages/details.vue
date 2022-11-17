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
        <div class="namebox">
          <h3 class="enterName-namebox">
            Enter name
            <button class="generateName-namebox">Gen</button>
          </h3>
          <button class="joinButton-namebox">Join</button>
        </div>
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
.namebox {
  background-color: #fd551b;
  width: 50rem;
  border-radius: 35px;
  height: 20rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.enterName-namebox {
  background-color: #feefdd;
  border-radius: 35px;
  width: 85%;
}
.joinButton-namebox {
  width: 85%;
  border-radius: 35px;
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
