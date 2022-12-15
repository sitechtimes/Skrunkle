<template>
  <html lang="en">
    <body>
      <div class="box1">
        <video
          id="background-video"
          autoplay
          loop
          muted
          poster="https://assets.codepen.io/6093409/river.jpg"
        >
          <source
            src="https://assets.codepen.io/6093409/river.mp4"
            type="video/mp4"
          />
        </video>
        <h1>SKRUNKLE</h1>
      </div>
      <div class="box2"></div>
      <div class="box3"></div>
      <div class="box4"></div>
      <div class="box5"></div>
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
  font-family: "Titan One", cursive;
  box-sizing: border-box;
}
#background-video {
  height: 100vh;
  width: 100vw;
  object-fit: cover;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: -1;
}
</style>
