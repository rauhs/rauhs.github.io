// TODO: Docs
//
//
(function(global,$,React) {
    // how many characters need to be entered to actually trigger a search request
    var SearchCharThresh = 2; // >=

    var SearchResults = React.createClass({displayName: "SearchResults",
        // 
        getInitialState: function () {
          return {
            Results: [], // The actual search results title/url/body
            // If we're performing a search
            // This is first false, but when users enter somethign it is true.
            // When the user then presses escape it's back to false
            ActiveSearch: false,
            // We could error if the search server is doen for some reason.
            Error: false
          };
        },

        componentWillMount: function() {
          var that = this;
          // Disable the form submit on enter
          var $form = $("#search-form").on('keyup keypress', function(e) {
             var code = e.keyCode || e.which;
             if (code == 13) { 
                e.preventDefault();
                return false;
             }
          });

          // The main search input box
          var $input = $("#search");

          var keyEvent = Rx.Observable.fromEvent(document, 'keydown');
          var abortSearch = keyEvent.filter(function(e) {
            return (e.which == 27) || (e.keyCode == 27);
          });
          abortSearch.subscribe(function() {
            that.setState({ActiveSearch: false});
          });

          var startSearch = keyEvent.filter(function(e) {
              return (e.which == 191) || (e.keyCode == 191);
            })
            .subscribe(function(e) {
              $input.focus();
              e.preventDefault();
            });

          var gotoFirstResult = Rx.Observable.fromEvent($input, 'keypress')
            .filter(function(e) {
              return (e.which == 13) || (e.keyCode == 13);
          });
          gotoFirstResult.subscribe(function() {
            if( that.state.Results.length > 0 ) {
              var url = that.state.Results[0]._source.url;
              window.location.href = url;
            }
          });

          var abortOnBlur = Rx.Observable.fromEvent($input, 'blur')
            .subscribe(function(e) {
              // We cant do this since it will hide the results and prevent us
              // to click on a search results:
              //if( e.relatedTarget.tagName == "A" ) {}
              // This is a hack... It allows that any clicks on A href are
              // first handled and the browser leaves
              //setTimeout(function() {
              //  that.setState({ActiveSearch: false});
              //}, 100);
            });

          var resumeOnFocus = Rx.Observable.fromEvent($input, 'focus')
            .subscribe(function(e) {
              console.log($input);
              if( $input.val().length >= SearchCharThresh ) {
                that.setState({ActiveSearch: true});
              }
            });


          var searchStream = Rx.Observable.fromEvent($input, 'input')
              .map(function(e) {
                  return e.target.value;
              })
              .filter(function(text) {
                  var valid = text.length >= SearchCharThresh;
                  that.setState({ActiveSearch: valid});
                  return valid;
              })
              .debounce(10) //ms
              .distinctUntilChanged()
              .flatMapLatest(doAjaxSearch);

          searchStream.subscribe(function(e) {
              if( e.length == 0 ) {
                that.setState( {Results: []} );
              } else {
                that.setState( {Results: e} );
              }
          },function(err) {
              that.setState( {Error: err} );
          });
        },

        // Renders the actual search results
        render: function() {
            if( this.state.Error ) {
              return (React.createElement("div", null, React.createElement("p", null, "An error occured. Please notify us if this persists.")));
            }
            if( this.state.ActiveSearch ) {
              $(".show-on-search").removeClass("hidden");
              $(".hide-on-search").addClass("hidden");
            } else {
              $(".show-on-search").addClass("hidden");
              $(".hide-on-search").removeClass("hidden");
            }
            var li = []; // LI dom items
            for( var i=0; i < this.state.Results.length; i++ ){
                var r = this.state.Results[i];
                var hl = r.highlight;
                var body = undefined;
                if( 'body' in hl ) {
                  body = React.createElement("div", {dangerouslySetInnerHTML: {__html: hl.body[0]}});
                }
                if( 'title' in hl ) {
                  li.push(
                      React.createElement("a", {href: r._source.url}, 
                        React.createElement("h3", {class: "list-group-item-heading", dangerouslySetInnerHTML: {__html: hl.title}}), 
                        React.createElement("p", {className: "list-group-item-text"}, body)
                      ) );
                } else {
                  li.push( React.createElement("a", {href: r._source.url}, 
                        React.createElement("h3", {class: "list-group-item-heading"}, r._source.title), 
                        React.createElement("p", {className: "list-group-item-text"}, body)
                      ) );
                }
            }
            if( li.length == 0 ) {
              return (React.createElement("div", {className: "alert alert-info"}, "No search results :("));
            } else {
              return (
                React.createElement("div", null, 
                  React.createElement("div", {className: "alert alert-info"}, "Press ", React.createElement("kbd", null, "Enter"), ": Go to first result"), 
                  React.createElement("div", {className: "list-group search-results"}, 
                    li
                  )
                )
              );
            }
        }
    });

    var renderSearchResults = function() {
        // Some pages might not have a search box so we then just abort
        var div = $('#search-results').get(0);
        if( div ) {
            React.render(React.createElement(SearchResults, null), div);
        }
    }
    global.onDocLoad(renderSearchResults);

    function doAjaxSearch(q) {
        var query = '/search?q=' + encodeURIComponent(q);
        var p = $.ajax({
            method: "GET",
            url: query,
            dataType: 'json',
        }).promise();
        return Rx.Observable.fromPromise(p);
    }

}(window,jQuery,React));

