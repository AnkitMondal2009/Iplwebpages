$(document).on("click", "#loadmorebtn", function() {
    $('.loader-main').show();
    var page = $('#loadmorebtn').attr('data-page');
    $.ajax({
        url: "/newslistshow",
        type: "GET",
        // data: { "tab": tab , 'page':page },
        data: {
            'page': page
        },
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        dataType: 'JSON',
        success: function(response) {

            if (response.status == true) {
                $('.loader-main').hide();
                // $('#bannerDiv').html(response.banner);
                $('#newsData').append(response.news_data);
                $('#loadmorebtn').attr('data-page', parseInt(response.newsResponce.page) + 1);
            }
        },
        error: function(response) {}
    });
});

$(document).on("click", "#loadmorebtnTeam", function() {
    $('.loader-main').show();
    var page = $('#loadmorebtnTeam').attr('data-page');
    var id = $('#loadmorebtnTeam').attr('data-id');
    var type = $('#loadmorebtnTeam').attr('data-type');
    $.ajax({
        url: "/newslistshowTeam",
        type: "GET",
        // data: { "tab": tab , 'page':page },
        data: {
            'page': page,
            'id': id,
            'type': type
        },
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        dataType: 'JSON',
        success: function(response) {

            if (response.status == true) {
                var totalPageno = Math.ceil(parseFloat(response.newsResponce.total / 21));
                // if (totalPageno == response.newsResponce.page || totalPageno == 0) {
                if (totalPageno == page || totalPageno == 0) {
                    $('.loadmorebtn').hide();
                } else {
                    $('.loadmorebtn').show();
                }
                // $('#bannerDiv').html(response.banner);
                $('.loader-main').hide();
                $('#newsData').append(response.news_data);
                $('#loadmorebtnTeam').attr('data-page', parseInt(page) + 1);
            }
        },
        error: function(response) {}
    });
});


$(document).on("click", "#loadMoreaddBtn", function() {
    $('.loader-main').show();
    var page = $('#loadMoreaddBtn').attr('data-page');
    var type = $('#loadMoreaddBtn').attr('data-type');
    page = parseInt(page);
    $.ajax({
        url: "/add-more-match-report",
        type: "GET",
        data: {
            'page': page,
            "type": type
        },
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        dataType: 'JSON',
        success: function(response) {

            if (response.status == true) {
                var totalPageno = Math.ceil(parseFloat(response.newsResponce.total / 21));
                // if (totalPageno == response.newsResponce.page || totalPageno == 0) {
                if (totalPageno == page || totalPageno == 0) {
                    $('.loadmorebtn').hide();
                } else {
                    $('.loadmorebtn').show();
                }
                $('.loader-main').hide();
                // $('#bannerDiv').html(response.banner);
                $('#div-match-report').append(response.news_data);
                $('#loadMoreaddBtn').attr('data-page', page + 1);
            }
        },
        error: function(response) {}
    });
});