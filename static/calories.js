
let result = 0;


function resetAll(){
    document.getElementById("instruction").innerHTML = "";
    result = 0;
    document.getElementById("result").innerHTML = "The result has been reset. Please enter in the new data!";
    document.getElementById("text").innerHTML = "";
    document.getElementById("pic").innerHTML = "";
    var img = document.createElement("img");
    var src = document.getElementById("pic");
    img.src = "https://cdn.pixabay.com/photo/2013/11/01/11/13/dolphin-203875_1280.jpg";
    src.appendChild(img);
}
function calories(){
    document.getElementById("instruction").innerHTML = "";
    document.getElementById("pic").innerHTML = "";
    var img = document.createElement("img");
    var src = document.getElementById("pic");
    let cal  = parseInt(document.querySelector('#amount').value);
    if (invalid(cal))
    {
        document.getElementById("result").innerHTML = "Typo dectected, please try again!";
        img.src = "https://cdn.pixabay.com/photo/2015/03/10/06/30/boy-666803_1280.jpg";
        src.appendChild(img);
    }
    else
    {

        let male = document.getElementById("choice").value == "Male" ? true: false;
        let recom = male? 2500 : 2000;


        result += cal;
        if (result < recom/2)
        {
            document.getElementById("result").innerHTML = "Your total: [" + result +" out of " +recom +"]";
            document.getElementById("text").innerHTML = "You heard the cat!";
            img.src = "https://cdn.discordapp.com/attachments/750926829858193430/775149170365431808/Screen_Shot_2020-11-08_at_16.05.59.png";
        }
        else if (result < recom-750)
        {
            document.getElementById("result").innerHTML = "Your total: [" + result +" out of " +recom +"]";
            document.getElementById("text").innerHTML = "Even Kylo knows it."

            img.src = "https://cdn.discordapp.com/attachments/750926829858193430/775148856094359552/Screen_Shot_2020-11-08_at_16.04.28.png";
        }
        else if(result < recom - 400)
        {
            document.getElementById("result").innerHTML = "Your total: [" + result +" out of " +recom +"]";
            document.getElementById("text").innerHTML = "Good job, you have been closed to the goal. Now slow down.";
            img.src = "https://cdn.pixabay.com/photo/2017/10/10/05/12/street-2836031_1280.jpg";
        }
        else if((recom - 1000) > result || result < (recom + 100))
        {
            document.getElementById("result").innerHTML = "Your total: [" + result +" out of " +recom +"]";
            document.getElementById("text").innerHTML = "You have reached the recommennded amount. It's time to stop";
            img.src = "https://cdn.pixabay.com/photo/2016/10/11/21/21/sign-1732791_1280.jpg";
        }
        else{
            document.getElementById("result").innerHTML = "Your total: [" + result +" out of " +recom +"]";
            document.getElementById("text").innerHTML = "We mean it! Not meme it!";
            img.src = "https://cdn.discordapp.com/attachments/750926829858193430/775150022366068786/Screen_Shot_2020-11-08_at_16.09.21.png";
        }
        src.appendChild(img);
    }

}

function invalid(cal)
{
    return (isNaN(cal) || cal < 1 || cal > 3000);
}

// function getTime() {

//     //creat a variable to hold the picture source
//     document.getElementById("warn").innerHTML = "";
//     document.getElementById("pic").innerHTML = "";
//     document.getElementById("instruction").innerHTML = "";
//     var img = document.createElement("img");
//     var src = document.getElementById("pic");


//     var action = document.getElementById("choice").value;
//     var str = document.getElementById("time").value;
//     var time = parseInt(str);
//     var period = document.getElementById("period").value;


//     document.getElementById("recommend").innerHTML = "You should " + action + " at:";
//     document.getElementById("decor").innerHTML = time + " " + period;

//     // add the img source to the html page
//     src.appendChild(img);
// }
