jQuery('.favorites-slider').slick({
    dots:false,
    arrow : true,
    infinite : true,
    speed : 300,
    autoplay : false,
    slidesToShow : 4,
    slidesToScroll :1,
    nextArrow: '<a href="#" class="slick-arrow slick-next"><i class="fa fa-chevron-right"></i></a>',
    prevArrow: '<a href="#" class="slick-arrow slick-prev"><i class="fa fa-chevron-left"></i></a>',
    responsive : [
        {
            breakpoint:1200,
            settings : {
                slidesToShow : 3,
                slidesToScroll : 1,
                infinite : true,
                dots : true
            }
        },
        {
            breakpoint:768,
            settings : {
                slidesToShow : 2,
                slidesToScroll : 1
            }
        },
        {
            breakpoint:480,
            settings : {
                slidesToShow : 1,
                slidesToScroll : 1
            }
        },
    ]
});