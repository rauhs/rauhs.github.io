window.Counter = React.createClass({displayName: "Counter",
    getInitialState: function() {
        return {counter: 0};
    },
    increment: function() {
        this.setState({ counter: this.state.counter+1 });
    },
    render: function() {
        return React.createElement("div", null, 
            React.createElement("span", null, this.state.counter, " "), 
            React.createElement("button", {type: "button", className: "btn btn-success", 
              onClick: this.increment}, "Increment!")
        );
    }
});

