// TODO: Docs
(function(global,$,React) {
    // https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie
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
        }
    });

    var renderAccountInfo = function() {
        var div = $('#login-form').get(0);
        if( div ) {
            React.render(React.createElement(LoginForm, null), div);
        }

    }
    //global.onDocLoad(renderAccountInfo);

    function getCookie(name) {
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


