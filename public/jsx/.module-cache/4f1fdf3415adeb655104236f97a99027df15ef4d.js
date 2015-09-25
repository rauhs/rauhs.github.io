(function(window,$,React,InstantClick) {
  // Returns the userinfo of the cookie
  window.EecisUserInfo = function() {
    var ck = getCookie(COOKIE_NAME);
    if(ck) {
      var json = atob(ck.split("||")[1]);
      return JSON.parse(json);
    }
  }
  window.onDocLoad = function(handler) {
    InstantClick.on('change', handler);
  }
  function init() {
    var user = EecisUserInfo();
    if( user.staff ) {
      $('.show-for-staff').removeClass("hidden")
    }
    global.eecis.userinfo = user;
  }
  window.onDocLoad(init);
}(window,jQuery,React,InstantClick));

