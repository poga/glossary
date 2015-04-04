"use strict";

var App = React.createClass({
    displayName: "App",

    getInitialState: function getInitialState() {
        return { filter: undefined };
    },
    onSelectTag: function onSelectTag(label) {
        this.setState({ filter: label });
    },
    onDeselectTag: function onDeselectTag(label) {
        this.setState({ filter: undefined });
    },
    render: function render() {
        return React.createElement(
            "div",
            { className: "ui segment" },
            React.createElement(Glossary, { filter: this.state.filter, onSelectTag: this.onSelectTag, onDeselectTag: this.onDeselectTag })
        );
    }
});

var Glossary = React.createClass({
    displayName: "Glossary",

    getInitialState: function getInitialState() {
        return { items: [] };
    },
    componentWillMount: function componentWillMount() {
        var _this = this;

        $.getJSON("http://localhost:8000/_/bkuyf7icnz/csv.json", function (it) {
            it.slice(1).forEach(function (x) {
                _this.setState({ items: _this.state.items.concat([x]) });
            });
        });
    },
    render: function render() {
        var _this2 = this;

        var list = this.state.items.map(function (x) {
            var tagStrs = x[2].split(",").map(function (x) {
                return x.trim();
            });
            if (_this2.props.filter !== undefined && tagStrs.indexOf(_this2.props.filter) === -1) {
                return "";
            }
            var tags = tagStrs.map(function (t) {
                return React.createElement(Tag, {
                    label: t,
                    key: t,
                    onSelectTag: _this2.props.onSelectTag,
                    onDeselectTag: _this2.props.onDeselectTag,
                    selected: t === _this2.props.filter });
            });
            return React.createElement(
                "div",
                { className: "item", key: x[0] },
                tags,
                React.createElement("i", { className: "top aligned right triangle icon" }),
                React.createElement(
                    "div",
                    { className: "content" },
                    React.createElement(
                        "a",
                        { className: "header", href: x[3] },
                        x[0]
                    ),
                    React.createElement(
                        "div",
                        { className: "description" },
                        x[1]
                    )
                )
            );
        });
        return React.createElement(
            "div",
            { className: "ui relaxed divided list" },
            list
        );
    }
});

var Tag = React.createClass({
    displayName: "Tag",

    getDefaultProps: function getDefaultProps() {
        return { selected: false };
    },
    render: function render() {
        var handler = this.props.selected ? this.props.onDeselectTag : this.props.onSelectTag;

        return React.createElement(
            "div",
            { className: "right floated compact ui button" + (this.props.selected ? " green" : ""),
                onClick: handler.bind(this, this.props.label) },
            this.props.label
        );
    }
});

React.render(React.createElement(App, null), document.getElementById("main"));
