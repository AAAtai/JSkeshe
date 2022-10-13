<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>发布公告</el-breadcrumb-item>
  </el-breadcrumb>
<el-card>
  <el-form :model="articleForm" label-width="80px">
    <el-form-item label="标题">
      <el-input v-model="articleForm.title"/>
    </el-form-item>
    <el-form-item label="分类">
      <el-select v-model="articleForm.cate_id" placeholder="please select your zone">
        <el-option label="小区内部通知" value="1" />
        <el-option label="政府政策通知" value="2" />
      </el-select>
    </el-form-item>
    <el-form-item label="概要">
      <el-input v-model="articleForm.summary"/>
    </el-form-item>
    <el-form-item label="公告内容">
      <textarea v-model="articleForm.content" id="summernote" cols="30" rows="10"></textarea>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="addArticle">添加</el-button>
      <el-button type="success">重置</el-button>
    </el-form-item>
  </el-form>
</el-card>
</template>

<script>
export default {
name: "Article",
  data(){
  return{
    articleForm:{
      title:'',
      cate_id:'',
      content:''
    },
    htmlString:'<p>本小区即在6月26日早晨10：00至28日凌晨3：00共3天停水，请各位业主做好蓄水准备，给各位业主带来的不便，本小区深感抱歉抱歉！<img src="http://127.0.0.1:3000/article\\20220626\\1656175853656-image.png" style="width: 666px;"><br></p>'
  }
  },
  mounted(){
    let _this=this
   $('#summernote').summernote({
     placeholder:'请编辑小区所要公布的公告！',
     height:120,
     callbacks:{
       async onImageUpload(files){
        let formData=new FormData()
        Array.from(files).forEach(file=>{
          formData.append('file',file)
        })
       const {data}=await _this.$http.post('/up/editor',formData)
       data.forEach(url=>{
         $('#summernote').summernote('insertImage',url)
       })
      },
       async onMediaDelete(target){
       console.log(target[0].currentSrc)
        const {data}=await _this.$http.get('/article/delImage',{params:target[0].currentSrc})
      },
      }
   });
    this.article()
  },
  methods:{
    async addArticle(){
      this.articleForm.content=$('#summernote').summernote('code')
      const {data}=await this.$http.post('/article/add',this.articleForm)
    },
    article(){
      $('#summernote').summernote('pasteHTML',this.htmlString);
    },
  }
}
</script>

<style scoped>

</style>