// Ideas:
//
// Press enter to go to first link?
//
// Classes: hide-on-search  show-on-search
// IDs: #search-results
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
          var $input = $("#search");
          $input.prop('disabled',false);

          var keyEvent = Rx.Observable.fromEvent(document, 'keydown');
          var abortSearch = keyEvent.filter(function(e) {
            console.log(e);
            return e.which == 27;
          });
          abortSearch.subscribe(function() {
            that.setState( {ActiveSearch: false} );
          });
          //var gotoFirstResult = keyEvent

          var searchStream = Rx.Observable.fromEvent($input, 'input')
              .map(function(e) {
                  return e.target.value;
              })
              .map(function(text) {
                  console.log("Search: "+text);
                  // TODO: Display/hide results when <2 charaters.
                  return text;
              })
              .filter(function(text) {
                  return text.length >= SearchCharThresh;
              })
              .debounce(10) //ms
              .distinctUntilChanged()
              .flatMapLatest(doAjaxSearch);

          searchStream.subscribe(function(e) {
              if( e.length == 0 ) {
                that.setState( {ActiveSearch: true, Results: [] } );
              } else {
                that.setState( {ActiveSearch: true, Results: e} );
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
                li.push( React.createElement("li", null, React.createElement("a", {href: r._source.url}, r._source.title)) );
            }
            return (React.createElement("ul", {className: "search-results"}, 
                      li
                    ));
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

