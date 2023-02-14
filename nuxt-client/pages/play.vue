<template>
  <div>
    <div class="customLoadingScreenDiv">
      <img class="chicken" src="/skrunkler.gif" alt="logo" />
      <div class="load"></div>
    </div>

    <div id="debug">
      <p id="name"></p>
      <p id="id"></p>
      <p id="pcount"></p>
      <p id="x"></p>
      <p id="y"></p>
      <p id="z"></p>
      <p id="PickupItem"></p>
      <p id="PickedupItem"></p>
    </div>

    <div id="chat" class="hidden">
      <section class="message-history">
        <ul id="chat-ul">
          <li>TEST</li>
        </ul>
      </section>
      <form class="message-bar" id="chat-send">
        <input type="text" id="chat-box" required>
        <button>Send</button>
      </form>
    </div>

    <canvas
      id="renderCanvas"
      ref="renderCanvas"
      height="1080"
      width="1920"
    ></canvas>
  </div>
</template>

<script lang="ts">
import { World } from "../src/world/world";
export default {
  mounted() {
    const canvas = this.$refs.renderCanvas;
    const world = new World(<HTMLCanvasElement>canvas);
    world.init();
  },
};
</script>

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
  display: none;
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
#chat {
  background-color: rgba(245, 85, 54, 0.2);
  display: flex;
  height: 500px;
  width: 500px;
  z-index: 100;
  position: absolute;
  right: 0;
}
#chat:focus-within {
  background-color: rgba(245, 85, 54, 0.7);
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
