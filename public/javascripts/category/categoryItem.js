const CSSTransition = ReactTransitionGroup.CSSTransition;

class ItemFromTemplate extends ItemTemplate{
    constructor(props){
        super(props);

        this.state.rss_links = [];
    }

    deleteItem(){
        httpRequest('DELETE', `${localStorage.http}://${localStorage.serverURL}/categories/delete?apikey=fVKHo9QEUQgWXjQ`, JSON.stringify({
            category:this.props.staticAttributes.id
        })).then((val)=>{
            this.setState({exitAnimation:false})
        }).catch((err)=>{
            alert("There was an error, please refresh and try again")
            console.log(err);
        })
    }

    editItem(values){
        httpRequest('PUT', `${localStorage.http}://${localStorage.serverURL}/categories/update?apikey=fVKHo9QEUQgWXjQ`,JSON.stringify({
            category: this.props.staticAttributes.id,
            image: values.photo,
        })).then((val)=>{
            values.editing = false;
            this.setState(values)
        }).catch((err)=>{
            alert("Error in editing, please try again")
            console.log(err)
        })
    }

    getAdditionalInfo(){
        httpRequest('GET', `${localStorage.http}://${localStorage.serverURL}/categories/rssfeed?category=${this.props.staticAttributes.id}&apikey=fVKHo9QEUQgWXjQ`).then((val)=>{
            this.setState({showAdditionalInfo: true, rss_links: val.data})
        }).catch((err)=>{
            alert(`There was an error ${err.message}. Please try again`)
            console.log(err);
        })
    }

    dragging(){
        this.props.setDrag(this.props.staticAttributes.index);
    }

    dragOver(e){
        if(this.props.getDrag() != -1) this.props.replaceFunc(this.props.staticAttributes.index);
    }

    dragEnd(){
        this.props.replaceFunc(-1);
    }

    render(){
        
        this.reRenderComponents();

        return <CSSTransition in={this.state.exitAnimation} 
        classNames="itemAnimation" 
        timeout={this.animTimeout.itemExit} 
        onExited={this.props.func}
        >
                {!this.state.editing?<div onDragStart={(event)=>this.dragging(event)} onDragOver={(event)=>this.dragOver(event)} onDragEnd={(event)=>this.dragEnd(event)} draggable={this.props.canDrag}>
                    {
                        this.mainItem
                    }
                    {
                        !this.state.showAdditionalInfo?null:
                        <ItemRSS data={this.state.rss_links} id={this.props.staticAttributes.id}/>
                    }
                </div>
                :this.editableItem
                }
            </CSSTransition>
    }
}

class ItemListFromTemplate extends ItemListTemplate{
    constructor(props){
        super(props);
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

    async drop(){
        if(this.state.placeHolder > this.state.dragIndex){
            this.props.data.splice(this.state.placeHolder+1, 0, this.props.data[this.state.dragIndex]);
            this.props.data.splice(this.state.dragIndex, 1);
        }else{
            this.props.data.splice(this.state.placeHolder, 0, this.props.data[this.state.dragIndex]);
            this.props.data.splice(this.state.dragIndex+1, 1);
        }
        for(let i = 0; i < this.props.data.length; i++){
            await httpRequest('PUT', `${localStorage.http}://${localStorage.serverURL}/categories/update?apikey=fVKHo9QEUQgWXjQ`, JSON.stringify({
                category:this.props.data[i].id,
                priority:i+1
            }));
        }
        this.setState({placeHolder: -1, dragIndex: -1})
        getCategoryData(false, document.getElementById("languageSelect").value);
    }

    render(){
        const items = [];
        let data = this.props.data;
        for(let i = 0; i < this.props.data.length; i++){
            if(i == this.state.placeHolder && this.state.dragIndex > i){
                items.push(<div style={{height:"66px"}} key="temp" onDragOver={(event)=>event.preventDefault()} onDrop={this.drop.bind(this)}></div>);
            }
            items.push(<ItemFromTemplate staticAttributes={{index:i, name:data[i].name, id:data[i].id}} editableAttributes={{photo:data[i].image}} func={this.removeFromList.bind(this, i)} replaceFunc={this.putPlaceholder.bind(this)} setDrag={this.setDragIndex.bind(this)} getDrag={this.getDragIndex.bind(this)} canDrag={this.props.canDrag} key={data[i].name}/>);
            if(i == this.state.placeHolder && this.state.dragIndex < i){
                items.push(<div style={{height:"66px"}} key="temp" onDragOver={(event)=>event.preventDefault()} onDrop={this.drop.bind(this)}></div>);
            }
        }

        return(<div>{items}</div>)
    }
}
//ReactDOM.render(<Item id={1} email={"hello"} name={"ayush"} phone={"141"} dob={21213} photo={"fwwe"} style={{backgroundColor:"white"}} func={()=>{console.log("heelo")}}/>, document.getElementById("test"))