var req = new XMLHttpRequest();
req.open('GET', `${localStorage.http}://${localStorage.serverURL}/user/getAll?apikey=fVKHo9QEUQgWXjQ`, true);
req.send();

req.addEventListener("load", onLoad);

function onLoad(){
    var response = JSON.parse(this.responseText);
    ReactDOM.render(<UserItemList userData={response.data}/>, document.getElementById("recordsHolder"));
    addAnimationToIconButtons();
}