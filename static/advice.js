function getOption() {

    //creat a variable to hold the picture source
    document.getElementById("pic").innerHTML = "";
    var img = document.createElement("img");
    var src = document.getElementById("pic");

    //create a variable to hold the selectection
    var obj = document.getElementById("mySelect");

    // The code below is just a series of if-else if to go down the selection of the user and choose the right answer based on that selection
    if (obj.options[obj.selectedIndex].text == "Alarm")
    {
         img.src = "https://cdn.pixabay.com/photo/2018/01/21/22/26/still-life-3097682_1280.jpg";
         document.querySelector('#result').innerHTML = "Waking up is hard, of course it is!"
                        +" But staying in bed doesn't solve the problem most of the time. Try to set up the alarm as late as possible to "
                        +"reduce the probability of you hitting the snooze button. Also look to put the alarm far apart from the bed so that you"
                        +" can force yourself to get out of bed. It's also recommended for you to drink a cup of water to force your body in action,"
                        +" so having a cup of water near the alarm also helps.";
    }
    else if (obj.options[obj.selectedIndex].text == "Bed")
    {
         img.src = "https://cdn.pixabay.com/photo/2014/08/11/21/40/wall-416062_1280.jpg";
         document.querySelector('#result').innerHTML = "Your sheets and blankets play a major role in helping your bed feel inviting. "
         + "Look for bedding that feels comfortable to the touch and that will "
         + "help maintain a comfortable temperature during the night.";
    }
    else if (obj.options[obj.selectedIndex].text == "Lighting")
    {
         img.src = "https://cdn.pixabay.com/photo/2015/07/13/16/49/night-table-lamp-843461_1280.jpg";
         document.querySelector('#result').innerHTML = "Excess light exposure can throw off your sleep and circadian rhythm. "
                        + "Blackout curtains over your windows or a sleep mask for over your eyes can block "
                        + "light and prevent it from interfering with your rest.";
    }
    else if (obj.options[obj.selectedIndex].text == "Temperature")
    {
         img.src = "https://cdn.pixabay.com/photo/2014/04/27/11/47/cat-333075_1280.jpg";
         document.querySelector('#result').innerHTML = "You don’t want your bedroom temperature to be a distraction by "
                           +"feeling too hot or too cold. The ideal temperature can vary based "
                           +"on the individual, but most research supports sleeping in a cooler "
                           +"room that is around 65 degrees.";
    }
    else if (obj.options[obj.selectedIndex].text == "Pillow & Mattress")
    {
         img.src = "https://cdn.pixabay.com/photo/2017/08/01/16/50/pillow-2566613__480.jpg";
         document.querySelector('#result').innerHTML = "A quality mattress is vital to making sure that you are "
                            + "comfortable enough to relax. It also ensures, along with your pillow, "
                            + "that your spine gets proper support to avoid aches and pains.";
    }
    else if (obj.options[obj.selectedIndex].text == "Schedule")
    {
         img.src = "https://cdn.pixabay.com/photo/2017/01/18/17/52/calendar-1990453_1280.jpg";
         document.querySelector('#result').innerHTML = "It’s clear that scheduling your day is valuable. "
                            + "However, you can’t just throw stuff onto your Cute Kittens calendar and hope for a productive life. "
                            + "Set up priority from highes to lowest to make sure the most important tasks are focused on. "
                            + "Remember to leave out time for relaxing and break time from task to task to ensure your efficiency. "
                            + "And of course try to stick with the schedule so that the whole plan doesn't get push back.";
    }
    else if (obj.options[obj.selectedIndex].text == "Rest time")
    {
         img.src = "https://cdn.pixabay.com/photo/2016/03/27/22/22/fox-1284512__480.jpg";
         document.querySelector('#result').innerHTML = "Concentration and focus are our ultimate productivity weapons, and they need to be protected. "
                            + "So set up a small break time every 50 minutes to make sure you are still on top of your games. Distract yourself to recharge "
                            + "your focus. Yes, it really works. One way to do this is to overload your cognitive abilities by multitasking on your break. "
                            + "It might seem counterintuitive to add more cognitive strain during a break, but the key here is to force your mind off the "
                            + "work at hand.";
    }
    else if (obj.options[obj.selectedIndex].text == "Food")
    {
         img.src = "https://cdn.pixabay.com/photo/2020/05/30/18/52/kitchen-5239995__480.jpg";
         document.querySelector('#result').innerHTML = "Make yourself a priority and take time to care for yourself. Everyone has their own favorite food. But too much can be bad. "
                            + "Use a smaller plate at meals to help control the amount of food and calories you eat, and "
                            + "take your time to enjoy the smaller amounts of food. Quanlity over quantity. Start to learn how to cook by yourself to ensure the healthiness "
                            + "of your food. Try out healthier recipes that use less solid fat, salt, and sugar. Eat at home more often so you can control what you are eating. "
                            + "If you eat out, check and compare nutrition information. Choose healthier options such as baked chicken instead of fried chicken.";
    }
    else if (obj.options[obj.selectedIndex].text == "Drink")
    {
        img.src = "https://cdn.pixabay.com/photo/2018/07/21/10/28/animal-world-3552297__480.jpg";
        document.querySelector('#result').innerHTML = "We don't want to sound like a brag. But you need to drink your water. Try to give yourself enought "
                            + "water a day (more than 2 litter, or half a galon). Get yourself a jug of water that can totally filled up that requirement "
                            + "just so you know how much do you need to drink a day. Use nature flavor, such as lemon, cucumber, etc. to spice up the flavor "
                            + "if you feel like it's to bland (well it's water afterall).";
    }
    else if (obj.options[obj.selectedIndex].text == "Please choose one of the categories below")
    {
        img.src = "https://cdn.pixabay.com/photo/2016/02/19/11/53/pug-1210025__480.jpg";
        document.querySelector('#result').innerHTML = 'Please choose a category, we are waiting!';
    }
    // add the img source to the html page
    src.appendChild(img);
}
