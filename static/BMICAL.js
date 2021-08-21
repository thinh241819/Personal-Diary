function bmi() {
    // Get feet and inches value
    document.querySelector("p").innerHTML = "";
    let feet = document.querySelector(".feet").value;
    let inch = document.querySelector(".inch").value;
    //Merge feet and inches value in one
    let metre = feet + "." + inch;
    //Feet to metre conversion and get the height in metre
    let height = metre / 3.2808;
    //Get weight value
    let weight = document.querySelector(".weight").value;
    //BMI calculation
    let bmi = weight / Math.pow(height, 2);
    //BMI calculation showing in p tag with condition
    if(bmi < 18.5)
    {
        document.querySelector("p").innerHTML = "Your Body Mass Index (BMI) is-: "+(Math.round(bmi*100)/100).toFixed(2) + "<br>" + " Index Value is Under Weight";

    }
    else if(bmi >= 18.6 && bmi <= 24.9)
    {
        document.querySelector("p").innerHTML = "Your Body Mass Index (BMI) is-: "+(Math.round(bmi*100)/100).toFixed(2) + "<br>" + " Index Value is average.";
    }

    else if(bmi >= 25 && bmi <= 29.9)
    {
        document.querySelector("p").innerHTML = "Your Body Mass Index (BMI) is-: "+(Math.round(bmi*100)/100).toFixed(2) + "<br>" + " Index Value is in Over Weight";

    }
    else if (bmi > 30)
    {
        document.querySelector("p").innerHTML = "Your Body Mass Index (BMI) is-: "+(Math.round(bmi*100)/100).toFixed(2) + "<br>" + " Index Value is in Obesity";

    }
    else
    {
        document.querySelector("p").innerHTML = "Typo dectected, please try again. Maybe just number this time.";
    }


}
//Click Event Fire on Calculate Button
