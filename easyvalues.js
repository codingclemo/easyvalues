var myData = JSON.parse(data);

$(document).ready(function() {
    $("button[name='submit']").click(getResults);
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
    unit: "",
    measure: "",
    graphic: "",
    text: ""
}

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
    console.log(result.measure, result.unit, result.value);
    var calData = myData.calories;
    for (var i = 0; i < calData.length; i++) {
        if (calData[i].bound > result.value) {
            createElement('h1', calData[i].name);
            break;
        }
    }
}

function getResults(){
    console.log("--get results--");
    getMeasure();
    findCategory();
    //console.log(text($("input[name='input'").val()));
}