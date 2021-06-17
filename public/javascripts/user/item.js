const CSSTransition = ReactTransitionGroup.CSSTransition;

class Item extends React.Component{
    constructor(props){
        super(props);
        this.props = props;
        this.state = {exitAnimation: true, editing:false, subAnimation: false, 
            name:this.props.name, phone:this.props.phone, dob:this.props.dob, photo:this.props.photo, bookmarks:[]}

        this.itemColor = "white";
        if(this.props.index%2 == 0){
            this.itemColor = "lightgray";
        }
        this.state.itemColor = this.itemColor;

        this.animTimeout = {itemExit:300, subAppear: 300}

        this.optionsRef = React.createRef();
        this.nameRef = React.createRef();
        this.phoneRef = React.createRef();
        this.dobRef = React.createRef();
        this.photoRef = React.createRef();
    }

    showOptions(){
        let menus = document.getElementsByClassName("hovermenu");
        for(var menu of menus){
            menu.style.display = "none";
        }
        this.optionsRef.current.style.display = "flex";
    }

    delete(){
        var req = new XMLHttpRequest();
        req.open('DELETE', `http://${localStorage.serverURL}/user/deleteUser?apikey=fVKHo9QEUQgWXjQ`, true);
        req.setRequestHeader('Content-Type', 'application/json')
        req.send(JSON.stringify({
            user:this.props.id
        }));
        req.addEventListener("load", function(){
            this.setState({exitAnimation:false})
        }.bind(this))

        req.addEventListener("error", function(err){
            console.error(error);
        })
    }

    edit(email, name, phone, dob, photo){
        var req = new XMLHttpRequest();
        req.open('PUT', `http://${localStorage.serverURL}/user/updateUser/email?apikey=fVKHo9QEUQgWXjQ`, true);
        req.setRequestHeader("Content-Type", "application/json");
        req.send(JSON.stringify({
            email: email,
            name:name,
            phone:phone,
            dob:dob,
            image:photo
        }))

        req.addEventListener("load", function(){
            this.setState({editing:false, name:name, phone:phone, dob:dob, photo:photo})
        }.bind(this))
    }

    getBookmarks(){
        var req = new XMLHttpRequest();
        req.open('GET', `http://${localStorage.serverURL}/user/getBookmarked?user=${this.props.id}&apikey=fVKHo9QEUQgWXjQ`, true);
        req.send();

        req.addEventListener("load", function(){
            let response = JSON.parse(req.responseText);
            this.setState({subAnimation: true, bookmarks:response.data});
        }.bind(this))
    }


    render(){
        return (
        <CSSTransition in={this.state.exitAnimation} 
        classNames="itemAnimation" 
        timeout={this.animTimeout.itemExit} 
        onExited={this.props.func}
        >
                {!this.state.editing?<div>
                    <div className="item" style={{backgroundColor:this.state.itemColor}}>
                        <div className="attribute">{this.props.index+1}</div>
                        <div className="attribute">{this.props.id}</div>
                        <div className="attribute">{this.props.email}</div>
                        <div className="attribute">{this.state.name}</div>
                        <div className="attribute">{this.state.phone}</div>
                        <div className="attribute">{this.state.dob}</div>
                        <div className="attribute">{this.state.photo}</div>
                        <div className="iconButton menu" onClick={this.showOptions.bind(this)} style={{position: "relative"}}>
                            <img src="/images/more.svg" style={{width:"50%"}}/>
                            <div className="hovermenu" ref={this.optionsRef}>
                                <div style={{marginBottom: "8px", cursor:"pointer"}} onClick={this.delete.bind(this)}>Delete</div>
                                <div style={{marginBottom: "8px", cursor:"pointer"}} onClick={()=>{this.setState({editing:true})}}>Edit</div>
                                <div style={{cursor:"pointer"}} onClick={()=>{!this.state.subAnimation?this.getBookmarks():this.setState({subAnimation:false})}}>View Bookmarks</div>
                            </div>
                        </div>
                    </div>
                    {
                        !this.state.subAnimation?null:
                        this.state.bookmarks.map((value, index)=>{
                            return (<CSSTransition in={this.state.subAnimation}
                                appear={true}
                                enter={false}
                                classNames="subAnimation"
                                timeout={this.animTimeout.subAppear}
                                key={value.title}
                                >
                                    <div className="item">
                                        <div className="attribute">{value.title}</div>
                                        <div className="attribute">{value.link}</div>
                                    </div>
                                </CSSTransition>);
                        })
                    }
                </div>
                :
                <div className="item" style={{backgroundColor:this.state.itemColor}}>
                    <div className="attribute">{this.props.index+1}</div>
                    <div className="attribute">{this.props.id}</div>
                    <div className="attribute">{this.props.email}</div>
                    <div className="attribute"><input type="text" name="name" defaultValue={this.state.name} ref={this.nameRef} className="attInput"/></div>
                    <div className="attribute"><input type="text" name="phone" defaultValue={this.state.phone} ref={this.phoneRef} className="attInput"/></div>
                    <div className="attribute"><input type="text" name="dob" defaultValue={this.state.dob} ref={this.dobRef} className="attInput"/></div>
                    <div className="attribute"><input type="text" name="photo" defaultValue={this.state.photo} ref={this.photoRef} className="attInput"/></div>
                    <div style={{display:"flex", flexDirection:"column", width:"50px", height:"50px", justifyContent:"space-between"}}>
                        <button onClick={()=>{this.edit(this.props.email, this.nameRef.current.value, this.phoneRef.current.value, this.dobRef.current.value, this.photoRef.current.value)}} style={{width:"100%", height:"45%", fontSize:"12px"}}>Done</button>
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
        this.state = {};
    }

    removeFromList(index){
        this.props.userData.splice(index, 1);
        this.setState({});
    }

    render(){
        return(<div>{this.props.userData.map(function(user, index){
            return <Item index={index} id={user.id} email={user.email} name={user.name} phone={user.phone} dob={user.dob} photo={user.photo} func={this.removeFromList.bind(this, index)} key={user.id}/>
        }.bind(this))}</div>)
    }
}
//ReactDOM.render(<Item id={1} email={"hello"} name={"ayush"} phone={"141"} dob={21213} photo={"fwwe"} style={{backgroundColor:"white"}} func={()=>{console.log("heelo")}}/>, document.getElementById("test"))