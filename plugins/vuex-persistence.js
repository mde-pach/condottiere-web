import VuexPersistence from 'vuex-persist'
 
export default ({ store }) => {
  window.onNuxtReady(() => {
    new VuexPersistence({
    	key: 'my-app',
 			storage: window.localStorage
    }).plugin(store);
  });
}
