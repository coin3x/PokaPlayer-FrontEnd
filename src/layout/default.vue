<template>
  <div>
    <portal-target name="app-bar" slim>
      <v-app-bar
        color="#FFF"
        app
        clipped-left
        :style="`box-shadow: 0px 0px 0px 1px ${$vuetify.theme.isDark ? 'rgba(255, 255, 255, 0.12)' : `rgb(0 0 0 / 20%)`}`"
      >
        <v-btn @click.stop="drawer = !drawer" v-if="!$vuetify.breakpoint.mdAndUp" icon> <v-icon class="bx">bx-menu</v-icon></v-btn>
        <router-link to="/" class="poka-logo" v-if="!showSeachBar || $vuetify.breakpoint.mdAndUp">
          <h1>PokaPlayer</h1>
        </router-link>
        <v-spacer />
        <poka-searchbar v-model="showSeachBar" />
        <menu-btn />
      </v-app-bar>
    </portal-target>
    <v-navigation-drawer app v-model="drawer" :mini-variant="$vuetify.breakpoint.mdAndUp" clipped :permanent="$vuetify.breakpoint.mdAndUp">
      <v-app-bar color="#FFF" :style="`box-shadow: 0px 0px 0px 1px rgba(255, 255, 255, 0.12)`" v-if="!$vuetify.breakpoint.mdAndUp">
        <v-btn @click.stop="drawer = !drawer" icon> <v-icon class="bx">bx-x</v-icon></v-btn>
        <router-link to="/" class="ml-2 poka-logo" v-if="!showSeachBar || $vuetify.breakpoint.mdAndUp">
          <h1>PokaPlayer</h1>
        </router-link>
        <v-spacer />
      </v-app-bar>
      <v-list dense nav v-if="$vuetify.breakpoint.mdAndUp">
        <v-tooltip right v-for="item in items" :key="item.text">
          <template v-slot:activator="{ on, attrs }">
            <v-list-item :to="item.to" link v-bind="attrs" v-on="on">
              <v-list-item-icon>
                <v-icon class="bx">{{ item.icon }} </v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>{{ $t(item.text) }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
          <span>{{ $t(item.text) }}</span>
        </v-tooltip>
      </v-list>
      <v-list dense nav v-else>
        <v-list-item v-for="item in items" :key="item.text" :to="item.to" link>
          <v-list-item-icon>
            <v-icon class="bx">{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ $t(item.text) }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <div class="router-view">
        <router-view />
      </div>
      <div style="height: 69px"></div>
    </v-main>
    <buttom-player />
  </div>
</template>
<script>
export default {
  name: 'App',
  data() {
    return {
      scrollPositions: {},
      settings: { darkMode: window._setting('darkMode') },
      showSeachBar: false,
      drawer: this.$vuetify.breakpoint.mdAndUp,
      items: [
        { icon: 'bx-library', text: 'library', to: '/library' },
        //{ icon: 'search', text: 'search', to: '/search' },
        { icon: 'bx-album', text: 'album', to: '/album' },
        { icon: 'bx-folder', text: 'folder', to: '/folder' },
        { icon: 'bx-microphone', text: 'artist', to: '/artist' },
        { icon: 'bx-pencil', text: 'composer', to: '/composer' },
        { icon: 'bxs-playlist', text: 'playlist', to: '/playlist' }
      ]
    }
  },
  created() {
    function vhResize() {
      let vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }
    window.addEventListener('resize', vhResize)
    vhResize()
    this.$router.beforeEach((to, from, next) => {
      let el = document.querySelector('main')
      if (el) this.scrollPositions[from.name] = el.scrollTop
      next()
      this.$nextTick(() => {
        let currentRouteName = this.$router.history.current.name
        if (el && currentRouteName in this.scrollPositions) {
          let positions = this.scrollPositions[currentRouteName]
          setTimeout(() => (el.scrollTop = positions), 100)
        }
      })
    })
    this.axios.defaults.withCredentials = true
    this.axios.defaults.baseURL = _setting(`server`)
    this.getStatus()
    //login socket
    _socket.emit('login', {
      username: window._setting(`username`),
      password: window._setting(`password`)
    })
    _socket.emit('send-nickname', _setting('nickname'))
  },
  methods: {
    switchTheme() {
      this.settings.darkMode = !this.settings.darkMode
      window._setting('darkMode', this.settings.darkMode)
      this.settings.darkMode ? window._theme.switchToDark() : window._theme.switchToLight()
    },
    async getStatus() {
      // getStatus
      let response = await this.axios.get(_setting(`server`) + '/status/')
      // 沒登入滾回登入頁面
      if (!response.data.login) return this.$router.push('/login')
      // 標記為已登入
      let userProfile = await this.axios.get(_setting(`server`) + '/pokaapi/v2/user/')
      sessionStorage.setItem('login', JSON.stringify(userProfile.data))
      // sync settings
      let settings = JSON.parse(userProfile.data.settings)
      for (let i of Object.keys(settings)) {
        _setting(i, settings[i])
      }
    }
  }
}
</script>
<style lang="sass" scoped>
main
  height: calc(var(--vh,1vh) * 100)
  overflow: hidden
  overflow-y: scroll
  margin-bottom: -64px
.poka-logo
  font-family: var(--product-font)
  text-decoration: none
  color: var(--text-color)
  h1
    font-size: 24px
    line-height: 56px

nav
  .poka.list
    .item,.item.active:before
      border-radius: 0
.router-view
  min-height: calc(100% - 69px)
  padding: 16px

.v-app-bar
  box-shadow: inset 0 -1px 0 0 #dadce0
@media (prefers-color-scheme: dark)
  .v-app-bar
    box-shadow: inset 0 -1px 0 0 hsla(0,0%,100%,.12)
</style>
