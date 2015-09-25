(function(window,$,React) {
  var ESC = 27;
  var ENTER = 13;
  var TIMEOUT = 504; // We'll get a 504 if the accounts server is offline
  var cx = React.addons.classSet;

  var AccountLogin = React.createClass({displayName: "AccountLogin",
      mixins: [React.addons.LinkedStateMixin],
      getInitialState: function () {
        return {
          // If we submit the form we'll be true here until we get the sucessful/failed
          // response from the server
          LoginInProgress: false,
          // If the user failed the last login attempt
          FailedLogin: false,
          // The entered form info:
          Username: "",
          Password: "",
        };
      },
      handleSubmit: function(e) {
        e.preventDefault(); // Don't actually do the browser action of a form submit
        this.setState({LoginInProgress: true});
        var p = $.ajax({
          url: '/api/v1/login',
          method: "POST",
          dataType: 'json',
          contentType: 'application/json',
          data: JSON.stringify({u: this.state.Username,
                                x: this.state.Password}),
          success: this.handleSuccess.bind(this),
          error:   this.handleError.bind(this),
        });
      },
      handleSuccess: function(userinfo) {
        this.props.onLoginSuccess(userinfo);
      },
      handleError: function(ev) {
        this.setState({
          FailedLogin: true,
          LoginInProgress: false
        });
      },
      render: function() {
        var disabled = this.state.LoginInProgress;
        var failMsg;
        if( this.state.FailedLogin ) {
          failMsg = React.createElement("span", null, "Login failed. Please try again");
        }
        return (
          React.createElement("form", {className: "eecisLoginForm", onSubmit: this.handleSubmit}, 
            failMsg, 
            React.createElement("div", {className: "form-group"}, 
              React.createElement("label", {htmlFor: "eecis-username"}, "Username"), 
              React.createElement("input", {type: "text", className: "form-control", 
                     disabled: disabled, 
                     valueLink: this.linkState('Username'), 
                     id: "eecis-username", placeholder: "Username"})
            ), 
            React.createElement("div", {className: "form-group"}, 
              React.createElement("label", {htmlFor: "eecis-password"}, "Password"), 
              React.createElement("input", {type: "password", className: "form-control", 
                     disabled: disabled, 
                     valueLink: this.linkState('Password'), 
                     id: "eecis-password", placeholder: "Password"})
            ), 
            React.createElement("button", {type: "submit", 
                     disabled: disabled, 
                     className: "btn btn-success"}, "Login")
          )
        );
      }
  });

  var AccountInfoDisplay = React.createClass({displayName: "AccountInfoDisplay",
      getInitialState: function () {
        return {
          UserInfo: {},
        };
      },
      componentWillMount: function() {
      },
      render: function() {
        return (React.createElement("div", null));
      }
  });

  var AccountDropDownContent = React.createClass({displayName: "AccountDropDownContent",
      getInitialState: function () {
        return {
          UserInfo: {},
          UserLoggedIn: false,
        };
      },
      componentWillMount: function() {
      },
      onLoginSuccess: function(userinfo) {
        console.log("Yeah buddy %o", userinfo);
      },
      render: function() {
        return (React.createElement(AccountLogin, {onLoginSuccess: this.onLoginSuccess}));
      }
  });


  // Renders the very rightmost topnav link:
  var AccountDropDown = React.createClass({displayName: "AccountDropDown",
    // We render depending on 
    // - logged in yes/no
    getInitialState: function () {
      return {
        LoggedIn: false,
        Username: this.props.userInfo.subscribeOnNext(this.updateUserInfo, this)
      };
    },
    updateUserInfo: function(user) {
      console.log("Works %o", user);
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
    var userInfo = new Rx.ReplaySubject();
    // Initialize the userinfo with the cookie information:
    userInfo.onNext(window.eecis.getUserInfo());
    React.render(React.createElement(AccountDropDown, {userInfo: userinfo}),      
        document.getElementById("user-dropdown"));
    React.render(React.createElement(AccountDropDownContent, {userInfo: userinfo}),
        document.getElementById("user-dropdown-content"));
  }

  window.onDocLoad(renderAccountInfo);
}(window,jQuery,React));

