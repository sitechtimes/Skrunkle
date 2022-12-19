<template>
  <html lang="en">
    <body>
      <div class="container">
        <div class="container box1">
          <!-- <video id="background-video" autoplay loop muted>
            <source src="~/assets/treeBacco.mp4" type="video/mp4" />
          </video> -->
          <h1>SKRUNKLE</h1>
          <h2>Go getem</h2>
          <button>play now</button>
        </div>
        <div class="container box2">
          <h2>title</h2>
          <h3>
            Use tactical strategies to stay alive amidst all the generated
            obstacles. But, you'll need to think faster than your opponent if
            you want to survive. The game introduces new game play elements to
            realize the thrill and hardships of maintaining life in a hardcore
            world.
          </h3>
        </div>
      </div>
    </body>
  </html>
</template>
<style>
html,
body,
* {
  overflow: hidden;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
/* #background-video {
  height: 100vh;
  width: 100vw;
  object-fit: cover;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: -1;
} */
.container {
  text-align: center;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-image: url("assets/bac3.jpg");
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}
.box1 {
}
.box2 {
  background-image: url("assets/bac1.jpg");
  background-attachment: fixed;
  height: 1200px;
}
.box3 {
  background-image: url("assets/bac2.jpg");
}
.box4 {
  background-image: url("assets/pattern2.png");
}
</style>
