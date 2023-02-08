<template>
  <div class="customLoadingScreenDiv">
    <img alt="skrunkle logo" class="chicken" src="../assets/skrunkler.gif" />
    <div class="load"></div>
  </div>
</template>

<style>
* {
  overflow: hidden;
  padding: 0;
  margin: 0;
}
.customLoadingScreenDiv {
  width: 100vw;
  height: 100vh;
  background-color: #ffb238;
  z-index: 1000;
  position: absolute;
  top: 0;
  left: 0;
}
.hello {
  width: 100vw;
  height: 100vh;
  background-color: #ffb238;
  z-index: 1000;
  position: absolute;
  top: 0;
  left: 0;
}
.chicken {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 35%;
  height: auto;
  margin-bottom: 2rem;
  margin-top: 2rem;
}
.load {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 65rem;
  height: 3rem;
  background: linear-gradient(#fabc3c, #f55536);
  border: solid black 5px;
  box-shadow: 8px 10px black;
}

#debug {
  position: absolute;
  color: green;
  font-size: larger;
  top: 0;
  left: 0;
  z-index: 999;
}
</style>
