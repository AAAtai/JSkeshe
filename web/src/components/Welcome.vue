<template>
  <div class="wz">
    <h1 class="announcement">公告</h1>
    <p class="title">{{article[0].title}}</p>
    <p class="summary">{{article[0].summary}}</p>
    <p v-html="article[0].content"></p>
    <p class="time">{{article[0].create_time}}</p>

  </div>
</template>

<script>
export default {
  name: 'welcome',
  data(){
    return{
      article: [{}],
    }
  },
  created(){
    this.getArticle()
  },
  methods:{
    async getArticle() {
      let {data: res} = await this.$http.get('/article/getArticle')
      this.article = res.data
      console.log(this.article)
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.wz{text-align: center}
.wz .announcement{font-size: 40px}
p{margin-top: 10px}
.title{font-size: 30px}
.summary{font-size: 20px}

</style>
