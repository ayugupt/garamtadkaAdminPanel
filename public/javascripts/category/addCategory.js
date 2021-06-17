function addCategory(){
    var req = new XMLHttpRequest();
    req.open('POST', `http://${localStorage.serverURL}/categories/create?apikey=fVKHo9QEUQgWXjQ`, true)
    req.setRequestHeader('Content-Type', 'application/json');
    let name = document.getElementById('nameInput').value;
    let image = document.getElementById('imageInput').value;
    let priority = document.getElementById('priorityInput').value;
    let links = document.getElementsByClassName('rsslink');
    let rssLinks = [];
    for(let link of links){
        rssLinks.push(link.value);
    }

    req.send(JSON.stringify({
        name: name,
        image: image,
        priority: priority,
        rss_feeds: rssLinks
    }))

    req.addEventListener("load", function(){
        document.getElementById("nameInput").value = "";
        document.getElementById("imageInput").value = "";
        document.getElementById("priorityInput").value = "";
        let rss = document.getElementsByClassName("rsslink");
        while(rss.length > 0){
            rss[0].parentElement.remove();
        }
        document.getElementById('inputHolder').style.display = "none";
        document.getElementById('addClose').src = "/images/plus.png";
        getCategoryData(false);
    })
}

function createOrCancel(e){
    let holder = document.getElementById("inputHolder");
    if(holder.style.display == 'none'){
        holder.style.display = 'block';
        e.currentTarget.children[0].src = "/images/close.png";
    }else{
        document.getElementById("nameInput").value = "";
        document.getElementById("imageInput").value = "";
        document.getElementById("priorityInput").value = "";
        let rss = document.getElementsByClassName("rsslink");
        while(rss.length > 0){
            rss[0].parentElement.remove();
        }
        holder.style.display = "none";
        e.currentTarget.children[0].src = "/images/plus.png";
    }
}

function addRSSInput(){
    let holder = document.createElement('div');
    holder.style.marginTop = "16px";
    holder.style.display = "flex";
    holder.style.alignItems = "center";

    let element = document.createElement('input');
    element.type = 'text'; 
    element.className = "input rsslink";

    let deleteButton = document.createElement('div');
    deleteButton.className = "raisedButton";
    deleteButton.style.width = "32px";
    deleteButton.style.marginLeft = "8px";
    addAnimationToIconButton(deleteButton);
    deleteButton.addEventListener('click', function(){
        holder.remove();
    })

    let img = document.createElement('img');
    deleteButton.appendChild(img);
    img.src = "/images/remove.png";
    img.style.width = "100%";

    holder.appendChild(element);
    holder.appendChild(deleteButton);

    document.getElementById("inputHolder").appendChild(holder);
}
