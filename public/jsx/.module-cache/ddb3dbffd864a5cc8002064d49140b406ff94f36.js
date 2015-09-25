var BreadCrumb = React.createClass({displayName: "BreadCrumb",
render: function() {
  var Sections = window.HugoSections;
  // Handle pages:
  var path = window.location.pathname.replace(/(page)\/(\d+)/, '$1 $2');
  var where = _.compact(path.split('/'));
  var li = [];
  var kork = "";
  for( var i=0; i<where.length-1;i++ ){
    var name = _.capitalize(where[i]);
    kork += '/'+where[i];
    li.push( React.createElement("li", null, React.createElement("a", {href: kork}, name)) );
  }
  var last = _.capitalize(where[where.length-1]);
  li.push( React.createElement("li", {className: "active"}, last) );
  return (
    React.createElement("ol", {className: "breadcrumb"}, 
      React.createElement("li", null, React.createElement("a", {href: "/"}, "Home")), 
      li
    )
  );
}
});
var renderBread = function() {
  React.render(React.createElement(BreadCrumb, null), document.getElementById('breadcrumb')); 
}
InstantClick.on('change', renderBread);
renderBread();

