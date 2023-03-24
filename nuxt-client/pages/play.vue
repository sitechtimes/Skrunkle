<template>
  <div>
    <LoadingBar class="loading" :percent="percent" :loadtext="loadtext"/>
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

    <div id="chatIcon">
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
  data() {
    return {
      chatMessage: undefined,
      world: undefined,
      percent: 0,
      loadtext: "Loading..."
    };
  },
  mounted() {
    const canvas = this.$refs.renderCanvas;
    const world = new World(<HTMLCanvasElement>canvas, this.$config.public, this.update_loading);
    world.init();
    this.world = world;
  },
  methods: {
    sendChat() {
      let chat = this.world.chat;
      console.log("register send")
      chat.sendMessage(this.chatMessage);
      this.chatMessage = undefined;
    },
    update_loading(loaded, total, message){

      if (message == "server"){
        this.percent = 0
        this.loadtext = "Fetching Server"
      } else if (message == "meshes"){
        this.percent = loaded/total
        this.loadtext = `Creating Meshes (${loaded}/${total})`
      }

    }
  },
};
</script>

<style>
* {
  overflow: hidden;
  padding: 0;
  margin: 0;
}
canvas{
  z-index: 0;
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
