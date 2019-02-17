<template>
  <div>
    <form>
      <div :class="{'form-group':true, 'has-error':errors.has('期次')}">
        <label>期次(由系统自动生成)</label>
        <span>{{ issue.issue }}</span>
      </div>
      <div :class="{'form-group':true, 'has-error':errors.has('对阵')}">
        <label>对阵</label>
        <select class="form-control" name="对阵" v-model="issue.matchNameAndId"  v-validate="'required'">
        <option v-for="matchNameAndId in matchList">{{matchNameAndId}}</option>
        </select>
        <span class="help-block" v-show="errors.has('对阵')">{{ errors.first('对阵') }}</span>
      </div>
      <div :class="{'form-group':true, 'has-error':errors.has('竞猜题目')}">
        <label>竞猜题目</label>
        <div v-for="problemAdminDb in problemAdminDbList">
         <p><input type="checkbox" name="category" value="今日话题" v-on:click="addQuestion(problemAdminDb)" />{{problemAdminDb.problemTitle}} </p>
             <label  v-for="problemContent in problemAdminDb.problemContentList" style="width:200px">{{problemContent.questionContent}}</label>

        </div>
        <!--<div v-for="question in issue.issueProblemList">-->
          <!--<select class="form-control" style="width:400px">>-->
            <!--<option v-for="problemAdminDb in problemAdminDbList">{{problemAdminDb.problemTitle}}</option>-->
          <!--</select>-->
          <!--<input type="text" v-model="question.answer" style="width:400px">-->

        <!--<button v-on:click="removeQuestion(question)" class="del-image-btn">删除</button>-->
        <!--</div>-->
      <!--<button v-on:click="addQuestion"> + </button>-->

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
      issue: {
        issueProblemList:[]
      },
      matchList:{},
      problemAdminDbList:[]
    }
  },
  methods: {
    submit: function () {
      this.$validator.validateAll().then(result => {
        if (result) {
          let issue = this.$data.issue

              if (!issue.id) {
                Vue.http.post(g.t('/api/admin/issue'), JSON.stringify(issue)).then(function (response) {
                  location.href = '#/issueList'
                }, function (response) {
                  g.showMessage(response)
                })
              } else {
                Vue.http.put(g.t('/api/admin/issue/' + issue.id), JSON.stringify(issue)).then(function (response) {
                  location.href = '#/issueList'
                }, function (response) {
                  g.showMessage(response)
                })
              }

          }
      })
    },
addQuestion () {
  this.issue.issueProblemList.push({'answer':''})
},
removeQuestion (question) {
  this.issue.issueProblemList.splice(this.issue.issueProblemList.indexOf(question), 1)
},
  },
  created () {
  let that = this;
  Vue.http.get(g.t('/api/admin/matchList')).then(function (response) {

    that.matchList=response.bodyText.split('|')

  })
  Vue.http.get(g.t('/api/admin/problemAdminDbs')).then(function (response) {

    that.problemAdminDbList=JSON.parse(response.bodyText)
    console.log(response.bodyText)
  })
  let issue = this.$data.issue
  let issueId = this.$route.params.id
  if (issueId) {
    Vue.http.get(g.t('/api/admin/issue/' + issueId)).then((response) => {
      let issueEntity = response.data
      this.$set(issue, 'id', issueEntity.id)
    this.$set(issue, 'issue', issueEntity.issue)
    this.$set(issue, 'matchNameAndId', issueEntity.matchNameAndId)
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
