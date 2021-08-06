var graphCanvas = document.getElementById("newDevices");

window.addEventListener("resize", function(){
    drawGraph()
})

graphCanvas.addEventListener("mouseout", function(){
    document.getElementById("devicePointer").style.display = "none";
    document.getElementById("deviceInformationBox").style.display = "none";
})

document.getElementById("deviceInformationBox").addEventListener("mouseover", function(){
    document.getElementById("deviceInformationBox").style.display = "block"
    document.getElementById("devicePointer").style.display = "block"
    
})

document.getElementById("devicePointer").addEventListener("mouseover", function(){
    document.getElementById("deviceInformationBox").style.display = "block"
    document.getElementById("devicePointer").style.display = "block"
    
})

document.getElementById("deviceInformationBox").addEventListener("mouseout", function(){
    document.getElementById("deviceInformationBox").style.display = "none"
    document.getElementById("devicePointer").style.display = "none"
    
})


function drawGraph(){
    let height = Math.floor(graphCanvas.offsetHeight);
    let width = Math.floor(graphCanvas.offsetWidth);

    graphCanvas.height = height;
    graphCanvas.width = width;

    var graphContext = graphCanvas.getContext("2d");

    // var data = [{date:"2020/07/10", count:2000}, {date:"2020/07/11", count:1567}, {date:"2020/07/12", count:2045}, {date:"2020/07/13", count:2102}
    // ,{date:"2020/07/14", count:970}, {date:"2020/07/15", count:2900}, {date:"2020/07/16", count:3770}, {date:"2020/07/17", count:4048}, {date:"2020/07/18", count:1076},
    // {date:"2020/07/19", count:9596}, {date:"2020/07/20", count:9976}, {date:"2020/07/21", count:5272}, {date:"2020/07/22", count:3157},
    // {date:"2020/07/23", count:5097}, {date:"2020/07/24", count:1799}, {date:"2020/07/25", count:7877}, {date:"2020/07/26", count:5321}, 
    // {date:"2020/07/27", count:8126}, {date:"2020/07/28", count:4100}, {date:"2020/07/29", count:6077}, {date:"2020/07/30", count:5000}]

    let max = data[0].count;
    for(let i = 1; i< data.length; i++){
        if(data[i].count > max){
            max = data[i].count;
        }
    }

    let step = 1;
    while(max/step > 10){
        step  = step*10;
    }

    if(max < step*5 && max > 10){
        step = step/2;
    }

    let paddingLeft = 50;
    let paddingBottom = 20;
    let paddingTop = 20;

    graphContext.beginPath()
    graphContext.moveTo(paddingLeft, paddingTop)
    graphContext.lineTo(paddingLeft, height-paddingBottom)
    graphContext.lineTo(width, height-paddingBottom)
    graphContext.stroke()

    
    graphContext.textAlign = "right"
    graphContext.textBaseline = "top"
    let val = 0;
    let totalSteps = (Math.floor(max/step)+1);

    graphContext.fillText(val.toString(), paddingLeft*0.7, height-paddingBottom, paddingLeft*0.7)


    for(let j = 1; j <= totalSteps; j++){
        val = val + step;
        graphContext.fillText(val.toString(), paddingLeft*0.7, height-paddingBottom - (height-paddingBottom-paddingTop)*(j/totalSteps), paddingLeft*0.7)
        //console.log(height-paddingBottom - (height-paddingBottom-paddingTop)*(j/totalSteps), val)
    }

    graphContext.strokeStyle = 'rgba(211, 211, 211, 0.3)'

    for(let j = 1; j <= totalSteps; j++){
        graphContext.beginPath()
        graphContext.moveTo(paddingLeft, height-paddingBottom - (height-paddingBottom-paddingTop)*(j/totalSteps));
        graphContext.lineTo(width, height-paddingBottom - (height-paddingBottom-paddingTop)*(j/totalSteps))
        graphContext.stroke()
    }

    graphContext.textAlign = "center"
    graphContext.strokeStyle = 'rgba(95, 118, 241, 1)'

    graphContext.beginPath()
    graphContext.moveTo(paddingLeft + (width-paddingLeft)/(data.length+1), height - paddingBottom - ((height-paddingBottom-paddingTop)/val)*data[0].count)

    for(let k = 0; k < data.length; k++){
        if(data.length <= 20){
            graphContext.fillText(data[k].date, paddingLeft + ((width-paddingLeft)/(data.length+1))*(k+1), height-paddingBottom+5, (width-paddingLeft)/(data.length+2))
        }
        if(k > 0){
            graphContext.lineTo(paddingLeft + ((width-paddingLeft)/(data.length+1))*(k+1), height - paddingBottom - ((height-paddingBottom-paddingTop)/val)*data[k].count)
        }
    }
    graphContext.lineWidth = 4;
    graphContext.stroke()

    graphCanvas.addEventListener("mousemove", function(e){
        let k = (e.offsetX-paddingLeft)*(data.length+1)/(width-paddingLeft)
        k = Math.floor(k+0.5);
        // k = roundK==k?roundK:roundK+1;
        if(k < 1) k = 1
        if(k > data.length) k = data.length

        let pointer = document.getElementById("devicePointer");
        let infoBox = document.getElementById("deviceInformationBox");

        infoBox.style.display = "block"
        pointer.style.display = "block"

        document.getElementById("deviceDate").innerHTML = data[k-1].date;
        document.getElementById("number").innerHTML = data[k-1].count;
        let sign = document.getElementById("incOrDec");
  
        if(k > 1){
            if(data[k-1].count > data[k-2].count){    
                sign.src = "/images/up.svg"
                if(data[k-2].count != 0){
                    document.getElementById("inDe").innerHTML = ((data[k-1].count-data[k-2].count)/(data[k-2].count)*100).toFixed(2).toString();
                }else{
                    document.getElementById("inDe").innerHTML = "inf"
                }
                document.getElementById("inDe").style.color = "green"
            }else if(data[k-1].count < data[k-2].count){
                sign.src = "/images/down.svg"
                document.getElementById("inDe").innerHTML = ((data[k-2].count-data[k-1].count)/(data[k-2].count)*100).toFixed(2).toString();
                document.getElementById("inDe").style.color = "red"
            }else{
                sign.src =""
                document.getElementById("inDe").innerHTML = "0";
                document.getElementById("inDe").style.color = "white"
            }
        }else{
            sign.src = ""
            document.getElementById("inDe").innerHTML = "0";
            document.getElementById("inDe").style.color = "white"
        }

        pointer.style.left = (graphCanvas.offsetLeft-pointer.offsetWidth/2 + paddingLeft + ((width-paddingLeft)/(data.length+1))*(k)).toString() + "px";
        pointer.style.top = (graphCanvas.offsetTop-pointer.offsetHeight/2 + height - paddingBottom - ((height-paddingBottom-paddingTop)/val)*data[k-1].count).toString() + "px";

        infoBox.style.left = (graphCanvas.offsetLeft-infoBox.offsetWidth/2 + paddingLeft + ((width-paddingLeft)/(data.length+1))*(k)).toString() + "px";
        infoBox.style.top = (graphCanvas.offsetTop+infoBox.offsetHeight*0.5 + height - paddingBottom - ((height-paddingBottom-paddingTop)/val)*data[k-1].count).toString() + "px";
    })

}