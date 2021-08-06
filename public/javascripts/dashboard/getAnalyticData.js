data =[]
newsData=[]
function getGraphData(days){
    httpRequest("GET", `${localStorage.http}://${localStorage.serverURL}/analytics/newDevices?days=${days}&apikey=fVKHo9QEUQgWXjQ`).then((val)=>{
    data = val.data

    let currDate = new Date();

    if(days == 0){
        let firstDate = new Date(data[0].date);
        diffTime = Math.abs(currDate - firstDate)
        days = Math.ceil(diffTime/(1000*60*60*24))
    }

    for(let i = 0; i < days; i++){
        let dt = new Date(currDate.getFullYear(), currDate.getMonth(), currDate.getDate()-days+1+i);
        if(i < data.length){
            let dataDt = new Date(data[i].date);
            if(!(dataDt.getFullYear() == dt.getFullYear() && dataDt.getMonth() == dt.getMonth() && dataDt.getDate() == dt.getDate())){
                data.splice(i, 0, {count:0, date:`${dt.getFullYear()}-${dt.getMonth()+1}-${dt.getDate()}`});
            }
        }else{
            data.splice(i, 0, {count:0, date:`${dt.getFullYear()}-${dt.getMonth()+1}-${dt.getDate()}`});
        }
    }

    drawGraph()
    }).catch((err)=>{
        alert("There was some error in getting new users data")
        console.error(err)
    })
}

getGraphData(30)

function getGraphDataNews(days){
    httpRequest("GET", `${localStorage.http}://${localStorage.serverURL}/analytics/views?days=${days}&apikey=fVKHo9QEUQgWXjQ`).then((val)=>{
    newsData = val.data

    let currDate = new Date();

    if(days == 0){
        let firstDate = new Date(newsData[0].date);
        diffTime = Math.abs(currDate - firstDate)
        days = Math.ceil(diffTime/(1000*60*60*24))
    }

    for(let i = 0; i < days; i++){
        let dt = new Date(currDate.getFullYear(), currDate.getMonth(), currDate.getDate()-days+1+i);
        if(i < newsData.length){
            let dataDt = new Date(newsData[i].date);
            if(!(dataDt.getFullYear() == dt.getFullYear() && dataDt.getMonth() == dt.getMonth() && dataDt.getDate() == dt.getDate())){
                newsData.splice(i, 0, {count:0, date:`${dt.getFullYear()}-${dt.getMonth()+1}-${dt.getDate()}`});
            }
        }else{
            newsData.splice(i, 0, {count:0, date:`${dt.getFullYear()}-${dt.getMonth()+1}-${dt.getDate()}`});
        }
    }

    drawNewsGraph()
    }).catch((err)=>{
        alert("There was some error in getting new users data")
        console.error(err)
    })
}

getGraphDataNews(30)

document.getElementById("newsDaysSelector").addEventListener("change", function(){
    getGraphDataNews(document.getElementById("newsDaysSelector").value)
})

document.getElementById("deviceDaysSelector").addEventListener("change", function(){
    getGraphData(document.getElementById("deviceDaysSelector").value)
})

httpRequest("GET", `${localStorage.http}://${localStorage.serverURL}/analytics/totalDevices?apikey=fVKHo9QEUQgWXjQ`).then((val)=>{
    document.getElementById("totalDevices").innerHTML = val.data[0].totalDevices;
}).catch((err)=>{
    alert("Error in retriving total devices data")
    console.error(err)
})

async function trend(){
    let prev = await httpRequest("GET", `${localStorage.http}://${localStorage.serverURL}/analytics/devicesTimeInterval?apikey=fVKHo9QEUQgWXjQ&first=60&second=30`)
    let next = await httpRequest("GET", `${localStorage.http}://${localStorage.serverURL}/analytics/devicesTimeInterval?apikey=fVKHo9QEUQgWXjQ&first=30&second=0`)

    let ans="0% Change" 
    console.log(prev, next)
    if(prev.data[0].count > next.data[0].count){
        ans = (((prev.data[0].count-next.data[0].count)/(prev.data[0].count))*100).toFixed(2).toString() + "% Decrease"
        document.getElementById("monthTrend").style.color = "red"
    }else if(prev.data[0].count < next.data[0].count){
        if(prev.data[0].count != 0){
            ans = (((next.data[0].count-prev.data[0].count)/(prev.data[0].count))*100).toFixed(2).toString() + "% Increase"
        }else{
            ans = "INF% Increase"
        }
        document.getElementById("monthTrend").style.color = "green"
    }

    document.getElementById("monthTrend").innerHTML = ans;
}

trend()
//currDate = new Date()

//console.log(new Date(currDate.getFullYear(), currDate.getMonth(), currDate.getDate()).toDateString())