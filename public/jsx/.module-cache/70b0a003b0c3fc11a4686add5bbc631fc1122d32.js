// TODO: Docs
(function(global,$,React) {
    var ESC = 27;
    var ENTER = 13;
    var COOKIE_NAME = "NGX_INFO";

    var AccountDropDownContent = React.createClass({displayName: "AccountDropDownContent",
        getInitialState: function () {
          return {
            Results: [],
          };
        },
        componentWillMount: function() {
          // read cookie state
        },
        render: function() {
          return (
            React.createElement("form", null, 
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
          );
        }
    });

    // Renders the very rightmost topnav link:
    var AccountDropDown = React.createClass({displayName: "AccountDropDown",
      // We render depending on 
      // - logged in yes/no
      getInitialState: function () {
        return {
          LoggedIn: false,
          Username: null,
        };
      },
      readCookie: function() {
        var c = getCookie(COOKIE_NAME);
        if( c ) {
          //this.setState({
        }
      },
      render: function() {
        var label = "Login";
        if(this.state.LoggedIn) {
          label = "foo";
        } else {
          return (
              React.createElement("span", null, 
                React.createElement("i", {className: "fa fa-user", style: {color: "green"}}), 
                label, React.createElement("span", {className: "caret"})
              )
          );
        }
      }
    });

    var renderAccountInfo = function() {
      React.render(React.createElement(AccountDropDown, null),      
          document.getElementById("user-dropdown"));
      React.render(React.createElement(AccountDropDownContent, null),
          document.getElementById("user-dropdown-content"));
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


