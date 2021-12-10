<template>
 
  <el-container  class='home-container'>
  <el-header>
    <div>
      <img src="../assets/heima.png" alt="">
      <span>电商管理</span>
    </div>
    <el-button type='info' @click='logout'>退出</el-button>
  </el-header>
  <el-container>
    <el-aside :width="isCollapse ? '64px': '200px'">
      <div class='toggle-button' @click='toggleCollapse'>|||</div>
      <el-menu background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" unique-opened :collapse='isCollapse' :collapse-transition='false' router
      :default-active="activePath">
        <el-submenu :index="items.id+''" v-for="items in menulist" :key='items.id'>
        <template slot="title">
          <i :class='iconsObj[items.id]'></i>
          <span>{{items.authName}}</span>
        </template>
       
        <el-menu-item :index="'/'+item.path" v-for='item in items.children' :key='item.id' @click='saveNavState("/"+item.path)'>
          <i class="el-icon-location"></i>
          <span>{{item.authName}}</span></el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>

</template>

<script>
export default {
  data(){
    return {
      menulist:[],
      iconsObj:{
        '125':'el-icon-user-solid',
        '103':'el-icon-coordinate',
        '101':'el-icon-s-shop',
        '102':'el-icon-s-claim',
        '145':'el-icon-s-data'
      },
      isCollapse:false,
      activePath:''
     
      }
  },
  created(){
    this.getMenuList(),
    this.activePath=window.sessionStorage.getItem('activePath')
    
  },
  methods:{
    logout(){
      window.sessionStorage.clear();
      this.$router.push('/login')
    },
    async getMenuList(){
      const{data:res}=await this.$http.get('menus')
      if(res.meta.status!==200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
     
    },
    toggleCollapse(){
      this.isCollapse=!this.isCollapse
    },
    saveNavState(activePath){
      window.sessionStorage.setItem('activePath',activePath)
      this.activePath=activePath

    }

    
  }
 
}

</script>
<style lang="less" scoped>
.el-header {
  background-color:#273d41;
  display:flex;
  justify-content: space-between;
  align-items: center;
  padding-left:0;
  color:#fff;
  font-size:20px;
  >div{
    display:flex;
    align-items:center;
    span{
      margin-left:15px;
    }
  }

}
.el-aside {
  background-color:#333744;
  .el-menu{
    border-right: none;
  }
}
.el-main {
  background-color:#EAEDF1
}
.home-container{
  height:100%;
}

.toggle-button{
  background-color:#4a5064;
  font-size:10px;
  line-height:24px;
  color:#fff;
  text-align:center;
  letter-spacing: 0.2em;
  cursor:pointer;
  

}

</style>