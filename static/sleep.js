function timeCal()
{
    let time = 0;
    let age  = 0;
    time = document.querySelector('#time').value;
    age  = document.querySelector('#age').value;
    if (time == 0 || age == 0)
    {
        document.querySelector('#result').innerHTML = "Uhm we didn't see your input. Please try again!";
    }
    else if(invalid(time, age))
    {
        document.querySelector('#result').innerHTML = 'Typo can be a pain. Try again!';
    }
    else
    {
        if (time > 10)
        {
            document.querySelector('#result').innerHTML =
                    'Sleeping can be addicted. But try to keep it down, too much can be harmful!';
        }
        if (age < 17)
        {
            if (time < 8)
                document.querySelector('#result').innerHTML =
                    'You are still young, get some more sleep (about 8-10 hours)';
            else if (time < 10)
                 document.querySelector('#result').innerHTML =
                    'Congrats! U got enough sleep for a healthy teenager!';
        }
        else if (age < 64)
        {
            if (time < 7)
                document.querySelector('#result').innerHTML =
                    'Life is hard, we know! But you should sleep more (about 7-9 hours)';
            else if (time < 9)
                 document.querySelector('#result').innerHTML =
                    'Great job! That should be sufficient for an average adult!';
        }
        else
        {
            if (time < 7)
                document.querySelector('#result').innerHTML =
                    'Your health is the most important factor of this age. Sleep more! (about 7-8 hours)';
            else if (time < 8)
                document.querySelector('#result').innerHTML =
                    'You are doing great for an elderly person. Keep it up!';
            else
            {
                document.querySelector('#result').innerHTML =
                    'Old age made it harder too wake up! But it doesn\'t help you to sleep that much!';
            }
        }
    }
}

function invalid(time, age)
{
    return (isNaN(time) || time > 24 || time <= 0
                ||isNaN(age) || age <= 0 || age > 100);
}