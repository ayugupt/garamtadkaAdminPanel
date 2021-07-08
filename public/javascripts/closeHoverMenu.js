window.addEventListener("click", function(e){
    if(!e.target.classList.contains("menu") && (!e.target.parentElement || !e.target.parentElement.classList.contains("menu"))){
        let menus = document.getElementsByClassName("hovermenu");
        for(var menu of menus){
            menu.style.display = "none";
        }
    }
})