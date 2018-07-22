export default {
  t: function (url) {
    let token = localStorage.getItem('token')
    if (!token) {
      window.location.assign('#/login')
    } else {
      if (url.indexOf('?') > 0) {
        return url + '&token=' + token
      } else {
        return url + '?token=' + token
      }
    }
  },
  toLogin: function () {
    localStorage.setItem('token', null)
    localStorage.setItem('backUrl', location.hash.substring(1))
    location.href = '#/login'
  },
  href: function (href) {
    window.router.push(href)
  }
}
