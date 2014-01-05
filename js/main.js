jQuery(function($) {

  var fullscreenElement = null,
      fullscreenTarget = "",
      scrollOffset;

  function set_section_heights() {
    $('.logo').height($(window).height());
  }

  function onResize() {
    $( fullscreenTarget ).height($(window).height());
  }

  function focus() {
    if ($(window).scrollTop() === scrollOffset) {
      $(window).off('scroll', focus);
      $(window).on('scroll', blur);
      // pull gross hom checks out of here.
      if ( fullscreenTarget !== "#home" ) {
        $(window).on('resize orientationChanged', onResize );
      }
    }
  }

  function blur() {
    if ($(window).scrollTop() !== scrollOffset) {
      // animate this...
      fullscreenElement.css({height: 'auto'});
      $(window).off('scroll', blur);
      $(window).off('resize orientationChanged', onResize );
      fullscreenTarget = "";
      fullscreenElement = null;
    }
  }

  $('a[href^=#]').on('click', function(e) {
    e.preventDefault();
    if ( fullscreenElement ) {
      if ( fullscreenTarget === this.hash ) {
        return;
      }
      fullscreenElement.css({height: 'auto'});
      $(window).off('scroll', focus);
      $(window).off('scroll', blur);
      fullscreenTarget = "";
      fullscreenElement = null;
    }

    fullscreenTarget = this.hash;
    fullscreenElement = $(fullscreenTarget);
    // somehting wrong with home?

    //if ( fullscreenTarget !== "#home" ) {
      $('.logo').height(500);
    //}
    fullscreenElement = fullscreenElement.length && fullscreenElement ||
$('[name='+fullscreenTarget.slice(1)+']');
    if(fullscreenElement.length){
      scrollOffset = fullscreenElement.offset().top;
      if ( fullscreenTarget !== "#home" ) {
        fullscreenElement.animate({height:$(window).height()},'fast');
      }
      if ( $(window).scrollTop() !== scrollOffset ) {
        $('html,body').animate({scrollTop:scrollOffset},'slow');
        $(window).on('scroll', focus);
      } else {
        focus();
      }
    }
  });

  // make scroll to top or bottom fill page
  if ($(window).scrollTop() === 0) {
    set_section_heights();
    $(window).on('scroll', scrolltop);
    $(window).on('resize orientationChanged', set_section_heights);
  } else {
    $('.logo').height(500);
  }

  function onscroll() {
    if ($(window).scrollTop() === 0) {
      $('.logo').animate({height:$(window).height()}, 'fast');
      //$('.logo').height($(window).height());
      //$(window).on('scroll', scrolltop);
      //$(window).on('resize orientationChanged', set_section_heights);
    }
  }

  function scrolltop() {
    $(window).off('resize orientationChanged', set_section_heights);
    $(window).off('scroll', scrolltop);
    $('.logo').animate({height:500}, 'fast');
    //$('.logo').height(500);
    // put this into the animate callback?
    //$(window).on('scroll', onscroll);
  }

  // Once the page has finished loading, animate the appearance of the logo and navigation.
  $(window).load(function () {
    $('.logo img').addClass('active');
    $('nav').addClass('active');
  });

  // Smooth scrolling for local links.
  $('a').localScroll({offset: -30});

  // Effects on scroll.
  function set_homepage_waypoint(target_container, target, offset) {
    $(target_container).waypoint(function() {
      $(target).addClass('active');
    }, {
      offset: offset
    });
  }

  set_homepage_waypoint('.popcorn_users', '.popcorn_users', 500);

  // Homepage video.
  var video, cues;
  video = new Popcorn('#video');

  // Once the video is playable...
  video.on('canplaythrough', function(){

    // Show it, mute it, and play it.
    $('.video_container').addClass('ready');
    video.mute();
    video.play();

    // Scroll to sections at times.
    cues = {
      1 : { 'time' : '00:04', 'target' : '.intro' },
      2 : { 'time' : '00:08', 'target' : '.popcorn_users' },
      3 : { 'time' : '00:12', 'target' : '.examples' }
    };

    $.each(cues, function(cue, parameters) {
      video.code({
        start:   parameters.time,
        onStart: function() {
          $.scrollTo(parameters.target, 1000, {
            offset: -95
          });
        }
      });
    });
  });

});
