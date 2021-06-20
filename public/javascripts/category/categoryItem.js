const CSSTransition = ReactTransitionGroup.CSSTransition;

class Item extends React.Component{
    constructor(props){
        super(props);
        this.props = props;
        this.state = {exitAnimation: true, editing:false, showRSSLinks: false, 
            photo:this.props.photo, rss_links:[]}

        this.animTimeout = {itemExit:300}

        this.optionsRef = React.createRef();
        this.photoRef = React.createRef();
        this.mainRef = React.createRef();
    }

    showOptions(){
        let menus = document.getElementsByClassName("hovermenu");
        for(var menu of menus){
            menu.style.display = "none";
        }
        this.optionsRef.current.style.display = "flex";
    }

    delete(){
        httpRequest('DELETE', `http://${localStorage.serverURL}/categories/delete?apikey=fVKHo9QEUQgWXjQ`, JSON.stringify({
            name:this.props.name
        })).then((val)=>{
            this.setState({exitAnimation:false})
        }).catch((err)=>{
            alert("There was an error, please refresh and try again")
        })
        // var req = new XMLHttpRequest();
        // req.open('DELETE', `http://${localStorage.serverURL}/categories/delete?apikey=fVKHo9QEUQgWXjQ`, true);
        // req.setRequestHeader('Content-Type', 'application/json')
        // req.send(JSON.stringify({
        //     name:this.props.name
        // }));
        // req.addEventListener("load", function(){
        //     this.setState({exitAnimation:false})
        // }.bind(this))

        // req.addEventListener("error", function(err){
        //     console.error(error);
        // })
    }

    edit(photo){
        httpRequest('PUT', `http://${localStorage.serverURL}/categories/update?apikey=fVKHo9QEUQgWXjQ`,JSON.stringify({
            category: this.props.name,
            image: photo,
        })).then((val)=>{
            this.setState({editing:false, photo:photo})
        }).catch((err)=>{
            alert("Error in editing, please try again")
        })
        // var req = new XMLHttpRequest();
        // req.open('PUT', `http://${localStorage.serverURL}/categories/update?apikey=fVKHo9QEUQgWXjQ`, true);
        // req.setRequestHeader('Content-Type', 'application/json');
        // req.send(JSON.stringify({
        //     category: this.props.name,
        //     image: photo,
        // }))

        // req.addEventListener("load", function(){
        //     this.setState({editing:false, photo:photo})
        // }.bind(this))
    }

    getRSSFeeds(){
        var req = new XMLHttpRequest();
        req.open('GET', `http://${localStorage.serverURL}/categories/rssfeed?category=${this.props.name}&apikey=fVKHo9QEUQgWXjQ`, true);
        req.send();

        req.addEventListener("load", function(){
            let response = JSON.parse(req.responseText);
            this.setState({showRSSLinks: true, rss_links:response.data});
        }.bind(this))
    }

    dragging(){
        this.props.setDrag(this.props.index);
    }

    dragOver(e){
        if(this.props.getDrag() != -1) this.props.replaceFunc(this.props.index);
    }

    dragEnd(){
        this.props.replaceFunc(-1);
    }

    render(){

        if(this.props.index%2 == 0){
            this.state.itemColor = '#e7eaed';
        }else{
            this.state.itemColor = 'white';
        }

        return (
        <CSSTransition in={this.state.exitAnimation} 
        classNames="itemAnimation" 
        timeout={this.animTimeout.itemExit} 
        onExited={this.props.func}
        >
                {!this.state.editing?<div onDragStart={(event)=>this.dragging(event)} onDragOver={(event)=>this.dragOver(event)} onDragEnd={(event)=>this.dragEnd(event)} draggable={this.props.canDrag}>
                    <div className="item" style={{backgroundColor:this.state.itemColor}}>
                        <div className="attribute">{this.props.index+1}</div>
                        <div className="attribute">{this.props.name}</div>
                        <div className="attribute">{this.state.photo}</div>
                        <div className="iconButton menu" onClick={this.showOptions.bind(this)} style={{position: "relative"}}>
                            <img src="/images/more.svg" style={{width:"50%"}}/>
                            <div className="hovermenu" ref={this.optionsRef}>
                                <div style={{marginBottom: "8px", cursor:"pointer"}} onClick={this.delete.bind(this)}>Delete</div>
                                <div style={{marginBottom: "8px", cursor:"pointer"}} onClick={()=>{this.setState({editing:true})}}>Edit</div>
                                <div style={{cursor:"pointer"}} onClick={()=>{!this.state.showRSSLinks?this.getRSSFeeds():this.setState({showRSSLinks:false})}}>View RSS feeds</div>
                            </div>
                        </div>
                    </div>
                    {
                        !this.state.showRSSLinks?null:
                        <ItemRSS data={this.state.rss_links} name={this.props.name}/>
                    }
                </div>
                :
                <div className="item" style={{backgroundColor:this.state.itemColor}}>
                    <div className="attribute">{this.props.index+1}</div>
                    <div className="attribute">{this.props.name}</div>
                    <div className="attribute"><input type="text" name="photo" defaultValue={this.state.photo} ref={this.photoRef} className="attInput"/></div>
                    <div style={{display:"flex", flexDirection:"column", width:"50px", height:"50px", justifyContent:"space-between"}}>
                        <button onClick={()=>{this.edit(this.photoRef.current.value)}} style={{width:"100%", height:"45%", fontSize:"12px"}}>Done</button>
                        <button onClick={()=>{this.setState({editing:false})}} style={{width:"100%", height:"45%", fontSize:"12px"}}>Cancel</button>
                    </div>
                </div>
                }
            </CSSTransition>
        );
    }
}

class ItemList extends React.Component{
    constructor(props){
        super(props);
        this.props = props;
        this.state = {placeHolder: -1, dragIndex:-1};
    }

    removeFromList(index){
        this.props.data.splice(index, 1);
        this.setState({});
    }

    setDragIndex(index){
        this.setState({dragIndex: index});
    }

    putPlaceholder(index){
        this.setState({placeHolder: index})
    }

    getDragIndex(){
        return this.state.dragIndex;
    }

    sendRequest(method, url, name, priority){
        return new Promise(function(resolve, reject){
            let req = new XMLHttpRequest();
            req.open(method, url, true);
            req.setRequestHeader("Content-Type", "application/json");
            req.onload = function(){
                resolve(req.responseText);
            }

            req.onerror = function(){
                reject({
                    status: req.status
                });
            }

            req.send(JSON.stringify({
                category:name,
                priority:priority,
            }))
        })
    }

    async drop(){
        if(this.state.placeHolder > this.state.dragIndex){
            this.props.data.splice(this.state.placeHolder+1, 0, this.props.data[this.state.dragIndex]);
            this.props.data.splice(this.state.dragIndex, 1);
        }else{
            this.props.data.splice(this.state.placeHolder, 0, this.props.data[this.state.dragIndex]);
            this.props.data.splice(this.state.dragIndex+1, 1);
        }
        for(let i = 0; i < this.props.data.length; i++){
            await this.sendRequest('PUT', `http://${localStorage.serverURL}/categories/update?apikey=fVKHo9QEUQgWXjQ`, this.props.data[i].name, i+1);
        }
        this.setState({placeHolder: -1, dragIndex: -1})
        getCategoryData(false);
    }

    render(){
        const items = [];
        let data = this.props.data;
        for(let i = 0; i < this.props.data.length; i++){
            if(i == this.state.placeHolder && this.state.dragIndex > i){
                items.push(<div style={{height:"66px"}} key="temp" onDragOver={(event)=>event.preventDefault()} onDrop={this.drop.bind(this)}></div>);
            }
            items.push(<Item index={i} name={data[i].name} photo={data[i].image} func={this.removeFromList.bind(this, i)} replaceFunc={this.putPlaceholder.bind(this)} setDrag={this.setDragIndex.bind(this)} canDrag={this.props.canDrag} getDrag={this.getDragIndex.bind(this)} key={data[i].name}/>);
            if(i == this.state.placeHolder && this.state.dragIndex < i){
                items.push(<div style={{height:"66px"}} key="temp" onDragOver={(event)=>event.preventDefault()} onDrop={this.drop.bind(this)}></div>);
            }
        }

        return(<div>{items}</div>)
    }
}
//ReactDOM.render(<Item id={1} email={"hello"} name={"ayush"} phone={"141"} dob={21213} photo={"fwwe"} style={{backgroundColor:"white"}} func={()=>{console.log("heelo")}}/>, document.getElementById("test"))