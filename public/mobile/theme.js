/*================================================

* Template Name: Foodkuy - Mobile HTML Template
* Version: 1.0
* Author: HidraTheme 
* Developed By: HidraTheme  
* Author URL: https://themeforest.net/user/hidratheme

NOTE: This is the custom js file for the template

================================================*/


(function ($) {

  "use strict"; 

 /*=================== PRELOADER ===================*/
  $(window).on('load',function() { 
      $(".preloading").fadeOut("slow"); 
  });


 /*=================== SIDE NAVIGATION  ===================*/
  $('#dismiss, .overlay').on('click', function () {
      $('#sidebarleft').removeClass('active');
      $('#sidebarright').removeClass('active');
      $('.overlay').removeClass('active'); 
      $('body').removeClass('noscroll');
  });

  $('#sidebarleftbutton,#sidebarrightbutton').on('click', function () { 
      $('.overlay').addClass('active');
      $('body').addClass('noscroll');
  });

  $('#sidebarleftbutton').on('click', function () {
      $('#sidebarleft').addClass('active'); 
  });

  $('#sidebarrightbutton').on('click', function () {
      $('#sidebarright').addClass('active'); 
  });


  /*=================== HOMEPAGE - CAROUSEL SLIDER  ===================*/
  $('.img-hero').slick({
    autoplay: true,
    dots: true,
    infinite: true,
    arrows : false,
    speed: 300,
    slidesToShow: 1,
    adaptiveHeight: false
  });


  /*=================== HOMEPAGE - RECIPES YOU MIGHT LIKE CAROUSEL  ===================*/
  $('.yml-carousel').slick({ 
  slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3
        }
      }   
    ]
  });


  /*=================== HOMEPAGE - AUTHOR ===================*/
  $('.home-author').slick({ 
   dots: true,
    infinite: false,
    speed: 300,
    slidesToShow: 6,
    slidesToScroll: 6,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 6
        }
      },
      {
        breakpoint: 380,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4
        }
      }   
    ]
  });


/*=================== RECIPE PAGE -  SLICK CAROUSEL FOOD IMAGE ===================*/
    $("#food-recipe-image").slick({
    arrows: false,
    dots: true 
    });

    $( ".awl-btn" ).on("click", function() {
      $( this ).toggleClass( "highlight" );
    });


/*=================== GALLERY FILTERING FUCTION  ===================*/
  $(".filter-button").on("click", function() {
      var value = $(this).attr('data-filter');
      
      if(value == "gallery-no-filter")
      {
          $('.gallery-img-box').removeClass("gallery-hidden");
      }
      else
      { 
          $(".gallery-img-box").not('.'+value).addClass("gallery-hidden");   
          $('.gallery-img-box').filter('.'+value).removeClass("gallery-hidden");
          
      }
  });

  $('.filter-gallery .filter-button').on("click", function() {
      $('.filter-gallery').find('.filter-button.active').removeClass('active');  
      $(this).addClass('active');
  });


/*=================== MAGNIFICPOPUP GALLERY  ===================*/
  $(".gallery-list").magnificPopup({
          type: "image",
          removalDelay: 300 
      });

/*=================== THEME COLOR  ===================*/
  var themecolor = "foodkuy-green-leaf";
        $("body").attr('class', themecolor);


})(jQuery);


