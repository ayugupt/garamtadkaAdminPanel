function getCategoriesFromLanguage(language){
    httpRequest('GET', `${localStorage.http}://${localStorage.serverURL}/categories?apikey=fVKHo9QEUQgWXjQ&language_id=${language}`).then((val)=>{
        while(document.getElementById("categoriesSelection").children.length > 0){
            document.getElementById("categoriesSelection").children[0].remove();
        }
        let nullOption = document.createElement("option");
        nullOption.value = null;
        nullOption.innerHTML = "Add Category";
        document.getElementById("categoriesSelection").appendChild(nullOption);
        document.getElementById("categoriesSelection").value = null;

        for(var cate of val.data){
            let categoryOption = document.createElement("option");
            categoryOption.value = cate.id;
            categoryOption.innerHTML = cate.name;
            document.getElementById("categoriesSelection").appendChild(categoryOption);
        }
    })
}

httpRequest('GET', `${localStorage.http}://${localStorage.serverURL}/language?apikey=fVKHo9QEUQgWXjQ`).then((val)=>{
    var selector = document.getElementById("languageSelector");
    let englishOption = val.data[0];
    for(var languageObject of val.data){
        if(languageObject['name_english'] == languageObject['name_native']) englishOption = languageObject;

        let languageOption = document.createElement("option");
        languageOption.value = languageObject.id;
        languageOption.innerHTML = languageObject['name_english'];
        selector.appendChild(languageOption);
    }
    selector.value = englishOption.id;
    getCategoriesFromLanguage(selector.value);
})