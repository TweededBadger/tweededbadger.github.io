 var about = (function () {
            var $currentItem;

            function init() {
                setupSections();
                setupListeners();
                checkPos();
            }
            setupSections = function () {
                $(".section").each(function (e) {
                    $section = $(this);
                    $section.attr('data-debug', 999);
                    this.fixedsection = $section.find(".fixed");
                });
            }
            setupListeners = function () {
                $(window).scroll(function () {
                    checkPos();
                });

                $(".controls a").click(function(e) {
                    gotoNextSection();
                    return false;
                })

                $(".links a").click(function(e) {
                    analyticsTrack("/link/"+$(this).data("analytics"));
                })
            }

            gotoNextSection = function() {

                if ($currentItem.length == 0) {
                    var next = $(".tools").next();
                } else {
                    var next = $currentItem.parent().next();
                }
                console.log(next);
                if (next.length == 0) {
                     var next = $(".section1");
                }
                next.animatescroll({scrollSpeed:1000,easing:'easeInOutQuad'});


            }
            analyticsTrack = function(path) {
                ga('send', 'pageview', path);
                console.log("Analytics Track: "+ path);
            }
            selectCurrent = function ($elem) {
                if ($currentItem != $elem) {
                    if ($currentItem) {
                        if ($elem != $currentItem) {
                            $currentItem.removeClass('active');
                        } else {
                            return false;
                        }
                    }
                    $elem.addClass('active');
                    $currentItem = $elem;

                    if ($elem.length == 0) {
                        $(".tools").addClass('active');
                        $(".base").addClass('badgerhide');
                        analyticsTrack("/"+$(".tools").data("analytics"));
                    } else {
                        $(".tools").removeClass('active');
                        $(".base").removeClass('badgerhide');

                        analyticsTrack("/"+$elem.parent().data("analytics"));
                    }

                    if ($elem.parent().next().length != 0 || $elem.length == 0) {
                        $(".controls").removeClass('rotate');
                    } else {
                        $(".controls").addClass('rotate');
                    }

                }
            }
            checkPos = function () {
                var h = $(window).height();
                var foundactive = false;
                $(".section").each(function (e) {
                    $section = $(this);
                    bounding = this.getBoundingClientRect();

                    if (bounding.top < 0) {
                        var sh = bounding.bottom;
                    } else {
                        var sh = h - bounding.top;
                    }
                    if (sh > (h / 2)) {
                        selectCurrent(this.fixedsection);
                        foundactive = true;
                    }


                    $section.attr('data-debug', sh + " bb:" + bounding.bottom + " bt:" + bounding.top);


                });
            }
            return { init: init };
        })();
        about.init();