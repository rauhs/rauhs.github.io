(function(window,$,React,InstantClick) {
  var COOKIE_NAME = "eecis.user";
  // Returns the userinfo of the cookie
  function getCookie(name) {
    // https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie
    var re = new RegExp('(?:(?:^|.*;\\s*)'+name+'\\s*\\=\\s*([^;]*).*$)|^.*$');
    var str = document.cookie.replace(re, "$1");
    if( str == "" ){
      return undefined;
    } else {
      return str;
    }
  }
  function getUserInfo() {
    var ck = getCookie(COOKIE_NAME);
    if(ck) {
      var json = atob(ck.split("||")[1]);
      return JSON.parse(json);
    }
  }
  function init() {
    var user = getUserInfo();
    if( user.staff ) {
      $('.show-for-staff').removeClass("hidden")
    }
    window.eecis = {};
    window.eecis.userinfo = user;
  }
  window.onDocLoad = function(handler) {
    InstantClick.on('change', handler);
  }
  window.onDocLoad(init);
}(window,jQuery,React,InstantClick));

