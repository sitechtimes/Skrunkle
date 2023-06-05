<template>
  <div class="outer">
    <LoadingBar class="loading" :percent="percent" :loadtext="loadtext" ref="load"/>
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

    <canvas
      id="renderCanvas"
      ref="renderCanvas"
    ></canvas>
  </div>
</template>

<script lang="ts">
import { World } from "../src/world/world";

export default {
  data() {
    return {
      chatMessage: undefined,
      world: undefined,
      percent: 0,
      loadtext: "Loading...",
      vr: false
    };
  },
  mounted() { 
    
    const canvas = this.$refs.renderCanvas;
    const world = new World(<HTMLCanvasElement>canvas, this.$config.public, this.update_loading);
    this.world = world;

    window.addEventListener("resize", this.resize)
    window.addEventListener("click", ()=>{canvas.requestFullscreen()}, {once: true})
  },
  methods: {
    resize(){
      this.world.resize()
    },
    sendChat() {
      let chat = this.world.chat;
      console.log("register send")
      chat.sendMessage(this.chatMessage);
      this.chatMessage = undefined;
    },
    update_loading(loaded, total, message){
      console.log(message)
      if (message == "server"){
        this.percent = 0
        this.loadtext = "Fetching Server"
      } else if (message == "meshes"){
        this.percent = loaded/total
        this.loadtext = `Creating Meshes (${loaded}/${total})`
      }

      if (this.percent == 1) {
        this.vr = this.world.vr
        if (!this.vr) this.play()
      }

    },
    play(){
      this.$refs['load'].load()
      if (this.vr) this.world.enterVR()
    }
  },
};
</script>

<style>

.outer{
  display: flex;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
}

.play{
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
canvas{
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

</style>
