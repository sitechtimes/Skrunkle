<template>
  <div>
    <section class="section">
      <div class="container">
        <div class="columns">
          <div class="columnn-mini">
            <h2 class="title has-text-cen`tered">Welcome back!</h2>

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
      <div class="noBaccoImg">
        <img src="../assets/chickennobg.gif" alt="" />
      </div>
    </section>
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
.noBaccoImg {
}
.section {
  display: flex;
  justify-content: center;
  margin-top: 10%;
}
.input {
  width: 20rem;
  height: 1.5rem;
}
button {
  margin-top: 1rem;
}
</style>
