<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>水电缴费通知</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card" style="box-shadow: 0 0 2px rgba(0,0,0,0.1)">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input clearable placeholder="请输入搜索内容" v-model="userInfo.query" @clear="getUserList()" @blur="getUserList">
            <template #append>
              <el-button :icon="Search"  @click="getUserList" />
              <!--<i class="iconfont icon-search"></i>-->
            </template>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="users" border >
        <el-table-column type="index" label="序号" width="70"></el-table-column>
        <el-table-column prop="username" label="业主姓名" width="180" />
        <el-table-column label="头像" prop="photo">
          <template #default="scope">
            <el-upload
                class="avatar-uploader"
                action="http://127.0.0.1:3000/up/"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :headers="headersObj"
                :data={username:scope.row.username}
            >
              <img v-if="scope.row.photo" :src="'http://127.0.0.1:3000/'+scope.row.photo" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="地址" width="180" />
        <el-table-column prop="mobile" label="手机号" width="180" />
        <el-table-column prop="email" label="邮箱" width="180" />
        <el-table-column prop="spend" label="水电需缴费" >
          <template #default="scope">
            <el-switch
                v-model.number="scope.row.spend"
                :active-value=1
                :inactive-value=0
                @change="userSpendChange(scope.row)"
            />
            <!--          {{scope.row}}-->
          </template>
        </el-table-column>
        <el-table-column prop="cast" label="已使用水电费" width="180" />
        <el-table-column label="缴费">
          <template #default="scope">
            <el-button type="primary" :icon="Edit" @click="showSpend(scope.row.id)" circle />
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
          v-model:currentPage="userInfo.pagenum"
          v-model:page-size="userInfo.pagesize"
          :page-sizes="[1, 2, 3, 5]"
          :small=true
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      />
    </el-card>

  </div>
</template>

<script>
import {Search,Edit,Delete,Plus} from '@element-plus/icons-vue'

export default {
  name: "Spend",
  setup() {
    return {
      Search, Edit, Delete
    }
  },
  data() {
    let checkEmail = (rules, value, cb) => {
      const emailReg = /^[a-zA_Z0-9_-]+@([a-zA_Z0-9_-])+(\.[a-zA_Z0-9_-])+/
      if (emailReg.test(value)) {
        return cb()
      }
      cb(new Error('非法邮箱'))
    }
    let checkMobile = (rules, value, cb) => {
      const mobileReg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (mobileReg.test(value)) {
        return cb()
      }
      cb(new Error('非法手机号'))
    }
    return {
      userInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      users: [],
      total: 0,
      editForm: {},
      editCast:{
        cast:'0.00'
      },
      imageUrl:'',
      headersObj:{Authorization:window.sessionStorage.getItem('token')}
    }
  },
  created() {
    this.getUserList()
  },
  components:{
    Plus
  },
  methods: {
    async getUserList() {
      let {data: res} = await this.$http.get('/users/getAllUser', {params: this.userInfo})
      this.users = res.users
      this.total = res.total
      // console.log(res)
    },
    handleSizeChange(pagesize) {
      // console.log(pagesize)
      this.userInfo.pagesize = pagesize
      this.getUserList()
    },
    handleCurrentChange(pagenum) {
      // console.log(pagenum)
      this.userInfo.pagenum = pagenum
      this.getUserList()
    },
    async userSpendChange(userinfo) {
      // console.log(status)
      const {data: res} = await this.$http.put(`/users/userSpend/${userinfo.id}/spend/${userinfo.spend}`)
      // console.log(res)
      if (res.flag === false) {
        this.userInfo.spend = !this.userInfo.spend
        return this.$message.error(res.msg)
      }
      this.$message.success(res.msg)
    },
    handleAvatarSuccess(response,uploadFile){
      this.getUserList()
    },
    async showSpend(id) {
      // console.log(id)
      const {data:res} = await this.$http.get('/users/getUserById/'+id)
      // console.log(data)
      if (res.flag==false) return this.$message.error(res.msg)
      this.editForm=res.data[0]
      console.log(res.data[0])
      const confirmRes = await this.$confirm(
          '确认业主已缴费?',
          '提示',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
          }).catch(err => {
        return err
      })
      // console.log(confirmRes)
      if (confirmRes !== 'confirm') {
        return this.$message.info('取消清空缴费')
      }
      const {data}=await this.$http.put('/users/editUserCast/' + this.editForm.id,{
        cast:this.editCast.cast,
      })
      if (data.flag === false) return this.$message.error(data.msg)
      this.$message.success(data.msg)
      await this.getUserList()
    },
  }
}
</script>

<style scoped>
.avatar-uploader{
  margin: 5px;
}
.avatar-uploader,.avatar-uploader .avatar,.el-icon.avatar-uploader-icon {
  width: 50px;
  height: 50px;
  font-size: 16px;

}
.el-pagination{
  margin-top:15px;
}

</style>
