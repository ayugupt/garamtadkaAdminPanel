class Cell extends React.Component{
    constructor(props){
        super(props);
        this.props = props;

        this.state = {editing:false, value:this.props.value}
        this.valueRef = React.createRef();
    }

    editValue(){
        httpRequest('PUT', `${localStorage.http}://${localStorage.serverURL}/variable/values/update?apikey=fVKHo9QEUQgWXjQ`, JSON.stringify({
            variable_id:this.props.variable_id,
            language_id:this.props.language_id,
            value:this.valueRef.current.value
        })).then((val)=>{
            this.setState({value:this.valueRef.current.value, editing:false})
        }).catch((error)=>{
            alert("There was an error in changing value, please try again. " + error.error);
            this.setState({editing:false})
            console.error(error);
        })
    }

    render(){
        return (<div className="cell">
            {
                !this.state.editing?<div style={{width:"80%"}}>{this.state.value}</div>:<input type="text" ref={this.valueRef} defaultValue={this.state.value} className="valueInput"></input>
            }
            <button className="valueEditButton" onClick={()=>{!this.state.editing?this.setState({editing:true}):this.editValue.call(this)}}>{!this.state.editing?"Edit":"Done"}</button>
        </div>)
    }
}

class VariableTable extends React.Component{
    constructor(props){
        super(props);
        this.props = props;
    }

    render(){
        var variableHeaderCells = [];
        variableHeaderCells.push(<div className="cell" key="variable_fill_box"></div>);
        for(var val of this.props.variables){
            variableHeaderCells.push(<div className="cell header left" key={"variable_"+val.id}>{val.name}</div>);
        }

        var variableValues = [];
        variableValues.push(<div className="valueRow" key="language headers">{
            this.props.languages.map((val)=>{
                return <div className="cell header top" key={"lang_"+val.id}>{val.name_english}</div>
            })
        }</div>)
        for(var variable of this.props.variables){
            let listOfCells = [];
            for(var lang of this.props.languages){
                let va = null;
                for(let i = 0; i < this.props.variableValues.length; i++){
                    if(this.props.variableValues[i].variable_id == variable.id && this.props.variableValues[i].language_id == lang.id){
                        va = this.props.variableValues[i].value;
                        break;
                    }
                }
                listOfCells.push(<Cell language_id={lang.id} variable_id={variable.id} value={va} key={lang.id+"_"+variable.id}/>)
            }
            let rowOfValues = <div className="valueRow" key={"valueRow_"+variable.id}>
                {
                    listOfCells
                }
            </div>
            variableValues.push(rowOfValues);
        }

        return (<div id="variablesTableHolder">
            <div id="variableHeaders">
                {
                    variableHeaderCells
                }
            </div>
            <div id="rowHolder">
                {
                    variableValues
                }
            </div>

        </div>)
    }
}