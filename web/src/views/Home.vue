<template>
  <div class="layout">
    <el-container>
      <el-header>
        <div>
          <img src="../assets/wuye.jpg" alt="">
          <h3>阳光家园物业服务管理系统</h3>
        </div>
       <div>
         <img src="../assets/avatar.png" alt="">
         <p>{{user}}</p><el-button type="info" @click="logout()">退出</el-button>
       </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu
              active-text-color="#ffd04b"
              background-color="#222222"
              class="el-menu-vertical-demo"
              text-color="#fff"
              router
              :default-active="activePath"
          >
            <el-menu-item :index="item.path" @click="saveMenuStatus(item.path)" v-for="item in menulist" :key="item.id">
              <i :class="item.icons"></i>
              <span>{{ item.title }}</span>
            </el-menu-item>
          </el-menu>

        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>

export default {
  name: 'HomeView',
  data(){
    return{
      menulist:[],
      activePath:'',
      user:''
    }
  },
  created(){
    this.loadMenu()
    this.activePath=window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout(){
      window.sessionStorage.clear ()
      this.$router.push ('/login')
    },
   async loadMenu(){
      const {data:res}=await this.$http.get('/menu')
      // console.log(res.userInfo.username)
       this.user=res.userInfo.username
     // window.sessionStorage.setItem('username',res.userInfo.username)
     this.menulist=res.data
    },
    saveMenuStatus(activePath){
      window.sessionStorage.setItem('activePath',activePath)
    }

  }
}
</script>
<style scoped>
.layout {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0
}

.el-container {
  background-color: #383838;
  height: 100%
}

.el-header {
  height: 80px;
  display: flex;
  align-items: center;
  color: #fff;
  justify-content: space-between
}

.el-header div {
  display: flex;
  align-items: center
}

.el-header img {
  margin-right: 8px;
  width: 50px;
  height: 50px;
}

.el-header p {
  margin-right: 8px;
}

.el-main {
  background-color: #f7f7f7
}

.el-sub-menu .el-menu-item-group .el-menu-item{
  height: 32px;
}
.el-menu-item-group__title{
  padding: 0px;
}
</style>
