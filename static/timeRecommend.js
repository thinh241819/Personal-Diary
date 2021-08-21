function getTime() {

    //creat a variable to hold the picture source
    document.getElementById("warn").innerHTML = "";
    document.getElementById("pic").innerHTML = "";
    document.getElementById("instruction").innerHTML = "";
    var img = document.createElement("img");
    var src = document.getElementById("pic");

    //create a variable to hold the selections
    var action = document.getElementById("choice").value;
    var str = document.getElementById("time").value;
    var time = parseInt(str);
    var period = document.getElementById("period").value;

    var am = true;
    if (period == "pm")
    {
        am = false;
        time += 12;
    }


    if (action == "wake up")
    {
        action = "go to bed";
        time -= 8;
        img.src = "https://cdn.pixabay.com/photo/2019/09/27/14/38/zoo-4508682_1280.jpg";
    }
    else
    {
        action = "wake up";
        time += 8;
        img.src = "https://cdn.pixabay.com/photo/2017/06/14/17/23/haan-2402767_1280.jpg";
    }

    // fixing the time and am/pm
    if ( time < 0 )
    {
        time += 12;
        am = false;
    }
    else if (time < 12)
    {
        am = true;
    }
    else if (time == 12)
    {
        am = false;
    }
    else if (time < 24)
    {
        time -= 12;
        am = false;
    }
    else if (time > 24)
    {
        time -= 24;
        am = true;
    }
    else
    {
        time = 12;
        am = true;
    }

    // output result

    period = am? "am" : "pm";

    if ( (action == "go to bed" && am && time != 0) || (action == "wake up" && !am))
    {
        document.getElementById("warn").innerHTML = "Your sleep schedule seems to be a little bit out of the usual. But hey, it is what it is."
                + " Try to keep up consistency of the schedule to ensure the best quality of sleep";
        img.src = "https://cdn.pixabay.com/photo/2017/10/03/16/39/spooky-2813134_1280.jpg";

    }
    document.getElementById("recommend").innerHTML = "You should " + action + " at:";
    document.getElementById("decor").innerHTML = time + " " + period;

    // add the img source to the html page
    src.appendChild(img);
}
