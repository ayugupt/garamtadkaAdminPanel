async function addPost(){
    let img = document.getElementById("droppedImage");
    if(img){
        formData = new FormData();
        formData.append("image", img.file);
        formData.append("imageType", img.file.type.replace("image/", ""));

        let result = await httpRequest('POST', '/uploadNewsImage', formData);

        title = document.getElementById("titleInput").value;
        content = document.getElementById("contentInput").value;
        creator = document.getElementById("creatorInput").value;
        pubDate = document.getElementById("dateInput").value;
        link = document.getElementById("linkInput").value;
        
        await httpRequest('POST', `${localStorage.http}://${localStorage.serverURL}/news/create?apikey=fVKHo9QEUQgWXjQ`, JSON.stringify({
            title:title,
            content:content,
            image:result.imageLink,
            creator:creator,
            pubDate:pubDate,
            link:link,
            categories: categoriesList
        }));

        document.getElementById("titleInput").value = "";
        document.getElementById("contentInput").value = "";
        document.getElementById("creatorInput").value = "";
        document.getElementById("dateInput").value = "";
        document.getElementById("linkInput").value = "";
        img.parentNode.children[0].style.display = "flex";
        categoriesList = [];
        ReactDOM.render(<CategoryList categories={categoriesList}/>, document.getElementById("allCategories"));
        img.remove();
    }
}