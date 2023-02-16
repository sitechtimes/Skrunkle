<template>
  <div>
    <section class="section">
      <div class="container">
        <div class="columns">
          <div class="columnn-mini">
            <h2 class="title">Welcome back!</h2>

            <Notification :message="error" v-if="error" />

            <form method="post" @submit.prevent="login">
              <div class="field">
                <label class="label">Email</label>

                <div class="control">
                  <input
                    type="email"
                    class="input"
                    name="email"
                    v-model="email"
                  />
                </div>
              </div>

              <div class="field">
                <label class="label">Password</label>

                <div class="control">
                  <input
                    type="password"
                    class="input"
                    name="password"
                    v-model="password"
                  />
                </div>
              </div>

              <div class="control">
                <button type="submit" class="buttonSubmit">Log In</button>
              </div>
            </form>

            <div class="has-text-centered" style="margin-top: 20px">
              <p>
                Don't have an account?
                <nuxt-link to="/register">Register</nuxt-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <div>
      <img class="noBaccoImg" src="../assets/chickennobg.gif" alt="" />
    </div>
  </div>
</template>
<script setup>
onMounted(async () => {
  console.log(await $fetch("/api/users"));
});
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Titan+One&display=swap");
* {
  overflow: hidden;
  padding: 0;
  margin: 0;
  font-family: "Titan One", cursive;
  box-sizing: border-box;
}
.title {
  font-size: 4rem;
}
.noBaccoImg {
  animation: moveSlideshow 12s linear infinite;
}
@keyframes moveSlideshow {
  0% {
    transform: translateX(-50%);
  }
  100% {
    transform: translateX(290%);
  }
}
.section {
  display: flex;
  justify-content: center;
  padding: 3%;
  background-image: linear-gradient(
    0deg,
    hsl(0deg 0% 100%) 0%,
    hsl(32deg 100% 95%) 11%,
    hsl(32deg 100% 90%) 22%,
    hsl(32deg 100% 86%) 33%,
    hsl(32deg 100% 81%) 44%,
    hsl(32deg 100% 76%) 56%,
    hsl(32deg 100% 71%) 67%,
    hsl(33deg 100% 66%) 78%,
    hsl(33deg 100% 61%) 89%,
    hsl(35deg 99% 53%) 100%
  );
}
.container {
  background-color: white;
  border-radius: 35px;
  padding: 3rem;
  border: solid white 5px;
}
.buttonSubmit {
  border: solid #fff2d8 5px;
  width: 20rem;
  border-radius: 35px;
  height: 4rem;
  background-color: #f1b441;
  font-size: 2rem;
}
form {
  padding: 1rem 0rem 0rem 6rem;
}
p {
  margin-left: 1rem;
}
input {
  background-color: #feefdd;
  border-radius: 35px;
}
.input {
  width: 20rem;
  height: 3rem;
}
button {
  margin-top: 1rem;
}
</style>
