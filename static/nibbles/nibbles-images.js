var Snake = Snake || {};

Snake.loadImages = function()
{
    //set up images
    Snake.imageFiles[Snake.gridTypes.FLOOR] = ["https://cdn.discordapp.com/attachments/750926829858193430/782758560954056744/floor.png", null];
    Snake.imageFiles[Snake.gridTypes.WALL] = ["https://cdn.discordapp.com/attachments/750926829858193430/782758551755030548/wall.png", null];
    Snake.imageFiles[Snake.gridTypes.SNAKE] = ['https://cdn.discordapp.com/attachments/750926829858193430/782758571788075018/food.png', null];
    Snake.imageFiles[Snake.gridTypes.FOOD] = ['https://cdn.discordapp.com/attachments/750926829858193430/782758539990794260/snake.png', null];



    Snake.imagesLoaded = 0;

    for(var i = 0; i < Snake.imageFiles.length; ++i)
    {
        var item = Snake.imageFiles[i];
        item[1] = new Image();
        item[1].src = item[0];
        item[1].onload = Snake.onImageLoaded;
    }
}

Snake.onImageLoaded = function()
{
    ++Snake.imagesLoaded;
}

Snake.waitForImages = function(callback)
{
    window.setTimeout(function()
    {
        if(Snake.imagesLoaded != Snake.imageFiles.length)
        {
            window.setTimeout(arguments.callee, 10);
        }
        else
        {
            callback();
        }
    }, 0);
}
