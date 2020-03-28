import Vue from 'vue'
import VueNativeSock from 'vue-native-websocket'

Vue.use(VueNativeSock, 'ws://127.0.0.1:8000/ws')