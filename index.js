"use strict";

var ethercalc_host = "https://www.ethercalc.org";
var doc_id = window.location.pathname;

var App = React.createClass({
    displayName: "App",

    render: function render() {
        return React.createElement(
            "div",
            { className: "ui segment" },
            React.createElement(Glossary, null),
            React.createElement(
                "div",
                { className: "ui center aligned basic segment" },
                React.createElement(
                    "a",
                    { href: "" + ethercalc_host + "" + doc_id },
                    React.createElement(
                        "div",
                        { className: "ui basic button" },
                        "Edit"
                    )
                )
            )
        );
    }
});

var Glossary = React.createClass({
    displayName: "Glossary",

    getInitialState: function getInitialState() {
        return { items: [], filter: undefined };
    },
    onSelectTag: function onSelectTag(label) {
        this.setState({ filter: label });
    },
    onDeselectTag: function onDeselectTag(label) {
        this.setState({ filter: undefined });
    },
    componentWillMount: function componentWillMount() {
        var _this = this;

        $.getJSON("" + ethercalc_host + "/_" + doc_id + "/csv.json", function (it) {
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
            if (_this2.state.filter !== undefined && tagStrs.indexOf(_this2.state.filter) === -1) {
                return "";
            }
            var tags = tagStrs.map(function (t) {
                return React.createElement(Tag, {
                    label: t,
                    key: t,
                    onSelectTag: _this2.onSelectTag,
                    onDeselectTag: _this2.onDeselectTag,
                    selected: t === _this2.state.filter });
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
            { className: "ui relaxed list" },
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
                onClick: handler.bind(null, this.props.label) },
            this.props.label
        );
    }
});

React.render(React.createElement(App, null), document.getElementById("main"));
