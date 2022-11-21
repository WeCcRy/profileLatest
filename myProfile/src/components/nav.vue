<template>
  <a-layout-sider v-model:collapsed="collapsed" collapsible>
    <div class="logo">
      <span>wy</span>
    </div>
    <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline" class="menu" @click="menuChange">
      <a-menu-item key="0">
        <user-outlined />
        <span>个人信息</span>
      </a-menu-item>
      <a-menu-item key="1">
        <book-outlined />
        <span>阅读报告</span>
      </a-menu-item>
    </a-menu>
  </a-layout-sider>
</template>

<script>
import { UserOutlined,BookOutlined,TeamOutlined } from '@ant-design/icons-vue';
import { defineComponent, ref } from 'vue';
export default defineComponent({
  props:{
    isShow:String,
  },
  emits: ['navChange'],
  components: {
    UserOutlined,
    BookOutlined,
  },
  setup(prop,context) {
    let collapsed=ref(true)
    // 通过selectKeys来控制显示哪个组件,0为主页,1为表格
    let selectedKeys= ref(['0'])
    //将组件内的选择信息传回app
    function menuChange(target){
      context.emit('navChange',target.key)
    }
    return {
      collapsed,
      selectedKeys,
      menuChange,
    };
  },

});
</script>
<style scoped>
.logo {
  height: 36px;
  margin: 16px;
}
.logo span{
  font-family: fantasy;
  font-size: 12px;
  line-height: 36px;
  text-align: center;
  color: white;
}
</style>
