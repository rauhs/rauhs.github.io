// Ideas:
// Press enter to go to first link?
//
(function(global,$,React) {
    // how many characters need to be entered to actually trigger and display the
    // results.
    var SearchCharThresh = 2;

    var Search = React.createClass({displayName: "Search",
        render: function() {
            var Resp = ex_dat_ieee;
            // Handle pages:
            divs = [];
            for( var i=0; i<Resp.length-1;i++ ){
                var name = _.capitalize(where[i]);
                kork += '/'+where[i];
                divs.push( React.createElement("div", null, React.createElement("a", {href: kork}, name)) );
            }
            divs.push( React.createElement("div", {className: "active"}, last) );
            return (React.createElement("div", {className: "search-results"}, 
                    divs
                    ));
        }
    });

    var renderSearch = function() {
        // Some pages might not have a breadcrumb div so we don't render in this case...
        var div = $('#search').get(0);
        if( div ) {
            React.render(React.createElement(Search, null), div);
        }
    }
    //global.onDocLoad(renderSearch);

    // Handy shortcut
    var lg = console.log.bind(console);

    function doSearch(q) {
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
        // Just for dev purposed. TODO
        console.log("INIT search");
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
            .flatMapLatest(doSearch);

        searchStream.subscribe(function(e) {
            //lg(e);
            if( e.length == 0 ) {
              lg("No search results");
            } else {
              for(i=0; i<Math.min(e.length,5); i++) {
                lg(e[i]._source.url);
              }
            }
        },function(err) {
            lg(err);
        });
    });

}(window,jQuery,React));

