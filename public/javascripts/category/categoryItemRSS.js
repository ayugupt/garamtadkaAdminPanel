const CSSTransition = ReactTransitionGroup.CSSTransition;

class ItemRSS extends React.Component{
    constructor(props){
        super(props);
        this.props = props;
        this.state = {rss_links: this.props.data, subAnimation: true}

        this.animTimeout = {appear: 300}

        this.linkRef = React.createRef();
        this.linkNotifRef = React.createRef();
    }

    addRSSLink(){
        var req = new XMLHttpRequest();
        req.open('PUT', `http://${localStorage.serverURL}/categories/update?apikey=fVKHo9QEUQgWXjQ`, true);
        req.setRequestHeader("Content-Type", "application/json");
        req.send(JSON.stringify({
            category:this.props.name,
            rss_feeds:[this.linkRef.current.value],
            notifications: [this.linkNotifRef.current.value]
        }))

        req.addEventListener("load", function(){
            console.log(req.response)
            this.state.rss_links.push({
                rss_link:this.linkRef.current.value,
                category_name:this.props.name,
                notification: this.linkNotifRef.current.value
            })
            this.linkRef.current.value = "";
            this.linkNotifRef.current.value = "0";
            this.setState({})
        }.bind(this))

    }

    updateRSSLink(index, e){
        var req = new XMLHttpRequest();
        req.open('PUT', `http://${localStorage.serverURL}/categories/rssfeed/update?apikey=fVKHo9QEUQgWXjQ`)
        req.setRequestHeader("Content-Type", "application/json");
        req.send(JSON.stringify({
            category: this.props.name,
            link: this.state.rss_links[index]['rss_link'],
            notification:e.currentTarget.value
        }))

        let ele = e.currentTarget;

        req.addEventListener("load", function(){
            this.state.rss_links[index].notification = ele.value;
        }.bind(this))

        req.addEventListener("error", function(){
            ele.value = this.state.rss_links[index].notification;
        }.bind(this))
    }

    deleteRSSLink(link, index){
        var req = new XMLHttpRequest();
        req.open('DELETE', `http://${localStorage.serverURL}/categories/rssfeed/delete?apikey=fVKHo9QEUQgWXjQ`);
        req.setRequestHeader("Content-Type", "application/json");
        req.send(JSON.stringify({
            category: this.props.name, 
            link: link
        }))

        req.addEventListener("load", function(){
            this.state.rss_links.splice(index, 1);
            this.setState({})
        }.bind(this))
    }

    render(){
        let rssItems = this.props.data.map((value, index)=>{
            return (<CSSTransition in={this.state.subAnimation}
                appear={true}
                enter={false}
                classNames="subAnimation"
                timeout={this.animTimeout.appear}
                key={value['rss_link']}
                >
                    <div className="item">
                        <div className="attribute">{value['rss_link']}</div>
                        <select className="attSelect" onChange={this.updateRSSLink.bind(this, index)} defaultValue={this.state.rss_links[index].notification}>
                            <option value="0">No Notifications</option>
                            <option value="1">Subscribers only</option>
                            <option value="2">All</option>
                        </select>
                        <div className="att attDelete" onClick={this.deleteRSSLink.bind(this, value['rss_link'], index)}>Delete</div>
                    </div>
                </CSSTransition>);
        })

        rssItems.push(<CSSTransition in={this.state.subAnimation}
            appear={true}
            enter={false}
            classNames="subAnimation"
            timeout={this.animTimeout.appear}
            key="addRss"
            >
        <div className="item">
        <div className="attribute">
            <input type="text" className="attInput" ref={this.linkRef}></input>
        </div>
        <select className="attSelect" ref={this.linkNotifRef}>
            <option value="0">No Notifications</option>
            <option value="1">Subscribers Only</option>
            <option value="2">All</option>
        </select>
        <div className="att attAdd" onClick={this.addRSSLink.bind(this)}>Add</div>

        </div></CSSTransition>);

        return(<div>{
            rssItems
        }</div>)
    }
}