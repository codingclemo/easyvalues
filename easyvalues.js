$(document).ready(function() {
    $("button[name='submit']").click(getResults);

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
            break;
        case "kcal":
            console.log("calories");
            result.measure = "calories";
            categoryData = myData.calories;
            break;
        case "t" || "kg":
            console.log("weight");
            if (result.unit == "t") { 
                result.value = result.value * 1000;
                result.unit = "kg";}
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
    //$("#result-image").html('<img src="' + result.graphic + '" width="100px" />');
}

function generateGraphic(){
    var categoryElement = categoryData[result.categoryElement].image;
    var imageCode = "";
    for ( var i = 0; i < result.multiplier; i++){
        imageCode = imageCode + '<div class="result-image-flex"><img src="' + result.graphic + '" /></div>'; //width="100px"
    }
    
    console.log(imageCode);
    $(".result-image").html(imageCode);
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
    generateGraphic();
    createText();
    //console.log(text($("input[name='input'").val()));
}