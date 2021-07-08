var categoriesList = [];

document.getElementById("categoriesSelection").addEventListener("change", function(){
    let name = this.options[this.selectedIndex].innerHTML;
    let isInList = false;
    for(var c of categoriesList){
        if(c.id == this.value){
            isInList = true;
            break;
        }
    }

    if(!isInList){
        categoriesList.push({id:this.value, name:name});
        ReactDOM.render(<CategoryList categories={categoriesList}/>, document.getElementById("allCategories"));
    }
    this.value = null;
    console.log(categoriesList)
})

function Category(props){

    function removeCategory(){
        categoriesList.splice(props.index, 1);
        ReactDOM.render(<CategoryList categories={categoriesList}/>, document.getElementById("allCategories"));
    }

    return (<div className="category">
        {props.name}
        <div className="removeCategoryButton" onClick={removeCategory}>
            <img src="/images/close.png" height="100%"/>
        </div>
    </div>)
}

function CategoryList(props){
    const catLi = props.categories.map((val, index)=>{
        return <Category name={val.name} index={index} key={val.id}/>
    })
    return <div id="categoryList">{catLi}</div>;
}

document.getElementById("languageSelector").addEventListener("change", function(){
    categoriesList = [];
    ReactDOM.render(<CategoryList categories={categoriesList}/>, document.getElementById("allCategories"));
})