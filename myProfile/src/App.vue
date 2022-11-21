<template>
  <a-layout style="min-height: 100vh">
    <navLeft :isShow="isShow" @navChange="navChange"></navLeft>
<!--    动态组件-->
    <Transition name="back" mode="out-in">
      <keep-alive>
      <component :is="list[idx]" :key="list[idx]"></component>
      </keep-alive>
    </Transition>
  </a-layout>
</template>

<script>
import book from './components/book.vue'
import navLeft from './components/nav'
import homepage from "@/components/homepage";
import {ref} from "vue";
export default {
  name: 'App',
  components: {
    navLeft,
    book,
    homepage,
  },
  setup(){
    let isShow=ref('2')
    let idx=ref(0)
    function navChange(value){
      isShow.value=value
      idx.value=parseInt(value)
    }
    return{
      isShow,
      idx,
      navChange,
      list:['homepage','book']
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.back-enter-active,
.back-leave-active {
  transition: opacity 0.5s ease;
}

.back-enter-from,
.back-leave-to {
  opacity: 0;
}
</style>
