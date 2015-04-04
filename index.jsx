let App = React.createClass({
    getInitialState() {
        return {filter: undefined }
    },
    onSelectTag(label) {
        this.setState({filter: label})
    },
    onDeselectTag(label) {
        this.setState({filter: undefined})
    },
    render() {
        return (<div className="ui segment">
            <Glossary filter={this.state.filter} onSelectTag={this.onSelectTag} onDeselectTag={this.onDeselectTag}/>
        </div>)
    }
})

let Glossary = React.createClass({
    getInitialState() {
        return {items: []}
    },
    componentWillMount() {
        $.getJSON("http://localhost:8000/_/bkuyf7icnz/csv.json", (it) => {
            it.slice(1).forEach((x) => {
                this.setState({items: this.state.items.concat([x])})
            })
        })
    },
    render() {
        let list = this.state.items.map((x) => {
            let tagStrs = x[2].split(",").map((x) => { return x.trim() })
            if (this.props.filter !== undefined && tagStrs.indexOf(this.props.filter) === -1) {
                return ""
            }
            let tags = tagStrs.map((t) => {
                return (<Tag
                    label={t}
                    key={t}
                    onSelectTag={this.props.onSelectTag}
                    onDeselectTag={this.props.onDeselectTag}
                    selected={t === this.props.filter}/>)
            })
            return (<div className="item" key={x[0]}>
                        {tags}
                        <i className="top aligned right triangle icon"></i>
                        <div className="content">
                            <a className="header" href={x[3]}>{x[0]}</a>
                            <div className="description">{x[1]}</div>
                        </div>
                    </div>)
        })
        return (<div className="ui relaxed divided list">{list}</div>)
    }
})

let Tag = React.createClass({
    getDefaultProps() {
        return {selected: false}
    },
    render() {
        let handler = this.props.selected ? this.props.onDeselectTag : this.props.onSelectTag

        return (<div className={"right floated compact ui button" + (this.props.selected ? " green" : "")}
            onClick={handler.bind(this, this.props.label)}>
            {this.props.label}
        </div>)
    }
})

React.render(<App />, document.getElementById("main"))
