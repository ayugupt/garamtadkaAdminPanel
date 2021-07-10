async function addPost(){
    let img = document.getElementById("droppedImage");
    if(img){
        let formData = new FormData();
        formData.append("image", img.file);
        formData.append("imageType", img.file.type.replace("image/", ""));

        let result = await httpRequest('POST', `${localStorage.http}://${localStorage.serverURL}/upload/newsImage?apikey=fVKHo9QEUQgWXjQ`, formData);

        let title = document.getElementById("titleInput").value;
        let content = document.getElementById("contentInput").value;
        let creator = document.getElementById("creatorInput").value;
        let pubDate = document.getElementById("dateInput").value;
        let link = document.getElementById("linkInput").value;
        let language = document.getElementById("languageSelector").value;

        let categoriesOfPost = [];
        for(let q of categoriesList){
            categoriesOfPost.push(q.id);
        }
        
        await httpRequest('POST', `${localStorage.http}://${localStorage.serverURL}/news/create?apikey=fVKHo9QEUQgWXjQ`, JSON.stringify({
            title:title,
            content:content,
            image:result.imageLink,
            creator:creator,
            pubDate:pubDate,
            link:link,
            categories: categoriesOfPost,
            language: language
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