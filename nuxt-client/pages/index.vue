<template>
  <div class="customLoadingScreenDiv">
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" cross origin />
    <link
      href="https://fonts.googleapis.com/css2?family=Bungee+Shade&display=swap"
      rel="stylesheet"
    />
    <h1 class="title">Skrunkle</h1>
    <img class="chicken-img" src="../assets/chicken2.png" alt="chicken" />
    <div class="load">
      <div class="inside-bar"></div>
      <h2 class="loading-percent">10%</h2>
    </div>
  </div>
</template>

<style>
.title {
  font-family: "Bungee Shade", cursive;
  font-size: 150px;
  text-align: center;
}

* {
  /* overflow: hidden; */
  padding: 0;
  margin: 0;
}
.customLoadingScreenDiv {
  width: 100vw;
  height: 100vh;
  background-image: linear-gradient(to bottom, #ff7e00, #fae6d2);
  z-index: 1000;
  position: absolute;
  top: 0;
  left: 0;
}
.chicken-img {
  width: 100px;
  margin-left: 26%;
  margin-top: ;
}

.loading-percent {
  font-family: "Bungee Shade", cursive;
  font-size: 40px;
}

.inside-bar {
  width: 10%;
  height: 100%;
  background-color: orange;
}

.load {
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 10px;
  width: 60rem;
  height: 3rem;
  background: (#ff7b00);
  border: solid black 4px;
  border-radius: 25px;
  box-shadow: 4px 5px black;
}

#debug {
  position: absolute;
  color: green;
  font-size: larger;
  top: 0;
  left: 0;
  z-index: 999;
}
/* .hello {
  width: 100vw;
  height: 100vh;
  background-color: #ffb238;
  z-index: 1000;
  position: absolute;
  top: 0;
  left: 0;
} */
/* .chicken {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 35%;
  height: auto;
  margin-bottom: 2rem;
  margin-top: 2rem;
} */
</style>
