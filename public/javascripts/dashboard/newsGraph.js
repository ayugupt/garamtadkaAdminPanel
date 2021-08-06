var graphCanva = document.getElementById("newsCanvas");

window.addEventListener("resize", function(){
    drawNewsGraph()
})

graphCanva.addEventListener("mouseout", function(){
    document.getElementById("newsPointer").style.display = "none";
    document.getElementById("newsInformationBox").style.display = "none";
})

document.getElementById("newsInformationBox").addEventListener("mouseover", function(){
    document.getElementById("newsInformationBox").style.display = "block"
    document.getElementById("newsPointer").style.display = "block"
    
})

document.getElementById("newsPointer").addEventListener("mouseover", function(){
    document.getElementById("newsInformationBox").style.display = "block"
    document.getElementById("newsPointer").style.display = "block"
    
})

document.getElementById("newsInformationBox").addEventListener("mouseout", function(){
    document.getElementById("newsInformationBox").style.display = "none"
    document.getElementById("newsPointer").style.display = "none"
    
})


function drawNewsGraph(){
    let height = Math.floor(graphCanva.offsetHeight);
    let width = Math.floor(graphCanva.offsetWidth);

    graphCanva.height = height;
    graphCanva.width = width;

    var graphContext = graphCanva.getContext("2d");

    // var data = [{date:"2020/07/10", count:2000}, {date:"2020/07/11", count:1567}, {date:"2020/07/12", count:2045}, {date:"2020/07/13", count:2102}
    // ,{date:"2020/07/14", count:970}, {date:"2020/07/15", count:2900}, {date:"2020/07/16", count:3770}, {date:"2020/07/17", count:4048}, {date:"2020/07/18", count:1076},
    // {date:"2020/07/19", count:9596}, {date:"2020/07/20", count:9976}, {date:"2020/07/21", count:5272}, {date:"2020/07/22", count:3157},
    // {date:"2020/07/23", count:5097}, {date:"2020/07/24", count:1799}, {date:"2020/07/25", count:7877}, {date:"2020/07/26", count:5321}, 
    // {date:"2020/07/27", count:8126}, {date:"2020/07/28", count:4100}, {date:"2020/07/29", count:6077}, {date:"2020/07/30", count:5000}]

    let max = newsData[0].count;
    for(let i = 1; i< newsData.length; i++){
        if(newsData[i].count > max){
            max = newsData[i].count;
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
    graphContext.strokeStyle = 'rgba(0, 240, 253, 1)'

    graphContext.beginPath()
    graphContext.moveTo(paddingLeft + (width-paddingLeft)/(newsData.length+1), height - paddingBottom - ((height-paddingBottom-paddingTop)/val)*newsData[0].count)

    for(let k = 0; k < newsData.length; k++){
        if(newsData.length <= 20){
            graphContext.fillText(newsData[k].date, paddingLeft + ((width-paddingLeft)/(newsData.length+1))*(k+1), height-paddingBottom+5, (width-paddingLeft)/(newsData.length+2))
        }
        if(k > 0){
            graphContext.lineTo(paddingLeft + ((width-paddingLeft)/(newsData.length+1))*(k+1), height - paddingBottom - ((height-paddingBottom-paddingTop)/val)*newsData[k].count)
        }
    }
    graphContext.lineWidth = 4;
    graphContext.stroke()

    graphCanva.addEventListener("mousemove", function(e){
        let k = (e.offsetX-paddingLeft)*(newsData.length+1)/(width-paddingLeft)
        k = Math.floor(k+0.5);
        // k = roundK==k?roundK:roundK+1;
        if(k < 1) k = 1
        if(k > newsData.length) k = newsData.length

        let pointer = document.getElementById("newsPointer");
        let infoBox = document.getElementById("newsInformationBox");

        infoBox.style.display = "block"
        pointer.style.display = "block"

        document.getElementById("newsDate").innerHTML = newsData[k-1].date;
        document.getElementById("numberNews").innerHTML = newsData[k-1].count;
        let sign = document.getElementById("incOrDecNews");
  
        if(k > 1){
            if(newsData[k-1].count > newsData[k-2].count){    
                sign.src = "/images/up.svg"
                if(newsData[k-2].count != 0){
                    document.getElementById("inDeNews").innerHTML = ((newsData[k-1].count-newsData[k-2].count)/(newsData[k-2].count)*100).toFixed(2).toString();
                }else{
                    document.getElementById("inDeNews").innerHTML = "inf"
                }
                document.getElementById("inDeNews").style.color = "green"
            }else if(newsData[k-1].count < newsData[k-2].count){
                sign.src = "/images/down.svg"
                document.getElementById("inDeNews").innerHTML = ((newsData[k-2].count-newsData[k-1].count)/(newsData[k-2].count)*100).toFixed(2).toString();
                document.getElementById("inDeNews").style.color = "red"
            }else{
                sign.src =""
                document.getElementById("inDeNews").innerHTML = "0";
                document.getElementById("inDeNews").style.color = "white"
            }
        }else{
            sign.src = ""
            document.getElementById("inDeNews").innerHTML = "0";
            document.getElementById("inDeNews").style.color = "white"
        }

        pointer.style.left = (graphCanva.offsetLeft-pointer.offsetWidth/2 + paddingLeft + ((width-paddingLeft)/(newsData.length+1))*(k)).toString() + "px";
        pointer.style.top = (graphCanva.offsetTop-pointer.offsetHeight/2 + height - paddingBottom - ((height-paddingBottom-paddingTop)/val)*newsData[k-1].count).toString() + "px";

        infoBox.style.left = (graphCanva.offsetLeft-infoBox.offsetWidth/2 + paddingLeft + ((width-paddingLeft)/(newsData.length+1))*(k)).toString() + "px";
        infoBox.style.top = (graphCanva.offsetTop-infoBox.offsetHeight*1.5 + height - paddingBottom - ((height-paddingBottom-paddingTop)/val)*newsData[k-1].count).toString() + "px";
    })

}