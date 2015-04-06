let ethercalc_host = "https://www.ethercalc.org"
let doc_id = window.location.pathname

let App = React.createClass({
    render() {
        return (<div className="ui segment">
            <Glossary/>
            <div className="ui center aligned basic segment">
                <a href={`${ethercalc_host}${doc_id}`}><div className="ui basic button">Edit</div></a>
            </div>
        </div>)
    }
})

let Glossary = React.createClass({
    getInitialState() {
        return {items: [], filter: undefined}
    },
    onSelectTag(label) {
        this.setState({filter: label})
    },
    onDeselectTag(label) {
        this.setState({filter: undefined})
    },
    componentWillMount() {
        $.getJSON(`${ethercalc_host}/_${doc_id}/csv.json`, (it) => {
            it.slice(1).forEach((x) => {
                this.setState({items: this.state.items.concat([x])})
            })
        })
    },
    render() {
        let list = this.state.items.map((x) => {
            let tagStrs = x[2].split(",").map((x) => { return x.trim() })
            if (this.state.filter !== undefined && tagStrs.indexOf(this.state.filter) === -1) {
                return ""
            }
            let tags = tagStrs.map((t) => {
                return (<Tag
                    label={t}
                    key={t}
                    onSelectTag={this.onSelectTag}
                    onDeselectTag={this.onDeselectTag}
                    selected={t === this.state.filter}/>)
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
        return (<div className="ui relaxed list">{list}</div>)
    }
})

let Tag = React.createClass({
    getDefaultProps() {
        return {selected: false}
    },
    render() {
        let handler = this.props.selected ? this.props.onDeselectTag : this.props.onSelectTag

        return (<div className={"right floated mini compact ui button" + (this.props.selected ? " green" : "")}
            onClick={handler.bind(null, this.props.label)}>
            {this.props.label}
        </div>)
    }
})

React.render(<App />, document.getElementById("main"))
