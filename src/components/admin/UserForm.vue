<template>
  <div>
    <form>{{
      issue
      }}
      <table class="table">
        <thead>
          <tr>
            <th v-for="(item,i) in tablist" :key="i">{{item}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="a in userAdminDbList">
            <td><input type="checkbox" name="category" v-on:click="addQuestion(a.id)" /></td>
            <td>{{ a.userMobile }}</td>
            <td>{{ a.addTime }}</td>
            <td>{{ a.answer }}</td>
            <td>{{ a.answerRate }}</td>
            <td>{{ a.status=='AWARD'?'中奖':'未中奖' }}</td>
            <td>{{ a.userWx }}</td>
          </tr>
          <tr v-if="userAdminDbList.length == 0">
            <td colspan="7">
              暂无用户
            </td>
          </tr>
        </tbody>
      </table>
      <button type="button" class="btn btn-default" v-on:click="submit()">提交</button>
    </form>
  </div>
</template>

<script>
  import g from '../../global.js'
  import Vue from 'vue'
  import VueResource from 'vue-resource'
  import zhcn from 'vee-validate/dist/locale/zh_CN'
  import VeeValidate, {
    Validator
  } from 'vee-validate'
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
    data() {
      return {
        tablist: ['选择', '用户电话', '竞猜时间', '竞猜内容', '正确率', '是否中奖', '微信'],
        issueId: '',
        list: [], // 已选中用户id列表
        issue: {
          issueUserList: []
        },
        userAdminDbList: []
      }
    },
    methods: {
      submit: function () {
        this.$validator.validateAll().then(result => {
          if (result) {
            this.issue.issueUserList = [];
            this.list.map((data) => {
              this.issue.issueUserList.push({
                'id': data
              })
            })
            let issue = this.issue
          if (issue.id) {
              Vue.http.post(g.t('/api/admin/updateIssueUser'), JSON.stringify(issue)).then(function (response) {
                location.href = '#/issueList'
              }, function (response) {
                g.showMessage(response)
              })
            }
          }
        })
      },
      addQuestion(id) {
        let index = this.list.indexOf(id)
      if (index > -1) {
          this.list.splice(index, 1)
        } else {
          this.list.push(id)
        }
      }
    },
    created() {
      let that = this
      let issue = this.$data.issue
      let issueId = this.issueId = this.$route.params.id
      if (issueId) {
        Vue.http.get(g.t('/api/admin/issue/' + issueId)).then((response) => {
          let issueEntity = response.data
          that.userAdminDbList = issueEntity.issueUserList
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
  body {
    background-color: #CCC;
  }

</style>
