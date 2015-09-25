// TODO: Docs
(function(window,$,React) {
  var ESC = 27;
  var ENTER = 13;
  var TIMEOUT = 504; // We'll get a 504 if the accounts server is offline
  var cx = React.addons.classSet;

  var AccountLogin = React.createClass({displayName: "AccountLogin",
      getInitialState: function () {
        return {
          // If we submit the form we'll be true here until we get the sucessful/failed
          // response from the server
          LoginInProgress: false,
          Username: "",
          Password: "",
        };
      },
      render: function() {
        return (
          React.createElement("form", null, 
            React.createElement("div", {className: "form-group"}, 
              React.createElement("label", {htmlFor: "eecis-username"}, "Username"), 
              React.createElement("input", {type: "text", disabled: true, className: "form-control", id: "eecis-username", placeholder: "Username"})
            ), 
            React.createElement("div", {className: "form-group"}, 
              React.createElement("label", {htmlFor: "eecis-password"}, "Password"), 
              React.createElement("input", {type: "password", disabled: true, className: "form-control", id: "eecis-password", placeholder: "Password"})
            ), 
            React.createElement("button", {type: "submit", disabled: true, className: "btn btn-success"}, "Login")
          )
        );
      }
  });

  var AccountDropDownContent = React.createClass({displayName: "AccountDropDownContent",
      getInitialState: function () {
        return {};
      },
      componentWillMount: function() {
      },
      render: function() {
        return (React.createElement(AccountLogin, null));
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
      var style = {};
      if(this.state.LoggedIn) {
        label = this.state.Username;
        style = {color: "green"};
      }
      return (
        React.createElement("span", null, 
          React.createElement("i", {className: "fa fa-user"}), 
          React.createElement("span", {style: style}, label), 
          React.createElement("span", {className: "caret"})
        )
      );
    }
  });

  var renderAccountInfo = function() {
    React.render(React.createElement(AccountDropDown, null),      
        document.getElementById("user-dropdown"));
    React.render(React.createElement(AccountDropDownContent, null),
        document.getElementById("user-dropdown-content"));
  }

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

  window.onDocLoad(renderAccountInfo);
}(window,jQuery,React));
