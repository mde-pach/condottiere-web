<template>
  <div>
    <side-menu />
    <div class="container column is-10">
      <nuxt />
    </div>
  </div>
</template>

<script>
import 'material-icons/iconfont/material-icons.css'
import SideMenu from '~/components/SideMenu'

export default {
  components: {
    SideMenu
  },
  data () {
    return {
      items: [
        {
          title: 'Home',
          icon: 'home',
          to: { name: 'index' }
        },
        {
          title: 'Inspire',
          icon: 'lightbulb',
          to: { name: 'inspire' }
        }
      ]
    }
  }
}
</script>

<style>
.container {
  margin: 0 2vw;
  width: 100% !important;
  max-width: unset !important;
}

.column {
  padding: 0 0.75rem;
}

.modal {
  z-index: 9999;
}

.vs-notifications {
  z-index: 1000000 !important;
}
</style>