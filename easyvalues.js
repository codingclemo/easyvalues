$(document).ready(function() {
    $("#input-field").focus();
    // $("button[name='submit']").click(getResults);
    $("#input-field").keypress(function(e){
        if (e.which == 13){
            // $("#input-field").setAttribute('style', 'display:none'); //hide keyboard on mobile devices does not work
            getResults();
            return false;
        }
    });

    setListeners();
    // zu testzwecken das JSOn auf der console ausgeben - es wird der inhalt vom JSON formatiert mit 4 zeichen einrückungen
    // angezeigt
    //console.log("das geladene JSON File: ", JSON.stringify(myData, null, 4));
});


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
    verb: "",
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
            result.verb = "XXXXXXX";
            categoryData = myData.distance;
            break;
        case "kcal":
            console.log("calories");
            result.measure = "calories";
            result.verb = "contains";
            categoryData = myData.calories;
            break;
        case "kg":
            console.log("weight");
            result.measure = "weight";
            result.verb = "weighs";
            categoryData = myData.weight;
            break;
        case "t":
            console.log("weight");
            result.value = result.value * 1000;
            result.unit = "kg";
            result.measure = "weight";
            result.verb = "weighs";
            categoryData = myData.weight;
            break;
        case "l":
            console.log("volume");
            result.measure = "volume";
            result.verb = "fits";
            categoryData = myData.volume;
            break;
        case "min":
            console.log("duration");
            result.measure = "duration";
            result.verb = "lasts";
            categoryData = myData.duration;
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

    // $("#result-headline").text(result.multiplier + "x " + result.name);
}

// Old code of how I wasted hours trying to use grid-layout for displaying multiple images
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
    var imageWidth = 600;
    var imageHeigth = 350;

    console.log("imagewidth: " + imageWidth);

    var imageCode = '<canvas id="result-canvas" width="'+imageWidth+'" height="'+imageHeigth+'"></canvas>';
    $(".result-image").html(imageCode);
    var ctx = document.getElementById('result-canvas').getContext('2d');

    var noOfImages = result.multiplier;

    var colImages = Math.floor(Math.sqrt(noOfImages));
    var rowImages = Math.round(noOfImages / colImages);
    if (noOfImages > colImages * rowImages) {
        rowImages = rowImages + 1;
    }

    var newHeight;
    var newWidth;
    var img = new Image();
    img.onload = function() {
        var originalHeight = img.height;
        var originalWidth = img.width;
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
    console.log(img.src);
    // $('#result-canvas').height = colImages*newHeight; //does not work !!!!! why
    // $('#result-canvas').height(colImages * newHeight);
}


function pluralS(){
    var s="";
    if (result.multiplier > 1) {
        if( (result.name.charAt(result.name.length - 1) != "s") &&
            (result.name != "cherry tomato") ) {
            console.log("pluralS: add an s");
            s = "s"
        } else {
            console.log("pluralS: add es");
            s = "es";
        }
    }
    return s;
}

function addCommas(nStr) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

function createText(){
    //add commas to numbers
    var textMultiplier = addCommas(result.multiplier);
    var textValue = addCommas(result.value);
    var textUnit = addCommas(result.unit);

    //create headline
    $("#result-headline").text(textMultiplier + "x " + result.name + pluralS());

    //create text
    var explanation;
    explanation = textValue + " " + textUnit + " equals the amount" +
                 " of roughly " + result.multiplier + " " + result.name + pluralS() + ". ";

    explanation += " One " + result.name + " " + result.verb + " around " + result.bound + " "
                 + textUnit + ". \r \n ";

    $('#result-text').text(explanation);

    // set text color
    $(".result-content").css({"color" : "white"});

    //change id in order to change the background color
    $(".result-content").attr('id', '' + result.measure + '');
}

function addIcon(){

    // remove icon if one exists
    if ($('#symbol').length != 0) {
        $('#symbol').remove();
    }

    // add new icon
    var object = '<object id="symbol" type="image/svg+xml" data="icons/' + result.measure + '.svg" width="40" height="40" fill="white"></object>';
    $(".result-content").append(object);


    // change color of the symbol
    // I don't know how so I changed the color of the svg itself `-_o_-´

}


function getResults(){

    // hide the keyboard on mobile devices
    // window.hideVirtualKeyboard();   //does not work as planned
    setTimeout(_ => {
        window.hideVirtualKeyboard()
      }, 250);

    // create div-structure
    if ($('.result-content').length != 0) {
        $(".result-content").fadeOut();
        $(".result-content").remove();
    }

    $("main").append('<div class="result-content" style="display: none;">');
    $(".result-content").fadeIn("slow");
    $(".result-content").append('<div class="result-image"></div>');
    $(".result-content").append('<h3 id="result-headline"></h3>');
    $(".result-content").append('<p id="result-text"></p></div>');

    $("#result-text").focus();

    // $('.result-content').focus();

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
    // generateGraphic();  //former grid-layout code
    createText();
    addIcon();
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
        case "weight":
            return "kg";
            break;
        case "duration":
            return "min";
            break;
        case "volume":
            return "l";
            break;
    }
}
