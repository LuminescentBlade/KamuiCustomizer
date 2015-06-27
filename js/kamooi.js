var canvas;
var ctx;
var tintcanvas;
var ttx;
var	haircanvas;
var htx;
var hexChart = {};
var currentFilter = "overlay";
var isFirefox = typeof InstallTrigger !== 'undefined';  
var alg = (isFirefox)?"alg2":"alg1";

var currentKamooi = 0; //0 = femuireg 1 = femuibig 2 = mamuireg 3 = mamuibig
var currentHair = 0;
var currentFace = 0;
var currentClip = 0;
var currentFeature = 0;
var currentColor = 0;

var colorList = ["#f8ebd4","#c84743","#d67854","#f3e1c5","#c0dd9d","#8fcac5","#b1c7e7","#e1aee4","#f6dfd8","#d3af99","#b2a69b","#b03c49","#ab614c","#e1cd9e","#829563","#438488","#5b637b","#946996","#eba19b","#927160","#615650","#e34a5a","#ea8e60","#e8cb7d","#95cc65","#95e3cc","#567ea5","#c580d8","#ea889f","#7d523c"];
var targetnum = 0;
var loadednum = 0;
var kamooiList = [];


initKamooi();

function initCanvas(){
	canvas=$("#kamooicanvas")[0];
	ctx=canvas.getContext("2d");
	tintcanvas = document.createElement('canvas');
	tintcanvas.width = 256;
	tintcanvas.height = 256;
	ttx = tintcanvas.getContext('2d');
	haircanvas = document.createElement('canvas');
	haircanvas.width = 256;
	haircanvas.height = 256;
	htx = haircanvas.getContext('2d');
}


function Kamooi(gender, size){
	this.gender = gender;
	this.size = size;
	this.faces = [];
	this.hair = [];
	this.hairclip = [];
	this.features = [];
}

function initKamooi(){
	kamooiList.push(new Kamooi("fem", "reg"));
	kamooiList.push(new Kamooi("fem", "big"));
	kamooiList.push(new Kamooi("male", "reg"));
	kamooiList.push(new Kamooi("male", "big"));
	targetnum = kamooiList.length*(7+12+12+2.5);

	//
	for(var i = 0; i < kamooiList.length; i++){
		var kamooi = kamooiList[i];

		for(var j = 1; j <= 7; j++){
			var s = "img/body/"+kamooi.gender+"-"+kamooi.size+"/"+j+".png";
			var img = new Image();
			img.onload=function(){
				loadednum++;
				dispload();
			}
			img.src = s;
			kamooi.faces.push(img);
		}

		for(var j = 0; j <= 11; j++){
			var s = "img/hair/"+kamooi.gender+"-"+kamooi.size+"/"+j+".png";
			var img = new Image();
			img.onload=function(){
				loadednum++;
				dispload();
			}
			img.src = s;
			kamooi.hair.push(img);
		}	

		for(var j = 1; j <= 12; j++){
			var s = "img/features/"+kamooi.gender+"-"+kamooi.size+"/"+j+".png";
			var img = new Image();
			img.onload=function(){
				loadednum++;
				dispload();
			}
			img.src = s;
			kamooi.features.push(img);
		}

		if(kamooi.gender === "fem"){
			for(var j = 1; j <= 5; j++){
				var s = "img/hairclip/"+kamooi.gender+"-"+kamooi.size+"/"+j+".png";
				var img = new Image();
				img.onload=function(){
					loadednum++;
					dispload();
				}
				img.src = s;
				kamooi.hairclip.push(img);
			}	
		}		
	}
}

function forward(param){
	if(param === "kamui"){
		currentKamooi = (currentKamooi+1)%kamooiList.length;
	}
	else if(param === "face"){
		var numface = kamooiList[currentKamooi].faces.length;
		currentFace = (currentFace+1)%numface;
	}
	else if(param === "hair"){
		var numhair = kamooiList[currentKamooi].hair.length;
		currentHair = (currentHair+1)%numhair;
	}
	else if(param === "hairclip"){
		if(kamooiList[currentKamooi].gender = "fem"){
			var numclip = kamooiList[currentKamooi].hairclip.length+1;
			currentClip = (currentClip+1)%numclip;
		}
	}
	else if(param === "features"){
		var numfeatures = kamooiList[currentKamooi].features.length+1;
		currentFeature= (currentFeature+1)%numfeatures;
	}
	else if(param === "color"){
		currentColor = (currentColor+1)%colorList.length;
	}
	changeMenu(param);
	loadCurrentKamooi();

}

function backward(param){
	if(param === "kamui"){
		currentKamooi = (currentKamooi+kamooiList.length-1)%kamooiList.length;
	}
	else if(param === "face"){
		var numface = kamooiList[currentKamooi].faces.length;
		currentFace = (currentFace+numface-1)%numface;
	}
	else if(param === "hair"){
		var numhair = kamooiList[currentKamooi].hair.length;
		currentHair = (currentHair+numhair-1)%numhair;
	}
	else if(param === "hairclip"){
		if(kamooiList[currentKamooi].gender = "fem"){
			var numclip = kamooiList[currentKamooi].hairclip.length+1;
			currentClip = (currentClip+numclip-1)%numclip;
		}
	}
	else if(param === "features"){
		var numfeatures = kamooiList[currentKamooi].features.length+1;
		currentFeature= (currentFeature+numfeatures-1)%numfeatures;
		console.log(currentFeature);
	}
	else if(param === "color"){
		currentColor = (currentColor+colorList.length-1)%colorList.length;
	}
	changeMenu(param);
	loadCurrentKamooi();	
}

function loadCurrentKamooi(){
	ctx.clearRect(0,0,256,256);

	var kamooi = kamooiList[currentKamooi];

	ctx.drawImage(kamooi.faces[currentFace],0, 0);
	if(currentFeature < 12){
		ctx.drawImage(kamooi.features[currentFeature],0,0);
	}

	var img = kamooi.hair[currentHair];
	drawHair(img);

	if(currentKamooi < 2){
		$("#clipb").prop("disabled",false);
		$("#clipf").prop("disabled",false);
		if(currentClip < 5)
			ctx.drawImage(kamooi.hairclip[currentClip],128,32);

	}else{
		$("#clipb").prop("disabled",true);
		$("#clipf").prop("disabled",true);
	}

}

function drawHair(img){
	ttx.clearRect(0,0,255,255);
	if(currentFilter === "hard-light"){	
		ttx.globalCompositeOperation = "normal";
		ttx.drawImage(img, 0, 0);
		ttx.fillStyle = colorList[currentColor];
		ttx.fillRect(0,0,256,256);
		ttx.globalCompositeOperation = "destination-atop";
		ttx.drawImage(img, 0, 0);
		ttx.globalCompositeOperation = currentFilter;
		ttx.drawImage(img, 0, 0);

		ctx.drawImage(tintcanvas, 0, 0);
	}
	else if(alg === "alg1"){
		ttx.globalCompositeOperation = "normal";
		ttx.drawImage(img, 0, 0);
		ttx.fillStyle = colorList[currentColor];
		ttx.fillRect(0,0,256,256);
		ttx.globalCompositeOperation = "destination-atop";
		ttx.drawImage(img, 0, 0);

		ctx.globalCompositeOperation = "normal";
		ctx.drawImage(img, 0, 0);
		ctx.globalCompositeOperation = "overlay";
		ctx.drawImage(tintcanvas, 0, 0);
		ctx.globalCompositeOperation = "normal";
	}
	else if(alg ==="alg2"){
		ctx.globalCompositeOperation = "normal";


		ttx.globalCompositeOperation = "normal";
		ttx.fillStyle = colorList[currentColor];
		ttx.fillRect(0,0,256,256);
		ttx.globalCompositeOperation = "destination-atop";
		ttx.drawImage(img,0,0);

		htx.clearRect(0,0,255,255);
		htx.globalCompositeOperation = "normal";
		htx.drawImage(img,0,0);
		htx.globalCompositeOperation = "overlay";
		htx.drawImage(tintcanvas, 0, 0);
		htx.globalCompositeOperation = "normal";

		ctx.drawImage(haircanvas, 0, 0);
		ctx.globalCompositeOperation = "normal";	
	}

	ttx.globalCompositeOperation = "normal";
	ttx.clearRect(0,0,255,255);
}


function hex2dec(hex){
	var dec = 0;
	for(var i = 0; i < hex.length; i++){
		var d = hex.charAt(i);
		var num = hexChart[d] * Math.pow(16,hex.length-1-i);
		dec+=num;
	}
	return dec;

}

function initHexChart(){
	var hex = [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'];
	for(var i = 0; i < hex.length; i++){
		hexChart[hex[i]]=i;
	}
}

function dispload(){
	var p = Math.floor(100*(loadednum/targetnum));
	$("#loaderinner").html("Loading... <span>"+p+"</span>%");
	if (p > 75) $("#loaderinner span").css("color","#c3e9f8");
	else if (p > 50)$("#loaderinner span").css("color","#9ad0e6");
	else if (p > 25)$("#loaderinner span").css("color","#78b5cf");

	if(p === 100){
		$("#loader").remove();
	}
}


function changeMenu(param){
	if(param === "kamui"){
		var kgender = (kamooiList[currentKamooi].gender === "fem")?"Female":"Male";
		var ksize = (kamooiList[currentKamooi].size === "reg")?1:2;

		$("#kamooi").html(kgender+" Build "+ksize);

		var clip = $("#clip");
		if(kgender === "Female"){
			if(clip.hasClass("disabled")){
				clip.removeClass("disabled");
				if(currentClip < 5){
					clip.html("Hair Clip "+(currentClip+1));
				}
				else{
					clip.html("None");
				}
			}
		}
		else{
			clip.addClass("disabled");
			clip.html("None");
		}

	}
	else if(param === "face"){
		$("#face").html("Face "+(currentFace+1));
	}
	else if(param === "hair"){
		$("#hair").html("Hair "+(currentHair+1));
	}
	else if(param === "hairclip"){
		var clip = $("#clip");
		if(currentClip < 5){
			clip.html("Hair Clip "+(currentClip+1));
		}
		else{
			clip.html("None");
		}

	}
	else if(param === "features"){
		if(currentFeature < 12){
			$("#features").html("Facial Feature "+(currentFeature+1));
		}
		else{
			$("#features").html("None");
		}
	}
	else if(param === "color"){
		$("#color").html("Hair Color "+(currentColor+1));
	}
}

$(window).load(function(){
	initHexChart();
	initCanvas();
	changeMenu("kamui");
	changeMenu("face");
	changeMenu("hair");
	changeMenu("hairclip");
	changeMenu("features");
	changeMenu("color");
//	initKamooi();
	loadCurrentKamooi();	
});