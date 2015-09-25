(function(window,$,React) {
  var ESC = 27;
  var ENTER = 13;
  var TIMEOUT = 504; // We'll get a 504 if the accounts server is offline
  var cx = React.addons.classSet;
  var STAFF_LINKS = {
    "print1.eecis": "https://staff.eecis.udel.edu:47221/admin"
  };

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
        //<ul id="user-dropdown-content-TODO" class="dropdown-menu pull-right" style="padding:19px;width:220px">
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

  var AccountInfo = React.createClass({displayName: "AccountInfo",
      getInitialState: function () {
        return {
          UserInfoBus: null,
          UserInfo: {
            loggedIn: false
          }
        };
      },
      componentWillUnmount: function() {
        this.state.UserInfoBus.dispose();
      },
      componentWillMount: function() {
        this.setState({
          UserInfoBus: this.props.userBus.subscribeOnNext(this.updateUserInfo, this)
        });
      },
      updateUserInfo: function(user) {
        this.setState({UserInfo: user});
        console.log(user);
      },
      logout: function(e) {
        e.preventDefault();
      },
      // AVAILABLE:
      // expires: "01/1900"
      // firstname: "Morgan Leigh"
      // lastname: "Davis"
      // loggedIn: true
      // sponsor: "roosen"
      // staff: false
      // email: possibly null
      // type: "ECE Undergrad"
      // uid: 3295
      // user: "leigh",
      render: function() {
        var user = this.state.UserInfo;
        var emailInfo = null;
        if( user.email ) {
          emailInfo = React.createElement("span", null, React.createElement("strong", null, "Email:"), user.email, React.createElement("br", null));
        } else {
          emailInfo = React.createElement("span", null, React.createElement("strong", {className: "danger"}, "No email on record:("), React.createElement("br", null));
        }
        var tags = []
        if( user.staff ) {
          tags.push(
                React.createElement("span", {className: "label label-success"}, "Staff")
          );
        }
        tags.push(
              React.createElement("span", {className: "label label-success"}, user.type)
        );
        var links = $.map( $.makeArray(STAFF_LINKS),
          function(link, name) {
            return React.createElement("a", {href: link, className: "list-group-item"}, "STAFF_LINKS[", name, "]")
          }
        );
        //<dl>
          //<dt>Email:</dt><dt>
          //</dt><dd>Andre</dd>
        //</dl>
        return (
          React.createElement("div", null, 
            React.createElement("address", null, 
              React.createElement("strong", null, "Username: "), user.user, React.createElement("br", null), 
              emailInfo, 
              React.createElement("strong", null, "Name: "), user.firstname, " ", user.lastname, React.createElement("br", null), 
              React.createElement("strong", null, "Expires: "), user.expires, React.createElement("br", null), 
              React.createElement("strong", null, "Sponsor: "), user.sponsor, React.createElement("br", null), 
              React.createElement("strong", null, "UID: "), user.uid, React.createElement("br", null)
            ), 
            React.createElement("dl", null, 
              React.createElement("dt", null, "Classifications:"), 
              React.createElement("dd", null, 
                tags
              )
            ), 
            React.createElement("div", {className: "list-group"}, 
              React.createElement("span", {href: "#", className: "list-group-item list-group-item-success"}, "Quick Links:"), 
              links
            ), 
           React.createElement("button", {onClick: this.logout, type: "button", 
                   className: "btn btn-danger btn-block"}, "Logout")
          )
        );
      }
  });

  var AccountDropDownContent = React.createClass({displayName: "AccountDropDownContent",
      getInitialState: function () {
        return {
          UserInfoBus: null,
          UserInfo: {
            loggedIn: false
          }
        };
      },
      componentWillUnmount: function() {
        this.state.UserInfoBus.dispose();
      },
      componentWillMount: function() {
        this.setState({
          UserInfoBus: this.props.userBus.subscribeOnNext(this.updateUserInfo, this)
        });
      },
      updateUserInfo: function(user) {
        this.setState({UserInfo: user});
      },
      onLoginSuccess: function(userinfo) {
        this.props.userBus.onNext(userinfo);
        console.log("Successful login: %o", userinfo);
      },
      render: function() {
        if( this.state.UserInfo.loggedIn ) {
          return (React.createElement(AccountInfo, React.__spread({},  this.props)));
        } else {
          return (React.createElement(AccountLogin, {onLoginSuccess: this.onLoginSuccess}));
        }
      }
  });


  // Renders the very rightmost topnav link:
  var AccountDropDown = React.createClass({displayName: "AccountDropDown",
    getInitialState: function () {
      return {
        UserInfoBus: null,
        UserInfo: {}
      };
    },
    componentWillUnmount: function() {
      this.state.UserInfoBus.dispose();
    },
    componentWillMount: function() {
      this.setState({
        UserInfoBus: this.props.userBus.subscribeOnNext(this.updateUserInfo, this)
      });
    },
    updateUserInfo: function(user) {
      this.setState({UserInfo: user});
    },
    // We render depending on 
    // - logged in yes/no
    render: function() {
      var label = "Login";
      var style = {};
      if(this.state.UserInfo.loggedIn) {
        label = this.state.UserInfo.user;
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
    var userBus = new Rx.ReplaySubject();
    // Initialize the userBus with the cookie information:
    userBus.onNext(window.eecis.getUserInfo());
    React.render(React.createElement(AccountDropDown, {userBus: userBus}),      
        document.getElementById("user-dropdown"));
    React.render(React.createElement(AccountDropDownContent, {userBus: userBus}),
        document.getElementById("user-dropdown-content"));
  }

  window.onDocLoad(renderAccountInfo);
}(window,jQuery,React));

