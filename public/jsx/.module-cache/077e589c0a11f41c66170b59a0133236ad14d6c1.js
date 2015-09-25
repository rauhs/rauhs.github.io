(function(window,$,React) {
  // Returns the userinfo of the cookie
  window.EecisUserInfo = function() {
    var ck = getCookie(COOKIE_NAME);
    if(ck) {
      var json = atob(ck.split("||")[1]);
      return JSON.parse(json);
    }
  }
  function init() {
    var user = EecisUserInfo();
    if( user.staff ) {
      $('.show-for-staff').removeClass("hidden")
    }
    global.eecis.userinfo = user;
  }
  window.onDocLoad(init);
}(window,jQuery,React));

