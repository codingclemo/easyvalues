$(document).ready(function() {
    // $("button[name='submit']").click(getResults);
    $("#input-field").keypress(function(e){
        if (e.which == 13){
            $("#input-field").setAttribute('style', 'display:none'); //hide keyboard on mobile devices does not work
            getResults();
            return false;
        }
    });
    $("#input-field").focus();
    setListeners();
    // zu testzwecken das JSOn auf der console ausgeben - es wird der inhalt vom JSON formatiert mit 4 zeichen einrückungen
    // angezeigt
    //console.log("das geladene JSON File: ", JSON.stringify(myData, null, 4));
});

/*
document.getElementById('formBox').addEventListener('submit', getResults);

function testSubmit(){
    console.log("yup, working.");
}
*/
var result = {
    value: 0,
    multiplier: 1,
    category: "",
    categoryElement: 0,
    unit: "",
    measure: "",
    bound: 0,
    graphic: "",
    text: "",
    name: ""
}

var categoryData;

function getMeasure(){
    console.log("--get measure--");
    //show value
    //$('#result-text').text($("input[name='input']").val());
    var inputString = document.getElementById("input-field").value;
    console.log(inputString);

    result.value = inputString.replace(/\D/g,'');
    console.log(result.value);

    result.unit = inputString.replace(/[0-9, ]/g,'');
    console.log(result.unit);

    

    switch (result.unit) {
        case "km":
            console.log("distance");
            result.measure = "distance";
            categoryData = myData.distance;
            break;
        case "kcal":
            console.log("calories");
            result.measure = "calories";
            categoryData = myData.calories;
            break;
        case "kg":
            console.log("weight");
            result.measure = "weight";
            categoryData = myData.weight;
            break;
        case "t":
            console.log("weight");
            result.value = result.value * 1000;
            result.unit = "kg";
            result.measure = "weight";
            categoryData = myData.weight;
            break;
        case "min":
            console.log("time");
            break;
        case "people":
            console.log("crowd");
            break;
        default:
            console.log("Please enter a valid number including measuring unit");
            break;
    }

    $('#result-text').text(result.value + " " + result.unit);
}

function findCategory(){
    console.log("--find category--");
    
    //result.category = "calories"; //hardcoded for now

    var i = 0;
    for (i = categoryData.length-1; i >= 0; i--) {
        if (categoryData[i].bound <= result.value) {
            result.categoryElement = i;
            break;
        }
    }
    result.name = categoryData[i].name;
    result.multiplier = Math.round(result.value / categoryData[i].bound);
    result.graphic = categoryData[i].image;
    result.bound = categoryData[i].bound;

    $("#result-headline").text(result.multiplier + "x " + result.name);
}

// function generateGraphic(){
//     var categoryElement = categoryData[result.categoryElement].image;
//     var imageCode = "";
//     for ( var i = 0; i < result.multiplier; i++){
//         imageCode = imageCode + '<div class="result-image-flex"><img src="' + result.graphic + '" /></div>'; //width="100px"
//     }
    
//     console.log(imageCode);
//     $(".result-image").html(imageCode);
// }

function draw(){
    var imageWidth = 500;
    var imageHeigth = 300;

    var imageCode = '<canvas id="result-canvas" width="'+imageWidth+'" height="'+imageHeigth+'"></canvas>';
    $(".result-image").html(imageCode);
    var ctx = document.getElementById('result-canvas').getContext('2d');

    var noOfImages = result.multiplier;

    var colImages = Math.floor(Math.sqrt(noOfImages));
    var rowImages = Math.round(noOfImages / colImages);
    if (noOfImages > colImages * rowImages) {
        rowImages = rowImages + 1;
    }

    var newWidth;
    var newHeight;
    var img = new Image();
    img.onload = function() {   
        var originalWidth = img.width;
        var originalHeight = img.height;
        var aspectRatio = originalWidth / originalHeight;

        newHeight = originalHeight;
        newWidth = originalWidth;

        while ( (newHeight * colImages > imageHeigth) || 
                (newWidth * rowImages > imageWidth) ) {
            newHeight = newHeight - 5;
            newWidth = newHeight * aspectRatio;
        }

        var centerSpace = (imageWidth - rowImages*newWidth) / 2;
        var centerHeight = (imageHeigth - colImages*newHeight) / 2;
        var isDraw = true;

        for (var i = 0; i < colImages; i++) {
            for (var j = 0; j < rowImages; j++) {
                if (i+1 == colImages){
                    isDraw = noOfImages >= rowImages * (colImages - 1) + j + 1 ;
                }
                if (isDraw) {
                    ctx.drawImage(img, j*newWidth + centerSpace, i*newHeight + centerHeight, newWidth, newHeight);
                }
            }
        }
    };
    img.src = categoryData[result.categoryElement].image;
    
    // $('#result-canvas').height = colImages*newHeight; //does not work !!!!! why
    // $('#result-canvas').height(colImages * newHeight); 
}


function pluralS(){
    var s="";
    if (result.multiplier > 1) {
        s = "s"};
    return s;
}

function createText(){
    var categoryVerb = "contains";
    // var pluralS = "";
    // if (result.multiplier > 1) {pluralS = "s"};

    var explanation;
    explanation = "One " + result.name + " " + categoryVerb + " around " + result.bound + " " 
                  + result.unit + ". ";
    explanation = explanation + result.value + " " + result.unit + " equals the " + result.category 
                  + " of roughly " + result.multiplier + " " + result.name + pluralS() + ".";

    $('#result-text').text(explanation);
}


function getResults(){
    console.log("--get results--");
    getMeasure();
    findCategory();
    console.log("result.measure: " + result.measure);
    if(result.measure == "distance") {
        $("#result-canvas").remove();
        $(".result-image").html('<div id="map"></div>');
        initMap(result.value);
    } else {
        draw();
    }
    // generateGraphic();
    createText();
}

function setListeners(){

    $(".icon").click(function(){

        var category = this.id;
        category = category.replace('icon-', '');
        getUnit(category);

        var currentInput = $('#input-field').val();
        currentInput = currentInput.replace(/\D/g,'');
        if (currentInput == "") {
            currentInput = "1";
        }

        var unit = getUnit(category);
9
        $("#input-field").val(currentInput + " " + unit);
        $("#input-field").focus();
        $("#input-field").get(0).setSelectionRange(0,0);
        getResults();

    });
}

function getUnit(category){
    console.log(category);
    
    switch (category) {
        case "calories":
            return "kcal";
            break;
        case "crowd":
            return "people";
            break;
        case "distance":
            return "km";
            break;
        case "height":
            return "m";
            break;
        case "speed":
            return "km/h";
            break;
        case "scale":
            return "kg";
            break;
        case "time":
            return "min";
            break;
        case "volume":
            return "l";
            break;
    }
}


// keep this for making the results-canvas responsive:
// 
// $( window ).resize(function() {
//     width = $('.result-image').width(); 
//     $('#result-canvas').width(width);
// });