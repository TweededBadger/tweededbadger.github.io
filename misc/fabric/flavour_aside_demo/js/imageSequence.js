/*
 * ImageSequence v0.1
 * Copyright (c) 2014 Dofl Yun, thedofl.com
 * MIT License [http://www.opensource.org/licenses/mit-license.php]


 Support URL:
 https://github.com/thedofl/imageSequence.js



 // Quick Usage
 Here is a minimum code to use quickly. As soon as all images are loaded, the animation would start automatically and loop as default.

 1.Simply create an img tag having an ID in your html page.
 <img id="seqHolder" src="" />

 2.Create an instance with minimum parameters in your script
 var imgTagID = "seqHolder";
 // image number counts from '0'
 var imgFilePath = "images/seq_x.jpg";
 var imgTotal = 60;
 var frameRate = 30;
 var mAni = new ImageSequence(imgTagID, imgFilePath, imgTotal, frameRate);
 mAni.loadSeq();


 */




var ImageSequence = function(inImgTagID, inImageFilePath, inImageTotal, inFrameRate)
{
    this.imgTagID = inImgTagID;
    this.$imgTag = $('#' + this.imgTagID);

    this.imgTag = document.getElementById( this.imgTagID );

    var imageFilePath = inImageFilePath.split(".");
    this.imageFileName = imageFilePath[0].split("x")[0];
    this.imageFileFormat = imageFilePath[1];
    this.imageTotal = inImageTotal;
    this.frameRate = typeof inFrameRate !== 'undefined' ? inFrameRate : 24;



    this.prerenderedImageID = this.imgTagID;
    this.imageW, this.imageH;
    this.timer;
    this.currentNum = 0;

    this.isFirstLoop = true;
    this.isAnimationOn = false;






    // Play properties
    this.autoPlay = true;
    this.autoLoop = true;


    this.loopDirection = ImageSequence.CONST_LOOP_DIR_BASIC;

    this.playDir = 1;


    // Event Callbacks
    this.sequenceIsReadyFunc = $.noop;
    this.finishedLoadFunc = $.noop;
    this.updateLoadFunc = $.noop;
    //this.finishedAnimationFunc = $.noop;





    this.settings = {
        frameRate: '',
        imagePath: ''

    }


};

ImageSequence.CONST_LOOP_DIR_BASIC = "loop_dir_basic";
ImageSequence.CONST_LOOP_DIR_PINGPING = "loop_dir_pingPong";


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////// PUBLIC METHODS
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

ImageSequence.prototype.loadSeq = function(inAutoPlay, inAutoLoop)
{

    if(typeof inAutoPlay !== 'undefined') this.autoPlay = inAutoPlay;
    if(typeof inAutoLoop !== 'undefined') this.autoLoop = inAutoLoop;




    // Generate Image Loader tag
    var imgLoaderTagID = this.imgTagID + "_loader";
    var imgLoaderTag = '<div id="' + imgLoaderTagID + '" ></div>';
    $('body').append(imgLoaderTag);

    this.$imgLoader = $('#' + imgLoaderTagID);
    this.$imgLoader.css({"position":"absolute", "visibility":"hidden", "top":"-9000px"});


    var id;
    for(var i = 0; i< this.imageTotal; i++)
    {
        var imgPath = this.imageFileName + i + "." +this.imageFileFormat;
        id = this.prerenderedImageID + i;
        this.$imgLoader.append('<img src=' + imgPath + ' id=' + id + ' style="position:absolute;">');

    }


    // Check if images are loaded
    psyImageLoader.loadByContainer( this.$imgLoader, $.proxy(this.onLoadedSequence, this),$.proxy(this.onUpdateLoadSequence, this));

};



ImageSequence.prototype.play = function()
{
    if(this.isAnimationOn) return;
    this.loop();


    this.isAnimationOn = true;
//
    var self = this;
    this.timer = setInterval( function ()
    {
        self.loop();

    }, 1000 / this.frameRate );

};

ImageSequence.prototype.pause = function()
{
    if(!this.isAnimationOn) return;


    this.isAnimationOn = false;


    if(!this.timer) return;
    clearInterval( this.timer );
}
ImageSequence.prototype.stop = function()
{
    if(!this.isAnimationOn) return;

    this.pause();
    this.currentNum = 0;
};


ImageSequence.prototype.nextFrame = function()
{
    this.currentNum++;
    if(this.currentNum >= this.imageTotal) this.currentNum = this.imageTotal;

    this.drawCurrentFrame();
};

ImageSequence.prototype.prevFrame = function()
{
    this.currentNum--;
    if(this.currentNum < 0) this.currentNum = 0;

    this.drawCurrentFrame();
};


ImageSequence.prototype.gotoAndPlay = function(inNum)
{

    this.pause();

    this.currentNum = inNum;
    this.play();
}

ImageSequence.prototype.gotoAndStop = function(inNum)
{
    this.pause();

    this.currentNum = inNum;
    this.drawCurrentFrame();


}



/* ---------------------------------------------------------------------------------
 *
 * DISPOSE
 *
 --------------------------------------------------------------------------------- */
ImageSequence.prototype.dispose = function()
{
    this.pause();

    this.$imgLoader.remove();


};






//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////// PRIVATE METHODS
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////


ImageSequence.prototype.onUpdateLoadSequence = function(inLoadedImages, inTotalImages)
{
    this.updateLoadFunc(inLoadedImages, inTotalImages);

};

ImageSequence.prototype.onLoadedSequence = function()
{



    // Call finished callback
    this.finishedLoadFunc();


    // Check Image Size
    var dummyImgTag = document.getElementById(this.prerenderedImageID + 0);
    this.imageW = dummyImgTag.clientWidth;
    this.imageH = dummyImgTag.clientHeight;




    var self = this;
    setTimeout(function()
    {
        if(self.autoPlay)
        {
            self.play();
        }
        else
        {
            self.gotoAndStop(0);
        }

        //self.setImageTagSize();
        self.sequenceIsReadyFunc(); // Call ready callback




    },10);


};


/*
ImageSequence.prototype.setImageTagSize = function()
{
    $(this.$imgTag).attr({
        width: this.imageW + "px",
        height: this.imageH + "px"
    });
}
*/


ImageSequence.prototype.loop = function()
{

    if(this.loopDirection == ImageSequence.CONST_LOOP_DIR_BASIC)
    {
        this.currentNum ++;
        if(this.currentNum >= this.imageTotal)
        {
            if(this.autoLoop)
            {
                this.currentNum = 0;
            }
            else
            {
                this.currentNum = this.imageTotal -1;
                this.pause();
            }

        }
    }
    else if(this.loopDirection == ImageSequence.CONST_LOOP_DIR_PINGPING)
    {
        this.currentNum += this.playDir;
        if(this.currentNum >= this.imageTotal)
        {
            if(this.autoLoop)
            {
                this.playDir = -1;
                this.currentNum = this.imageTotal -2;
            }
            else
            {
                this.currentNum = this.imageTotal -1;
                this.pause();
            }

        }
        else if (this.currentNum < 0)
        {
            if(this.autoLoop)
            {
                this.playDir = 1;
                this.currentNum = 1;
            }
            else
            {
                this.currentNum = 0;
                this.pause();
            }


        }
    }





    this.drawCurrentFrame();



    // TODO - check if still need or set first time
    // Set 'Display' as 'none' to get better performance
    // It makes slow animation if set first time so handle end of animation
    if(this.isFirstLoop)
    {
        if(this.currentNum >= this.imageTotal)
        {
            if(this.isFirstLoop)
            {
                this.isFirstLoop = false;
                this.$imgLoader.css({"display": "none"});
            }
        }
    }


};

ImageSequence.prototype.drawCurrentFrame = function()
{
    var src = this.imageFileName + this.currentNum + "." +this.imageFileFormat;
    $(this.$imgTag).attr("src", src);

};



//
//
// IMAGE LOADER
// by Emily Park
//
//
//

var psyImageLoader = psyImageLoader || ( function () {
    function loadByContainer($obj, finishedFunc, eachFunc){
        var lists = [];
        var totalUnloadedImages = 0;
        var completedImages;

        finishedFunc = finishedFunc || $.noop;
        eachFunc = eachFunc || $.noop;

        $obj.find('*').each(function(i){
            var url;
            if($(this).attr('src') && this.nodeName == "IMG")
            {
                url = $(this).attr('src');
            }
            else if($(this).css('backgroundImage'))
            {
                url = $(this).css('backgroundImage');
            }
            if(url && url != 'none')
            {
                url = url.replace('url(', '');
                url = url.replace(')', '');
                url = url.replace(/"/g, '');
                lists[totalUnloadedImages++] = url;
            }
        });

        if(totalUnloadedImages == 0)
        {
            eachFunc(1, 1);
            finishedFunc();
            return;
        }
        var date = new Date();
        var loaderID = date.getTime();
        $obj.attr('loaderID', loaderID);
        completedImages = totalUnloadedImages;
        function loadCompletedHandler()
        {
            completedImages--;
            eachFunc(totalUnloadedImages - completedImages, totalUnloadedImages);
            if(completedImages == 0){
                $obj.removeAttr('loaderID');
                finishedFunc();
            }
        }
        for(var i=0; i<totalUnloadedImages; i++)
        {
            var $img = $('<img src="' + lists[i] + '"></img>');
            $img.bind('load', function(){
                loadCompletedHandler();
            }).error(function(){
                    loadCompletedHandler();
                    console.log('error');
                });
        }
    }

    return {
        loadByContainer:loadByContainer
    }
} )();







