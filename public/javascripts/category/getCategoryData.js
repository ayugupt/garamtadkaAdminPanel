function getCategoryData(isDraggable){
    var req = new XMLHttpRequest();
    req.open('GET', `http://${localStorage.serverURL}/categories?apikey=fVKHo9QEUQgWXjQ`, true);
    req.send();

    req.addEventListener("load", onLoad);

    function onLoad(){
        var response = JSON.parse(this.responseText);
        ReactDOM.render(<ItemList data={response.data} canDrag={isDraggable}/>, document.getElementById("recordsHolder"));
        addAnimationToIconButtons();
    }
}

getCategoryData(false);