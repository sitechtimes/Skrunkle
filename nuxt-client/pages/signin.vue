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
                <button type="submit" class="button is-dark is-fullwidth">
                  Log In
                </button>
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
* {
  overflow: hidden;
  padding: 0;
  margin: 0;
}
.title {
  font-size: 4rem;
}
.noBaccoImg {
  animation: moveSlideshow 12s linear infinite;
}
@keyframes moveSlideshow {
  0% {
    transform: translateX(-15%);
  }
  100% {
    transform: translateX(105%);
  }
}
.section {
  display: flex;
  justify-content: center;
  margin-top: 5%;
}
form {
  margin: 1rem 1rem 0rem 1rem;
}
p {
  margin-left: 1rem;
}
.input {
  width: 20rem;
  height: 1.5rem;
}
button {
  margin-top: 1rem;
}
</style>
