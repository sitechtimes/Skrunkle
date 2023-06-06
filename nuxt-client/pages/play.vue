<template>
  <div class="outer">
    <LoadingBar
      class="loading"
      :percent="percent"
      :loadtext="loadtext"
      ref="load"
    />
    <button v-if="vr" class="play" @click="play()">Enter VR Mode</button>
    <div id="debug">
      <p id="name"></p>
      <p id="id"></p>
      <p id="pcount"></p>
      <p id="x"></p>
      <p id="y"></p>
      <p id="z"></p>
      <p id="PickupItem"></p>
      <p id="PickedupItem"></p>
      <p id="vr"></p>
      <div class="instructionPopup" v-if="showPopup">
        <h1>Welcome to Skrunkle!</h1>
        <p>Instructions:</p>
        <ul>
          <li>Move with "W" "A" "S" "D"</li>
          <li>Collect 10 Whalen sheeps 🐑</li>
          <li>Beat the clock!⏰</li>
        </ul>
        <button class="button-54" role="button" @click="startGame">
          Start Game
        </button>
      </div>
      <div class="winPopup" v-if="showPopup2">
        <h1>You won!</h1>
        <p>Great job collecting</p>
        <button class="button-54" role="button" @click="startGame">
          Play again
        </button>
      </div>
    </div>

    <!-- <div id="chatIcon">
      <img src="~/assets/chat.png" alt="" class="chatIcon" />
    </div>

    <div id="chat" class="hidden">
      <section class="message-history">
        <ul id="chat-ul">
          <li>TEST</li>
        </ul>
      </section>
      <form @submit.prevent="sendChat" class="message-bar">
        <input type="text" id="chat-box" v-model="chatMessage" required />
        <button id="chat-send">Send</button>
      </form>
    </div> -->

    <canvas id="renderCanvas" ref="renderCanvas"></canvas>
  </div>
</template>

<script lang="ts">
import { World } from "../src/world/world";

export default {
  data() {
    return {
      world: undefined,
      percent: 0,
      loadtext: "Loading...",
      vr: false,
      showPopup: false,
      showPopup2: true,
    };
  },
  mounted() {
    const canvas = this.$refs.renderCanvas;
    const world = new World(
      <HTMLCanvasElement>canvas,
      this.$config.public,
      this.update_loading
    );
    this.world = world;

    window.addEventListener("resize", this.resize);
    window.addEventListener(
      "click",
      () => {
        canvas.requestFullscreen();
      },
      { once: true }
    );
  },
  methods: {
    resize() {
      this.world.resize();
    },
    startGame() {
      this.showPopup = false;
    },
    update_loading(loaded, total, message) {
      if (message == "server") {
        this.percent = 0;
        this.loadtext = "Fetching Server";
      } else if (message == "meshes") {
        this.percent = loaded / total;
        this.loadtext = `Creating Meshes (${loaded}/${total})`;
      }

      if (this.percent == 1) {
        this.vr = this.world.vr;
        if (!this.vr) this.play();
        this.showPopup = true;
      }
    },
    play() {
      this.$refs["load"].load();
      if (this.vr) this.world.enterVR();
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Titan+One&display=swap");
.outer {
  display: flex;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
}

.play {
  z-index: 1000;
  width: 20rem;
  height: 5rem;
  border-radius: 15px;
}

* {
  overflow: hidden;
  padding: 0;
  margin: 0;
}
canvas {
  z-index: 0;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.customLoadingScreenDiv {
  width: 100vw;
  height: 100vh;
  background-color: #ffb238;
  z-index: 800;
  position: absolute;
  top: 0;
  left: 0;
  display: none;
}

#chat {
  background-color: rgba(245, 85, 54, 0.2);
  display: flex;
  height: 500px;
  width: 500px;
  z-index: 0;
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

.chatIcon {
  background-color: white;
  display: flex;
  height: 70px;
  width: 70px;
  z-index: 100;
  position: absolute;
  right: 0;
  padding: 1rem;
  border-radius: 4rem;
}
.instructionPopup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: orange;
  color: black;
  font-family: "Titan One", cursive;
  box-shadow: 0 10px 10px rgba(33, 29, 29, 0.3);
  text-align: center;
  padding: 2rem;
  border-radius: 2rem;
  border: solid white 0.2rem;
}
h1 {
  margin-bottom: 1rem;
}
ul {
  margin-bottom: 1rem;
}

.button-54 {
  font-size: 16px;
  letter-spacing: 2px;
  text-decoration: none;
  text-transform: uppercase;
  color: #000;
  cursor: pointer;
  border: 3px solid;
  padding: 0.25em 0.5em;
  box-shadow: 1px 1px 0px 0px, 2px 2px 0px 0px, 3px 3px 0px 0px, 4px 4px 0px 0px,
    5px 5px 0px 0px;
  position: relative;
  touch-action: manipulation;
  margin-top: 0.7rem;
}

.button-54:active {
  box-shadow: 0px 0px 0px 0px;
  top: 5px;
  left: 5px;
}

@media (min-width: 768px) {
  .button-54 {
    padding: 0.25em 0.75em;
  }
}
</style>
