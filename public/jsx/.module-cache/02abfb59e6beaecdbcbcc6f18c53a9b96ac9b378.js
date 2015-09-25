// TODO: Docs
(function(global,$,React) {
    // https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie
    var myCookie = document.cookie.replace(/(?:(?:^|.*;\s*)NGX_INFO\s*\=\s*([^;]*).*$)|^.*$/, "$1");

    var ESC = 27;
    var ENTER = 13;

    if( myCookie ) {
      // We should have some kind of user data in the cookie
    }

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

    var renderSearchResults = function() {
        var div = $('#login-form').get(0);
        if( div ) {
            React.render(React.createElement(LoginForm, null), div);
        }

    }
    //global.onDocLoad(renderSearchResults);

    function doAjaxLogin(q) {
        var p = $.ajax({
            url: '/api/v1/login',
            method: "POST",
            dataType: 'json',
        }).promise();
        return Rx.Observable.fromPromise(p);
    }

}(window,jQuery,React));


