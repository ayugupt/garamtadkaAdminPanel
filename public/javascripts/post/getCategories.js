httpRequest('GET', `${localStorage.http}://${localStorage.serverURL}/categories?apikey=fVKHo9QEUQgWXjQ`).then((val)=>{
    for(var cate of val.data){
        let categoryOption = document.createElement("option");
        categoryOption.value = cate.name;
        categoryOption.innerHTML = cate.name;
        document.getElementById("categoriesSelection").appendChild(categoryOption);
    }
})