(function(global,$,React) {

var ex_dat_ieee = [{
    "_score": 0.035297118,
    "_index": "webindex",
    "_id": "AU1FBvnxsredhD-ZnjNA",
    "_type": "my_web",
    "_source": {
      "executionTime": 2,
      "httpStatusCode": 200,
      "charSet": "UTF-8",
      "url": "http:\/\/128.4.12.128:1313\/academic\/groups\/",
      "contentLength": 7684,
      "title": "Academic Student\nGroups \u00b7\nECE\/CIS",
      "method": "GET",
      "documentation-html": "",
      "body": [
        "Groups Currently\nthe following user groups are available: LUG - Linux Users Group IEEE -\nInstitute of Electrical and Electronics Engineers ACM - sociation for Computing\nMachine"
      ],
      "documentation": "",
      "mimeType": "text\/html",
      "body-html": [
        "<h2\nid=\"groups:bc0d531e0de5db411b54e3b9910946f8\">Groups<\/h2> \n<p>Currently the\nfollowing user groups are available:<\/p> \n<ul> \n <li><a\nhref=\"http:\/\/www.lug.udel.edu\/\">LUG<\/a> - Linux Users Group<\/li> \n\n<li><a href=\"http:\/\/www.ecl.udel.edu\/~ieee\/\">IEEE<\/a> - Institute of\nElectrical and Electronics Engineers<\/li> \n <li><a\nhref=\"http:\/\/www.acad.cis.udel.edu\/~acm\/\">ACM<\/a> - sociation for\nComputing Machine<\/li>\n\n<\/ul>"
      ],
      "parentUrl": "http:\/\/128.4.12.128:1313\/academic\/",
      "@timestamp": "2015-05-11T22:09:54.673Z",
      "lastModified": "2015-05-11T22:01:54.000Z"
    }
  }
]; 

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
  return (
    React.createElement("div", {className: "search-results"}, 
      divs
    )
  );
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

////////////////////////////////////////////////////////////////////////////////
global.onDocLoad(function() {
  // Just for dev purposed. TODO
  var $input = $("#search");
  $input.prop('disabled',false);

  var keyups = Rx.Observable.fromEvent($input, 'keyup')
  .map(function(e) {
      console.log(e.target.value);
      return 0;
    });

});

}(window,jQuery,React));

