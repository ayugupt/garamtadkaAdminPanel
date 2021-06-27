async function getCategoryData(isDraggable){
    let response = await httpRequest('GET', `${localStorage.http}://${localStorage.serverURL}/categories?apikey=fVKHo9QEUQgWXjQ`);
    ReactDOM.render(<ItemList data={response.data} canDrag={isDraggable}/>, document.getElementById("recordsHolder"));
    addAnimationToIconButtons();
}

getCategoryData(false);