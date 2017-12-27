$(document).ready(function() {
    $("button[name='submit']").click(getResults);
});

// enables submitting by pressing "return"   <---- DOES NOT WORK
$("input[name='input']").keyup(function(event) {
    if (event.keyCode === 13) {
        console.log("you pressed it dawg!")
        $("button[name='submit']").click(getResults);
    }
});


var result = {
    value: 0,
    multiplier: 1,
    unit: "",
    measure: "",
    graphic: "",
    text: ""
}

function getMeasure(){
    //show value
    $('#result-text').text($("input[name='input']").val());
    var inputString = document.getElementById("input-field").value;
    console.log(inputString);

    var correctValue = inputString.replace(/\D/g,'');
    console.log(correctValue);

    var unit = inputString.replace(/[0-9, ]/g,'');
    console.log(unit);

    switch (unit) {
        case "km":
            console.log("distance");
            break;
        case "kcal":
            console.log("calories");
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
}

function getResults(){
    getMeasure();
    //console.log(text($("input[name='input'").val()));
}