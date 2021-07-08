const CSSTransition = ReactTransitionGroup.CSSTransition;

class UserItem extends ItemTemplate{
    constructor(props){
        super(props)
        this.state.bookmarks = [];
    }

    deleteItem(){
        httpRequest('DELETE', `${localStorage.http}://${localStorage.serverURL}/user/deleteUser?apikey=fVKHo9QEUQgWXjQ`, JSON.stringify({
            user: this.props.staticAttributes.id
        })).then((val)=>{
            this.setState({exitAnimation:false})
        }).catch((error)=>{
            alert("There was an error in deleting user, please try again" + error)
        })
    }

    editItem(values){
        httpRequest('PUT', `${localStorage.http}://${localStorage.serverURL}/user/updateUser/email?apikey=fVKHo9QEUQgWXjQ`, JSON.stringify({
            email: values.email,
            name: values.name,
            phone: values.phone,
            dob: values.dob,
            image: values.photo
        })).then((val)=>{
            values.editing = false;
            this.setState(values);
        }).catch((error)=>{
            alert("There was an error in editing data, please try again" + error)
        })
    }

    getAdditionalInfo(){
        httpRequest('GET', `${localStorage.http}://${localStorage.serverURL}/user/getBookmarked?user=${this.props.staticAttributes.id}&apikey=fVKHo9QEUQgWXjQ`).then((val)=>{
            this.setState({subAnimation: true, bookmarks:val.data});
        }).catch((error)=>{
            alert("There was an error in getting bookmarks, please try again")
        })
    }

    render(){
        this.reRenderComponents();

        return <CSSTransition in={this.state.exitAnimation} 
        classNames="itemAnimation" 
        timeout={this.animTimeout.itemExit} 
        onExited={this.props.func}
        >
                {!this.state.editing?<div>
                    {
                        this.mainItem
                    }
                    {
                        !this.state.showAdditionalInfo?null:
                        this.state.bookmarks.map((value, index)=>{
                            return (<CSSTransition in={this.state.showAdditionalInfo}
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
                :this.editableItem
                }
            </CSSTransition>
    }
}

class UserItemList extends ItemListTemplate{
    constructor(props){
        super(props)
    }

    removeFromList(index){
        this.props.userData.splice(index, 1);
    }

    render(){
        return(<div>{this.props.userData.map(function(user, index){
            return <UserItem staticAttributes={{index:index, id:user.id}} editableAttributes={{email:user.email, name:user.name, phone:user.phone, dob:user.dob, photo:user.photo}} func={this.removeFromList.bind(this, index)} key={user.id}/>
        }.bind(this))}</div>)
    }
}