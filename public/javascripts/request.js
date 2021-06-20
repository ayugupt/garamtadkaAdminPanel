function httpRequest(method, url, body){
    return new Promise((resolve, reject)=>{

        var req = new XMLHttpRequest();
        req.open(method, url, true);

        if(typeof body === "string"){
            req.setRequestHeader('Content-Type', 'application/json');
        }

        req.send(body);

        req.addEventListener('load', function(){
            if(req.status >= 200 && req.status < 400){
                resolve(JSON.parse(req.responseText));  
            }else{
                let res = JSON.parse(req.responseText);
                reject({
                    status:req.status,
                    message: res.message,
                    error: res.error
                })
            }
        })

        req.addEventListener('error', function(){
            reject({
                status: req.status,
                message: "Network Error",
                error: req.statusText
            })
        })
    })
}