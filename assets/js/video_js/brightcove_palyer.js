//////////////////////// Bright Cove Player START /////////////////////////
$(document).ready(function() {
    $(document).on("click", ".scrollLink", function(event) {
        event.preventDefault();
        var myDiv = document.getElementById('top');
        // myDiv.innerHTML = variableLongText;
        myDiv.scrollTop = 0;
    });
});


// Stories Player integration A@
// storiesPlayerpopup
var nextBtnCount = 0;
var nextstorycount = 0;
var nextstoryid = "";
var prevstoryid = "";
$(document).on("click", ".storiesPlayerpopup, .nextStoryBtn, .previousStoryBtn", function(e) {
    var mainurl = window.location.href;
    var isNext = $(this).attr("is-next");
    var isPrev = $(this).attr("is-prev");
    var $this = $(this);
    var objCount = 0;
    var mediaId = "";
    var mediaidTitle = "";
    var ulId = $this.attr('id');
    var objectArr = [];
    var mediaidTitleArr = [];

    if (localStorage.getItem("objectArr") === null) {
        // alert("new stroy");
        $('.progressBar').html('');
        $('#myPlayersStories').css('animation', 'myfirst 0.8s ease-in-out');
        setTimeout(function() {
            $('#myPlayersStories').css('animation', '');
            $('#myPlayersStories').css('animation-play-state', 'paused');
        }, 3000);

        $('#' + ulId + ' li').each(function() {
            objectArr.push($(this).attr('mediaId'));
            mediaidTitleArr.push($(this).attr('mediaidtitle'));
            $('.progressBar').append('<progress id="progress_' + $(this).attr('mediaId') + '" max="100" value="0">Progress</progress>');
            // $('.stories-title').append('<span>'+$(this).attr('mediaidtitle')+'</span>');
        });
        localStorage.setItem("objectArr", JSON.stringify(objectArr));
        localStorage.setItem("mediaidTitleArr", JSON.stringify(mediaidTitleArr));
        if (true == $(this).next('ul').is(':visible')) {
            nextstoryid = $(this).next('ul').attr('id');
            $('video-js').addClass("video-js-anim");
        } else {
            nextstoryid = '';
        }
        if (true == $(this).prev('ul').is(':visible')) {
            prevstoryid = $(this).prev('ul').attr('id');

        } else {
            prevstoryid = "";
        }
    } else {
        objectArr = JSON.parse(localStorage.getItem("objectArr"));
        mediaidTitleArr = JSON.parse(localStorage.getItem("mediaidTitleArr"));
    }

    if (isNext == 'true') {
        nextBtnCount = nextBtnCount + 1;
        if (nextBtnCount < objectArr.length) {
            mediaId = objectArr[nextBtnCount];
            mediaidTitle = mediaidTitleArr[nextBtnCount];
        } else {
            if (nextstoryid == '') {
                mediaId = '';
                mediaidTitle = '';
                nextstorycount = 0;
            } else {
                nextstorycount++;
                nextBtnCount = 0;
                localStorage.removeItem('objectArr');
                $('#' + nextstoryid).click();
            }
        }
        $('#progress_' + mediaId).prev('progress').val('100');
    } else if (isPrev == 'true') {
        nextBtnCount = nextBtnCount - 1;
        if (nextBtnCount != -1) {
            mediaId = objectArr[nextBtnCount];
            mediaidTitle = mediaidTitleArr[nextBtnCount];
        } else {
            if (prevstoryid == '') {
                mediaId = '';
                mediaidTitle = '';
                nextstorycount = 0;
            } else {
                nextstorycount++;
                nextBtnCount = 0;
                localStorage.removeItem('objectArr');
                $('#' + prevstoryid).click();
            }
        }
        $('#progress_' + mediaId).next('progress').val('0');
    } else {
        mediaId = objectArr[0];
        mediaidTitle = mediaidTitleArr[0];
    }

    var videoTitle = $(this).attr('data-videoTitle');
    // console.log(videoTitle+"videoTitle");
    var videoView = $(this).attr('data-videoView');
    var videoDate = $(this).attr('data-videoDate');
    var videoslug = $(this).attr('data-videoslug');
    $('.popupview').html(videoView);
    $('.popuptitle').html(videoTitle);
    $('.popupdate').html(videoDate);
    if (mediaId == "") {
        videojs.getPlayer("myPlayersStories").ready(function() {
            var myPlayer = this;
            setTimeout(function() {
                myPlayer.pause();
            }, 500);
        });
        if (nextstorycount <= 0) {
            videojs.getPlayer('myPlayersStories').ready(function() {
                var myPlayer = this;
                setTimeout(function() {
                    myPlayer.pause();
                }, 500);
            });
            $('#storiesModal').modal('hide');
            localStorage.removeItem('objectArr');
            nextBtnCount = 0;
        }
    } else {
        var currentURL = window.location.href;
        var arr = currentURL.split('/')[3];
        if (arr == '' || arr == null || arr == undefined) {
            var mainurl = currentURL + '#';
            window.history.pushState('forward', null, mainurl);
        }

        $('#mediaid').val(mediaId);
        $('.stories-title').html('');
        $('.stories-title').append('<span>' + mediaidTitle + '</span>');
        videojs.getPlayer('myPlayersStories').ready(function() {
            var myPlayer = this;
            myPlayer.catalog.getVideo(mediaId, function(error, video) {
                myPlayer.catalog.load(video);
            });
        });
        $('.vjs-control-bar').hide();
        $(".statusbar").find("[data-mediaId='" + mediaId + "']").addClass('active');
        $('#storiesModal').modal('show');
        $('.ap-vd-pop-container').animate({
            'scrollTop': 0
        }, 1000);

    }
});

$(document).on("click", ".closeplayerstories", function() {
    videojs.getPlayer('myPlayersStories').ready(function() {
        var myPlayer = this;
        myPlayer.pause();
    });
    localStorage.removeItem('objectArr');
    nextBtnCount = 0;
});

function onTrackedVideoFrame(currentTime, duration) {
    var mediaid = $('#mediaid').val();
    document.getElementById("progress_" + mediaid).value = Math.round(
        (currentTime / duration) * 100
    );
}

$(document).ready(function() {
    localStorage.removeItem('objectArr');
    $('#myPlayersStories video').on('ended', function() {
        $('.nextStoryBtn').click();
    });
    $("#myPlayersStories video").on("timeupdate", function(event) {
        onTrackedVideoFrame(this.currentTime, this.duration);
    });

    setTimeout(function() {
        $('#myPlayersStories').css('animation', '');
        $('#myPlayersStories').css('animation-play-state', 'paused');
    }, 3000);

    $("#myPlayers,#mypagePlayers, video").on("pause", function(event) {
        var currentTime = Math.round(this.currentTime);
        var duration = Math.round(this.duration);
        var per = parseInt(((this.currentTime / this.duration) * 100)) + "%";
        var videoTitle = $('.popuptitle').text();
        video_pause(currentTime, duration, per, videoTitle);
    });
    $("#myPlayers,#mypagePlayers, video").on("seeking", function(event) {
        var currentTime = Math.round(this.currentTime);
        var duration = Math.round(this.duration);
        var per = parseInt(((this.currentTime / this.duration) * 100)) + "%";
        var videoTitle = $('.popuptitle').text();
        video_progress(currentTime, duration, per, videoTitle);
    });
    $("#myPlayers,#mypagePlayers, video").on("ended", function(event) {
        var currentTime = Math.round(this.currentTime);
        var duration = Math.round(this.duration);
        var videoTitle = $('.popuptitle').text();
        video_complete(currentTime, duration, videoTitle);
    });
});
// Stories Player integration A@
function popLatestMagicVideo(videoId) {
    // alert($('meta[name="csrf-token"]').attr('content'));
    // alert(getCookie('XSRF-TOKEN') );
    $.ajax({
        url: "/popup_Videos",
        data: {
            'id': videoId
        },
        type: "POST",
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            // 'X-CSRF-TOKEN': getCookie('XSRF-TOKEN') 

        },
        dataType: 'JSON',
        success: function(response) {
            if (response.status == true) {
                $('.ap-wickt-slider').removeClass("slick-initialized slick-slider");
                $('#popuplatest').html(response.latest);
                $('#magicmomentVideo').html(response.magic);
                $('.ap-wickt-slider').slick({
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    arrows: true,
                    dots: false,
                    speed: 1000,
                    autoplay: true,
                    // adaptiveHeight: true,
                    autoplaySpeed: 4000,
                    // variableWidth:true,
                    responsive: [{
                            breakpoint: 1025,
                            settings: {
                                slidesToShow: 2,
                                // arrows: false,

                            }
                        },
                        {
                            breakpoint: 769,
                            settings: {
                                slidesToShow: 2,
                                slidesToScroll: 1,
                                // arrows: false,
                            }
                        },
                        {
                            breakpoint: 700,
                            settings: {
                                slidesToShow: 2,
                                slidesToScroll: 1,
                                // arrows: false,
                            }
                        },
                        {
                            breakpoint: 450,
                            settings: {
                                slidesToShow: 1,
                                slidesToScroll: 1,
                                // arrows: false,
                            }
                        },
                    ]
                });
                $('.ap-wickt-slider').resize();
            } else if (response.status == false) {
                $('#pointsdata').html('<tr> <td colspan="9" style="text-align: center;"> No Record Found </td></tr>');
            }
        },
        error: function(response) {}
    });
}

$(document).on("click", ".playerpopup", function() {
    var mainurl = window.location.href;
    $('.closeplayer').attr('data-url', mainurl);
    // $('.ap-wickt-slider').slick();

    $('.vjs-tech').attr('poster', '');
    var videoId = $(this).attr('data-videoId');
    popLatestMagicVideo(videoId);
    var myPageName = $(this).attr('data-pagename');
    var mediaId = $(this).attr('data-mediaId');
    var videoTitle = $(this).attr('data-videoTitle');
    var videodescription = $(this).attr('data-description');
    var videoshortdescription = $(this).attr('data-short-description');
    var videoView = $(this).attr('data-videoView');
    var videoDate = $(this).attr('data-videoDate');
    var videoslug = $(this).attr('data-videoslug');
    var dataduration = $(this).attr('data-duration');
    var share = $(this).attr('data-share');
    var printdescription = "";
    if (videoshortdescription == "") {
        printdescription = videodescription;
    } else {
        printdescription = videoshortdescription;
    }
    $('.pageduration').html(dataduration);
    $('.popupview').html(videoView);
    $('.popuptitle').html(videoTitle);
    $('.popupdescription').html(printdescription);
    $('.popupdate').html(videoDate);
    $('.facebook').attr('href', '//www.facebook.com/sharer.php?u=' + share);
    $('.facebook').attr('data-title', videoTitle);
    $('.twitter').attr('href', '//twitter.com/share?url=' + share);
    $('.twitter').attr('data-title', videoTitle);
    $('.whatsapp').attr('href', 'whatsapp://send?text=' + share);
    $('.messenger').attr('href', 'fb-messenger://share/?link=' + share);
    $('.copyurlplay').attr('data-shareurl', share);
    $('.copyurlplay').attr('data-title', videoTitle);


    if (mediaId == "") {
        //alert('no video url found');
    } else {

        var new_url = "/video/" + videoslug;
        //window.history.pushState("data", "Title", new_url);
        videojs.getPlayer('myPlayers').ready(function() {
            var myPlayer = this;
            myPlayer.catalog.getVideo(mediaId, function(error, video) {
                //deal with error
                myPlayer.catalog.load(video);
            });
        });
        $('#exampleModal').modal('show');
        $('.ap-vd-pop-container').animate({
            'scrollTop': 0
        }, 1000);
        if ($('.ap-vd-scroll-div').hasClass('si') == true) {
            setTimeout(function() {
                $('.ap-vd-scroll-div').slick('unslick');
                $('.ap-vd-scroll-div').slick();
            }, 2000);
        }
    }

    if (videoId && myPageName != 'auction') {
        $('#relatedVideo').html('');
        $('#relatedVideo').html('<strong style="color:#fffff;text-align:center">Loading.....</strong>');
        $.ajax({
            url: "/related_Videos",
            type: "GET",
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            data: {
                'id': videoId
            },
            dataType: 'JSON',
            success: function(response) {
                if (response.status == true) {
                    $('#relatedVideo').html(response.related);

                } else if (response.status == false) {
                    $('#relatedVideo').html('<div style="text-align: center;"> No Video Found !</div>');
                }
            },
            error: function(response) {}
        });
    }
    video_start(dataduration, videoTitle);
});
//////////////// Player ON Page START //////////////////

$(document).on("click", ".playerpage", function() {

    // $('meta[property="og:title"]').remove();
    // $('meta[property="og:image"]').remove();
    // $('meta[property="og:url"]').remove();
    $('.vjs-tech').attr('poster', '');
    var mediaId = $(this).attr('data-mediaId');
    var videoId = $(this).attr('data-videoId');
    var videoTitle = $(this).attr('data-videoTitle');
    var videodescription = $(this).attr('data-description');
    var videoshortdescription = $(this).attr('data-short-description');
    var videoView = $(this).attr('data-videoView');
    var videoDate = $(this).attr('data-videoDate');
    var share = $(this).attr('data-share');
    var image = $(this).attr('data-thumbnile');
    var dataduration = $(this).attr('data-duration');
    var printdescription = "";
    if (videoshortdescription == "") {
        printdescription = videodescription;
    } else {
        printdescription = videoshortdescription;
    }
    // $('meta[name="og:url"]').attr("content",share);
    // $('meta[name="og:title"]').attr("content",videoTitle);
    // $('meta[name="og:description"]').attr("content",videodescription);
    // $('meta[name="og:image"]').attr("content",image);
    // $('head').append('<meta property="og:type" content="website"/><meta property="og:url" content="' + share + '"/><meta property="og:title" content="' + videoTitle + '"/><meta property="og:image"  content="' + image + '"/>');
    $('.popupview').html(videoView);
    $('.popuptitle').html(videoTitle);
    $('.popupdescription').html(printdescription);
    $('.popupdate').html(videoDate);
    $('.facebook').attr('href', '//www.facebook.com/sharer.php?u=' + share);
    $('.twitter').attr('href', '//twitter.com/share?url=' + share);
    $('.whatsapp').attr('href', 'whatsapp://send?text=' + share);
    $('.messenger').attr('href', 'fb-messenger://share/?link=' + share);
    $('.copyurlplay').attr('data-shareurl', share);
    $('.pageduration').html(dataduration);
    if (mediaId) {
        var new_url = "/video/" + videoId;
        window.history.pushState("data", "Title", new_url);
        videojs.getPlayer('mypagePlayers').ready(function() {
            var myPlayer = this;
            myPlayer.catalog.getVideo(mediaId, function(error, video) {
                //deal with error
                myPlayer.catalog.load(video);
            });
        });
    } else {
        //alert('no video url found');
    }
    video_start(dataduration, videoTitle);
});



/////////////// Player ON Page END /////////////

$(document).on("click", ".closeplayer", function() {
    // alert("Close");
    $('.vjs-tech').attr('poster', '');
    videojs.getPlayer('myPlayers').ready(function() {
        var myPlayer = this;
        myPlayer.pause();
    });
    // ------for remove #videopopup from  url-------------------
    //  var url = $(location).attr('href'),
    //  parts = url.split("/"),
    //  last_part = parts[parts.length-2];
    // var pathArray = window.location.pathname.split( '/' );

    //  if(pathArray==',')
    //  {
    //  	var base_url = window.location.origin;
    //      window.history.pushState('data', null, base_url);
    //     location.reload();
    // }
    // ------------------------end-------------------

});

// ESCAPE key pressed
$(document).keydown(function(e) {
    if (e.keyCode == 27) {
        $('.vjs-tech').attr('poster', '');
        videojs.getPlayer('myPlayers').ready(function() {
            var myPlayer = this;
            myPlayer.pause();
        });
    }
});

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
//////////////////////// Bright Cove Player END /////////////////////////
// $(window).load(function () {
// 	$('.ap-common-slide').slick('unslick').slick('reinit').slick();
// });
//