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
            React.createElement("div", null, 
              React.createElement("a", {href: "#", className: "dropdown-toggle", "data-toggle": "dropdown", role: "button"}, 
                React.createElement("i", {className: "fa fa-user"}), 
                "Login", React.createElement("span", {className: "caret"})
              ), 
              React.createElement("div", {className: "dropdown-menu pull-right", style: {padding: 19, width: 220}}, 
                React.createElement("form", {style: {width: '100%'}}, 
                  React.createElement("div", {className: "form-group"}, 
                    React.createElement("label", {htmlFor: "eecis-username"}, "Username"), 
                    React.createElement("input", {type: "text", className: "form-control", id: "eecis-username", placeholder: "Username"})
                  ), 
                  React.createElement("div", {className: "form-group"}, 
                    React.createElement("label", {htmlFor: "eecis-password"}, "Password"), 
                    React.createElement("input", {type: "password", className: "form-control", id: "eecis-password", placeholder: "Password"})
                  ), 
                  React.createElement("button", {type: "submit", className: "btn btn-success"}, "Login")
                )
              )
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
    //global.onDocLoad(renderAccountInfo);

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


