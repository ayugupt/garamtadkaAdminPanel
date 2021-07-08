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
        httpRequest('PUT', `${localStorage.http}://${localStorage.serverURL}/categories/update?apikey=fVKHo9QEUQgWXjQ`, JSON.stringify({category:this.props.id,
            rss_feeds: [this.linkRef.current.value], notifications: [this.linkNotifRef.current.value]})).then((val)=>{
                this.state.rss_links.push({
                    rss_link:this.linkRef.current.value,
                    category_id:this.props.id,
                    notification: this.linkNotifRef.current.value
                })
                this.linkRef.current.value = "";
                this.linkNotifRef.current.value = "0";
                this.setState({})
            }).catch((err)=>{
                alert("error in adding link, please refresh and try again");
                console.log(err);
            })
    }

    updateRSSLink(index, e){
        httpRequest('PUT', `${localStorage.http}://${localStorage.serverURL}/categories/rssfeed/update?apikey=fVKHo9QEUQgWXjQ`, JSON.stringify({
            category: this.props.id,
            link: this.state.rss_links[index]['rss_link'],
            notification:e.target.value
        })).then((val)=>{
            console.log(e);
            this.state.rss_links[index].notification = e.target.value;
        }).catch((error)=>{
            e.target.value = this.state.rss_links[index].notification;
            alert("There was an error, Please try again");
            console.log(error);
        })
    }

    deleteRSSLink(link, index){
        httpRequest('DELETE', `${localStorage.http}://${localStorage.serverURL}/categories/rssfeed/delete?apikey=fVKHo9QEUQgWXjQ`, JSON.stringify({
            category: this.props.id, 
            link: link
        })).then((val)=>{
            this.state.rss_links.splice(index, 1);
            this.setState({})
        }).catch((error)=>{
            alert("There was an error, Please try again");
            console.log(error);
        })
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