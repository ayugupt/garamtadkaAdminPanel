var categoriesList = [];

document.getElementById("categoriesSelection").addEventListener("change", function(){
    if(!categoriesList.includes(this.value)){
        categoriesList.push(this.value);
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
        return <Category name={val} index={index} key={val}/>
    })
    return <div id="categoryList">{catLi}</div>;
}