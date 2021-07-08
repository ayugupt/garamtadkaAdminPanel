const CSSTransition = ReactTransitionGroup.CSSTransition;

class LanguageItem extends ItemTemplate{
    constructor(props){
        super(props);
    }

    deleteItem(){
        httpRequest('DELETE', `${localStorage.http}://${localStorage.serverURL}/language/delete?apikey=fVKHo9QEUQgWXjQ`, JSON.stringify({
            language_id:this.props.staticAttributes.id
        })).then((val)=>{
            this.setState({exitAnimation:false})
        }).catch((err)=>{
            alert("There was an error, please refresh and try again")
            console.log(err);
        })
    }

    editItem(values){
        httpRequest('PUT', `${localStorage.http}://${localStorage.serverURL}/language/update?apikey=fVKHo9QEUQgWXjQ`,JSON.stringify({
            language_id: this.props.staticAttributes.id,
            name_english: values.name_english,
            name_native: values.name_native,
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
        
    }

    render(){
        this.reRenderComponents();

        return <CSSTransition in={this.state.exitAnimation} 
        classNames="itemAnimation" 
        timeout={this.animTimeout.itemExit} 
        onExited={this.props.func}
        >
                {!this.state.editing?this.mainItem
                :this.editableItem
                }
            </CSSTransition>
    }
}

class LanguageItemList extends ItemListTemplate{
    constructor(props){
        super(props);
    }

    removeFromList(index){
        this.props.data.splice(index, 1);
    }

    render(){
        return (<div>
            {
                this.props.data.map((val, index)=>{
                    return <LanguageItem staticAttributes={{index: index, id:val.id}} editableAttributes={{name_english:val.name_english, name_native:val.name_native, photo:val.image}} func={this.removeFromList.bind(this, index)} key={val.id}/>
                })
            }
        </div>)
    }
}