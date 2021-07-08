async function addLanguage(){
    if(document.getElementById("droppedImage")){
        formData = new FormData();
        formData.append("languageImage", document.getElementById("droppedImage").file);
        formData.append("imageType", document.getElementById("droppedImage").file.type.replace("image/", ""))
        formData.append("languageName", document.getElementById("englishInput").value);

        let response = await httpRequest('POST', '/uploadLanguageImage', formData);

        let englishName = document.getElementById('englishInput').value;
        let nativeName = document.getElementById('nativeInput').value;
        let image = response.imageLink;

        await httpRequest('POST', `${localStorage.http}://${localStorage.serverURL}/language/create?apikey=fVKHo9QEUQgWXjQ`, JSON.stringify({
            name_english: englishName,
            name_native: nativeName,
            image: image,
        }))

        document.getElementById("englishInput").value = "";
        document.getElementById("nativeInput").value = "";
        let imgDropper = document.querySelector(".imageDropper");
        imgDropper.children[1].remove();
        imgDropper.children[0].style.display = "flex";

        document.getElementById('inputHolder').style.display = "none";
        document.getElementById('addClose').src = "/images/plus.png";
        getLanguages();
        getLangAndVar();
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
        document.getElementById("englishInput").value = "";
        document.getElementById("nativeInput").value = "";
        holder.style.display = "none";
        e.currentTarget.children[0].src = "/images/plus.png";
    }
}

function createOrCancelValue(e){
    let nameInput = document.getElementById("variableInputHolder");
    if(nameInput.style.display == "none"){
        nameInput.style.display = "initial";
        e.currentTarget.children[0].src = "/images/close.png";
    }else{
        document.getElementById("variableName").value = "";
        e.currentTarget.children[0].src = "/images/plus.png";
        nameInput.style.display = "none";
    }
}

function addVariable(){
    let input = document.getElementById("variableName");
    let nameInput = document.getElementById("variableInputHolder");

    if(input.value && input.value != ""){
        httpRequest('POST', `${localStorage.http}://${localStorage.serverURL}/variable/create?apikey=fVKHo9QEUQgWXjQ`, JSON.stringify({
            name:input.value
        })).then((val)=>{
            input.value = "";
            document.getElementById("addCloseValue").src = "/images/plus.png";
            nameInput.style.display = "none";
            getLangAndVar();
        }).catch((error)=>{
            input.value = "";
            document.getElementById("addCloseValue").src = "/images/plus.png";
            nameInput.style.display = "none";
            alert("There was an error in adding new variable. Please try again.");
            console.error(error);
        })
    }
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
