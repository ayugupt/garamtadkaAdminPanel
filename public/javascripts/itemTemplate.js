class ItemTemplate extends React.Component{
    constructor(props){

        super(props);
        if(this.constructor == ItemTemplate){
            throw new Error("Abstract class can't be instantiated");
        }

        this.props = props;
        this.animTimeout = {itemExit:300}
        this.state = {exitAnimation: true, editing: false, showAdditionalInfo: false}
        this.editRefs = {};
        this.optionsRef = React.createRef();

        for(var editAtts in this.props.editableAttributes){
            this.editRefs[editAtts] = React.createRef();
            this.state[editAtts] = this.props.editableAttributes[editAtts]
        }

        this.mainItem = null;
        this.editableItem = null;

    }

    reRenderComponents(){
        if(this.props.staticAttributes.index%2 == 0){
            this.state.itemColor = '#e7eaed';
        }else{
            this.state.itemColor = 'white';
        }

        let staticAttributes = [];
        for(var staticAtt in this.props.staticAttributes){
            if(staticAtt == 'index'){
                staticAttributes.push(<div className="attribute" key={staticAtt}>{this.props.staticAttributes[staticAtt]+1}</div>)
            }else{
                staticAttributes.push(<div className="attribute" key={staticAtt}>{this.props.staticAttributes[staticAtt]}</div>)
            }
        }

        let editableAttributes = [];
        let inputAttributes = [];

        for(var editableAtt in this.props.editableAttributes){
            editableAttributes.push(<div className="attribute" key={editableAtt}>{this.state[editableAtt]}</div>)
            inputAttributes.push(<div className="attribute" key={editableAtt}><input type="text" name={editableAtt} defaultValue={this.state[editableAtt]} ref={this.editRefs[editableAtt]} className="attInput"/></div>)
        }
        
        this.mainItem = <div className="item" style={{backgroundColor:this.state.itemColor}}>
                            {staticAttributes}
                            {editableAttributes}
                            <div className="iconButton menu" onClick={this.showOptions.bind(this)} style={{position: "relative"}}>
                                <img src="/images/more.svg" style={{width:"50%"}}/>
                                <div className="hovermenu" ref={this.optionsRef}>
                                    <div style={{marginBottom: "8px", cursor:"pointer"}} onClick={this.deleteItem.bind(this)}>Delete</div>
                                    <div style={{marginBottom: "8px", cursor:"pointer"}} onClick={()=>{this.setState({editing:true})}}>Edit</div>
                                    <div style={{cursor:"pointer"}} onClick={()=>{!this.state.showAdditionalInfo?this.getAdditionalInfo():this.setState({showAdditionalInfo:false})}}>View RSS feeds</div>
                                </div>
                            </div>
                        </div>

        this.editableItem = <div className="item" style={{backgroundColor:this.state.itemColor}}>
                                {staticAttributes}
                                {inputAttributes}
                                <div style={{display:"flex", flexDirection:"column", width:"50px", height:"50px", justifyContent:"space-between"}}>
                                    <button onClick={()=>{let inputValues = {};
                                                    for(var editableAtt in this.props.editableAttributes){
                                                        inputValues[editableAtt] = this.editRefs[editableAtt].current.value;
                                                    } this.editItem(inputValues);}}
                                         style={{width:"100%", height:"45%", fontSize:"12px"}}>Done</button>
                                    <button onClick={()=>{this.setState({editing:false})}} style={{width:"100%", height:"45%", fontSize:"12px"}}>Cancel</button>
                                </div>
                            </div>
    }

    showOptions(){
        let menus = document.getElementsByClassName("hovermenu");
        for(var menu of menus){
            menu.style.display = "none";
        }
        this.optionsRef.current.style.display = "flex";
    }

    deleteItem(){
        throw new Error("Method deleteItem not implemented")
    }

    editItem(){
        throw new Error("Method editItem not implemented");
    }

    getAdditionalInfo(){
        throw new Error("Method getAdditionalInfo not implemented");
    }
}

class ItemListTemplate extends React.Component{
    constructor(props){
        super(props);
        if(this.constructor == ItemListTemplate){
            throw new Error("Abstract class ItemListTemplate can't be instantiated")
        }
        this.props = props;
    }

    removeFromList(){
        throw new Error("Method removeFromList has not been implemented")
    }

}