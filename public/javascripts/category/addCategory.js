async function addCategory(){
    if(document.getElementById("droppedImage")){
        formData = new FormData();
        formData.append("categoryImage", document.getElementById("droppedImage").file);
        formData.append("imageType", document.getElementById("droppedImage").file.type.replace("image/", ""))
        formData.append("categoryName", document.getElementById("nameInput").value);

        let response = await httpRequest('POST', '/uploadCategoryImage', formData);

        let name = document.getElementById('nameInput').value;
        let image = response.imageLink;
        let priority = document.getElementById('priorityInput').value;
        let links = document.getElementsByClassName('rsslink');
        let notifs = document.getElementsByClassName('rssNotification');
        let rssLinks = [];
        let notifications = [];
        for(let link of links){
            rssLinks.push(link.value);
        }
        for(let notif of notifs){
            notifications.push(notif.value);
        }

        await httpRequest('POST', `${localStorage.http}://${localStorage.serverURL}/categories/create?apikey=fVKHo9QEUQgWXjQ`, JSON.stringify({
            name: name,
            image: image,
            priority: priority,
            rss_feeds: rssLinks,
            notifications: notifications
        }))

        document.getElementById("nameInput").value = "";
        document.getElementById("priorityInput").value = "";
        let imgDropper = document.querySelector(".imageDropper");
        imgDropper.children[1].remove();
        imgDropper.children[0].style.display = "flex";

        let rss = document.getElementsByClassName("rsslink");
        while(rss.length > 0){
            rss[0].parentElement.remove();
        }
        document.getElementById('inputHolder').style.display = "none";
        document.getElementById('addClose').src = "/images/plus.png";
        getCategoryData(false);
    }
}

function createOrCancel(e){
    let holder = document.getElementById("inputHolder");
    if(holder.style.display == 'none'){
        holder.style.display = 'block';
        e.currentTarget.children[0].src = "/images/close.png";
    }else{
        let imgDropper = document.querySelector(".imageDropper");
        if(imgDropper.children.length > 1){
            imgDropper.children[1].remove();
            imgDropper.children[0].style.display = "flex";
        }
        document.getElementById("nameInput").value = "";
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
    element.className = "input rsslink " + (document.getElementById("inputHolder").children.length-4).toString();

    let notificationSelector = document.createElement('select');
    notificationSelector.className = "input rssNotification " + (document.getElementById("inputHolder").children.length-4).toString()
    notificationSelector.innerHTML = '<option value="0">No notifications</option><option value="1">Subsribers only</option><option value="2">All</option>';
    notificationSelector.style.marginLeft = "8px";
    

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
    holder.appendChild(notificationSelector)
    holder.appendChild(deleteButton);

    document.getElementById("inputHolder").appendChild(holder);
}

let imageDrop = document.querySelector('.imageDropper');

imageDrop.addEventListener("dragenter", function(event){
    event.preventDefault();
})

imageDrop.addEventListener("dragover", function(event){
    event.preventDefault();
})

imageDrop.addEventListener("drop", function(event){
    event.preventDefault();
    let file = event.dataTransfer.files[0];
    console.log(file)
    if(!file.type.startsWith('image/')){
        alert("Please drop an image")
    }else{
        let imgEle = document.getElementById("droppedImage");
        if(!imgEle){
            const img = document.createElement("img");
            img.file = file;
            event.currentTarget.children[0].style.display = "none";
            event.currentTarget.appendChild(img);
            img.style.width = "100%";
            img.id = "droppedImage";
            const reader = new FileReader();
            reader.onload = function(e){img.src=e.target.result;}
            reader.readAsDataURL(file);
        }else{
            const reader = new FileReader();
            imgEle.file = file;
            reader.onload = function(e){imgEle.src=e.target.result;}
            reader.readAsDataURL(file);
        }
    }
})
