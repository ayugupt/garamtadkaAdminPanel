httpRequest('GET', `${localStorage.http}://${localStorage.serverURL}/language?apikey=fVKHo9QEUQgWXjQ`).then((val)=>{
    let selector = document.getElementById("languageSelect");
    let englishOption;
    for(var language of val.data){
        if(language['name_english'] == language['name_native']) englishOption = language;
        let languageOption = document.createElement("option");
        languageOption.value = language.id;
        languageOption.innerHTML = language['name_english'];
        selector.appendChild(languageOption);
    }
    selector.value = englishOption.id;
    getCategoryData(false, selector.value);
}).catch((error)=>{
    alert("There was some error in retrieving languages")
    console.error(error);
})

async function getCategoryData(isDraggable, languageID){
    let response = await httpRequest('GET', `${localStorage.http}://${localStorage.serverURL}/categories?apikey=fVKHo9QEUQgWXjQ&language_id=${languageID}`);
    ReactDOM.render(<ItemListFromTemplate data={response.data} canDrag={isDraggable}/>, document.getElementById("recordsHolder"));
    addAnimationToIconButtons();
}

document.getElementById("languageSelect").addEventListener('change', function(e){
    getCategoryData(false, e.target.value);
})