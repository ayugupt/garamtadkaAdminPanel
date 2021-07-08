function getLanguages(){
    httpRequest('GET',  `${localStorage.http}://${localStorage.serverURL}/language?apikey=fVKHo9QEUQgWXjQ`).then((val)=>{
        ReactDOM.render(<LanguageItemList data={val.data}/>, document.getElementById("recordsHolder"))
        addAnimationToIconButtons();
    }).catch((error)=>{
        alert("There was an error in getting languages, please referesh the page to try again")
        console.log(error)
    })
}

getLanguages();

async function getLangAndVar(){
    let langs = await httpRequest('GET', `${localStorage.http}://${localStorage.serverURL}/language?apikey=fVKHo9QEUQgWXjQ`);
    let vars = await httpRequest('GET', `${localStorage.http}://${localStorage.serverURL}/variable?apikey=fVKHo9QEUQgWXjQ`);
    let varValues = await httpRequest('GET', `${localStorage.http}://${localStorage.serverURL}/variable/values?apikey=fVKHo9QEUQgWXjQ`);

    ReactDOM.render(<VariableTable variables={vars.data} languages={langs.data} variableValues={varValues.data}/>, document.getElementById("container"));
}

getLangAndVar();