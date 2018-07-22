<template>
  <div>
    <form>
      <div :class="{'form-group':true, 'has-error':errors.has('项目')}">
        <label>项目</label>
        <input type="text" class="form-control" placeholder="项目" v-model="news.project" v-validate="'required'" name="项目">
        <span class="help-block" v-show="errors.has('项目')">{{ errors.first('项目') }}</span>
      </div>
      <div :class="{'form-group':true, 'has-error':errors.has('赛事')}">
        <label>赛事</label>
        <input type="text" class="form-control" placeholder="赛事" v-model="news.game" v-validate="'required'" name="赛事">
        <span class="help-block" v-show="errors.has('赛事')">{{ errors.first('赛事') }}</span>
      </div>
      <div :class="{'form-group':true, 'has-error':errors.has('标题')}">
        <label>标题</label>
        <input type="text" class="form-control" placeholder="输入标题" v-model="news.title" v-validate="'required'" name="标题">
        <span class="help-block" v-show="errors.has('标题')">{{ errors.first('标题') }}</span>
      </div>
      <div :class="{'form-group':true, 'has-error':errors.has('来源')}">
        <label>来源</label>
        <input type="text" class="form-control" placeholder="输入来源" v-model="news.source" name="来源">
        <span class="help-block" v-show="errors.has('来源')">{{ errors.first('来源') }}</span>
      </div>
      <div :class="{'form-group':true, 'has-error':errors.has('内容')}">
        <label>内容</label>
        <editor id="editor_id" height="600px" width="100%" :content="news.content"
        pluginsPath="/static/kindeditor/plugins/"
        :loadStyleMode="false"
        @on-content-change="onContentChange"></editor>
        <span class="help-block" v-show="errors.has('内容')">{{ errors.first('内容') }}</span>
      </div>
      <div :class="{'form-group':true, 'has-error':errors.has('图片')}">
        <label>图片</label>
        <input ref="files" type="file" name="image" id="image" v-on:change="upload">
        <img :src="news.image" class="img-responsive"/>
        <span class="help-block" v-show="errors.has('图片')">{{ errors.first('图片') }}</span>
      </div>
      <button type="button" class="btn btn-default" v-on:click="submit()">提交</button>
    </form>
  </div>
</template>

<script>
import g from '../../global.js'
import Vue from 'vue'
import VueResource from 'vue-resource'
import zhcn from 'vee-validate/dist/locale/zh_CN'
import VeeValidate, { Validator } from 'vee-validate'
import VueKindEditor from 'vue-kindeditor'
import 'kindeditor/kindeditor-all.js'
import 'kindeditor/themes/default/default.css'

Vue.use(VueResource)

Validator.localize('zh_CN', zhcn)
Vue.use(VeeValidate)

Vue.config.productionTip = false
Vue.use(VueKindEditor)

export default {
  name: 'Index',
  data () {
    return {
      news: {}
    }
  },
  methods: {
    submit: function () {
      this.$validator.validateAll().then(result => {
        if (result) {
          let news = this.$data.news
          if (!news.id) {
            Vue.http.post(g.t('/api/admin/newss'), JSON.stringify(news)).then(function (response) {
              location.href = '#/newsList'
            }, function (response) {
              g.toLogin()
            })
          } else {
            Vue.http.put(g.t('/api/admin/newss/' + news.id), JSON.stringify(news)).then(function (response) {
              location.href = '#/newsList'
            }, function (response) {
              g.toLogin()
            })
          }
        }
      })
    },
    upload: function (e) {
      let that = this

      e.preventDefault()
      var files = e.target.files
      var data = new FormData()
      data.append('image', files[0])

      Vue.http.post(g.t('/api/admin/file'), data).then(function (response) {
        that.$set(that.$data.news, 'image', response.bodyText)
      }, function (response) {
        g.toLogin()
      })
    },
    onContentChange (val) {
      this.news.content = val
    }
  },
  created () {
    let news = this.$data.news
    let newsId = this.$route.params.id
    if (newsId) {
      Vue.http.get(g.t('/api/admin/newss/' + newsId)).then((response) => {
        let newsEntity = response.data
        this.$set(news, 'id', newsEntity.id)
        this.$set(news, 'project', newsEntity.project)
        this.$set(news, 'game', newsEntity.game)
        this.$set(news, 'title', newsEntity.title)
        this.$set(news, 'source', newsEntity.source)
        this.$set(news, 'content', newsEntity.content)
        this.$set(news, 'image', newsEntity.image)
      }, function (response) {
        g.toLogin()
      })
    }
  }
}
</script>

<style scoped>
body{
  background-color: #CCC;
}
</style>
