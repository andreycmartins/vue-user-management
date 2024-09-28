<template>
  <v-card style="z-index: 999;">
    <v-layout>
      <v-navigation-drawer
        v-model="drawer"
        permanent
        :rail="rail"
        @click="rail = false"
      >
        <v-list-item
          nav
          prepend-avatar="https://avatars.githubusercontent.com/u/37137569?v=4"
          title="Andrey Martins"
        >
          <template #append>
            <v-btn
              icon="mdi-chevron-left"
              variant="text"
              @click.stop="rail = !rail"
            />
          </template>
        </v-list-item>

        <v-divider />

        <v-list density="compact" nav>
          <v-list-item prepend-icon="mdi-home-city" title="Home" to="/" value="home" />
          <v-list-item prepend-icon="mdi-cog" title="Settings" to="/settings" value="settings" />
        </v-list>
      </v-navigation-drawer>
    </v-layout>
  </v-card>
</template>
  <script>

  export default {
    data () {
      return {
        drawer: true,
        rail: true,
      }
    },
  }
  </script>
