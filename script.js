let videoElem=document.querySelector(".video");
// let audioElem=document.querySelector("audio");
let recordBtn=document.querySelector(".record");

let captureImgBtn=document.querySelector(".click-image");
let isRecording=false;
let filterArr=document.querySelectorAll(".filter");
let filterOverlay=document.querySelector(".filter_overlay");
let filterColor="";
let mediarecordingObjectForCurrStream;
let recording=[];
let counter=0;
let stopTime;
let scaleLevel=1;
let plusBtn=document.querySelector(".plus");
let minusBtn=document.querySelector(".minus");
let timing=document.querySelector(".timing");
let constraint={
    audio:true,video:true
}
let usermediaPromise=navigator.mediaDevices.getUserMedia(constraint);
usermediaPromise.then(function(stream){
    // UI staream
    videoElem.srcObject=stream;
    // audioElem.srcObject=stream;
    mediarecordingObjectForCurrStream=new MediaRecorder(stream);
    mediarecordingObjectForCurrStream.addEventListener("dataavailaible",function(e){
        recording.push(e.data);
    })
    mediarecordingObjectForCurrStream.addEventListener("stop",function(){ 
               let blob=new Blob(recording,{type: 'video/mp4'});
               addMediaToDB(blob,"video");
    // const url=window.URL.createObjectURL(blob);
        // let a=document.createElement("a");
        // a.download="file.mp4";
        // a.href=url;
        // a.click();
        
        recording=[];
    })
}).catch(function(err){
    alert("Please allow both microphone and camera");
});

recordBtn.addEventListener("click",function(){
    if(mediarecordingObjectForCurrStream==undefined){
        alert("First select the devices");
        return ;
    }
    if(isRecording==false){
        
        mediarecordingObjectForCurrStream.start();
        // recordBtn.innerText="Recording......";
        recordBtn.classList.add("record-animation");
        startTimer();
    }else{
        stopTimer();
        recordBtn.classList.remove("record-animation");
        mediarecordingObjectForCurrStream.stop();
        // recordBtn.innerText="Record";
    }
    isRecording=!isRecording;
})



captureImgBtn.addEventListener("click",function(){
    captureImgBtn.classList.add("capture-animation");
    // canvas create  
    let canvas=document.createElement("canvas");
    canvas.height=videoElem.videoHeight;
    canvas.width=videoElem.videoWidth;
    let tool=canvas.getContext("2d");
    tool.scale(scaleLevel,scaleLevel);
    let x=(tool.canvas.width / scaleLevel - videoElem.videoWidth) / 2;
    let y=(tool.canvas.height / scaleLevel - videoElem.videoHeight) / 2;
    tool.drawImage(videoElem,x,y);
    if(filterColor){
        tool.fillStyle=filterColor;
        tool.fillRect(0,0,canvas.width,canvas.height);
    }
    // video element
    let url= canvas.toDataURL();
    addMediaToDB(url,"img");
    //    let a=document.createElement("a");
    //    a.download="file.png";
    //    a.href=url;
    //    a.click();
    //    a.remove();
       setTimeout(function(){
           captureImgBtn.classList.remove("capture-animation");
       },1000);
})

for(let i=0;i<filterArr.length;i++){
    filterArr[i].addEventListener("click",function(){
      filterColor=  filterArr[i].style.backgroundColor;
      filterOverlay.style.backgroundColor=filterColor;
    })
}


function startTimer(){
    timing.style.display="block";
    function fn(){
        let hours = Number.parseInt(counter / 3600);
        let RemSeconds = counter % 3600;
        let mins = Number.parseInt(RemSeconds / 60);
        let seconds = RemSeconds % 60;
        hours = hours < 10 ? `0${hours}` : hours;
        mins = mins < 10 ? `0${mins}` : `${mins}`;
        seconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
        timing.innerText = `${hours}:${mins}:${seconds}`
        counter++;
    }
   stopTime= setInterval(fn,1000);
}

function stopTimer(){
    timing.style.display="none";
    clearInterval(stopTime);
}

minusBtn.addEventListener("click",function(){
if(scaleLevel>1){
    scaleLevel = scaleLevel-0.1;
    videoElem.style.transform=`scale(${scaleLevel})`;
}
})

plusBtn.addEventListener("click",function(){
if(scaleLevel<2){
    scaleLevel = scaleLevel+0.1;
    videoElem.style.transform=`scale(${scaleLevel})`;
}
})