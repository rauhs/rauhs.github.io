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
          return { Results: [] };
        },

        componentWillMount: function() {
          var that = this;
          var $input = $("#search");
          $input.prop('disabled',false);

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
                console.log("No search results");
              } else {
                //console.group("Results:");
                for(i=0; i<Math.min(e.length,10); i++) {
                  //console.log("Score "+e[i]._score +" " + e[i]._source.url);
                }
                that.setState( {Results: e} );
                $(".show-on-search").show();
                //console.groupEnd();
              }
          },function(err) {
              console.log(err);
          });
        },

        // Renders the actual search results
        render: function() {
            var li = []; // LI dom items
            for( var i=0; i < this.state.Results.length; i++ ){
                var r = this.state.Results[i];
                li.push( React.createElement("li", null, React.createElement("a", {href: r.url}, r.title)) );
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

    ////////////////////////////////////////////////////////////////////////////////
    global.onDocLoad(function() {
    });

}(window,jQuery,React));

