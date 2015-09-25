// TODO: Docs
(function(global,$,React) {
    var ESC = 27;
    var ENTER = 13;


    var LoginForm = React.createClass({displayName: "LoginForm",
        getInitialState: function () {
          return {
            Results: [],
          };
        },
        componentWillMount: function() {
        },
        render: function() {
          return (
          React.createElement("a", {href: "#", class: "dropdown-toggle", "data-toggle": "dropdown", role: "button"}, 
            React.createElement("i", {class: "fa fa-user"}), 
            "Login", React.createElement("span", {class: "caret"})
          )
          );
        }
    });

    var renderAccountInfo = function() {
        var div = $('#user-dropdown').get(0);
        if( div ) {
            React.render(React.createElement(LoginForm, null), div);
        }

    }
    global.onDocLoad(renderAccountInfo);

    function getCookie(name) {
      // https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie
      var re = new RegExp('(?:(?:^|.*;\\s*)'+name+'\\s*\\=\\s*([^;]*).*$)|^.*$');
      //var str = document.cookie.replace(/(?:(?:^|.*;\s*)NGX_INFO\s*\=\s*([^;]*).*$)|^.*$/, "$1");
      var str = document.cookie.replace(re, "$1");
      if( str == "" ){
        return undefined;
      } else {
        return str;
      }
    }
    window.getCookie = getCookie;

    function doAjaxLogin(user,pw) {
        var p = $.ajax({
            url: '/api/v1/login',
            method: "POST",
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({u: user, x: pw}),
        }).promise();
        return Rx.Observable.fromPromise(p);
    }

}(window,jQuery,React));


