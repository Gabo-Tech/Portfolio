$(window).on('load', function() {
  $('.loader-wrapper').fadeOut('slow');
});
const navbarToggle = navbar.querySelector("#navbar-toggle");
const navbarMenu = document.querySelector("#navbar-menu");
const navbarLinksContainer = navbarMenu.querySelector(".navbar-links");
let isNavbarExpanded = navbarToggle.getAttribute("aria-expanded") === "true";

const toggleNavbarVisibility = () => {
  isNavbarExpanded = !isNavbarExpanded;
  navbarToggle.setAttribute("aria-expanded", isNavbarExpanded);
};

navbarToggle.addEventListener("click", toggleNavbarVisibility);

navbarLinksContainer.addEventListener("click", (e) => e.stopPropagation());
navbarMenu.addEventListener("click", toggleNavbarVisibility);

$(document).ready(function() {
  $('.appBrewery').hover(function() {
    $('.appBrewery1').show();
  }, function(){
    $('.appBrewery1').hide();
  })
  $('.barcelonaCode').hover(function() {
    $('.barcelonaCode1').show();
  }, function(){
    $('.barcelonaCode1').hide();
  })
  $('.JAPH').hover(function() {
    $('.JAPH1').show();
  }, function(){
    $('.JAPH1').hide();
  })
  $('.JPH').hover(function() {
    $('.JPH1').show();
  }, function(){
    $('.JPH1').hide();
  })
  $('.fundamentals').hover(function() {
    $('.fundamentals').show();
  }, function(){
    $('.fundamentals').hide();
  })
  $('.python').hover(function() {
    $('.python1').show();
  }, function(){
    $('.python1').hide();
  })
  $('.java').hover(function() {
    $('.java1').show();
  }, function(){
    $('.java1').hide();
  })

  /*$('.button').on('click', function () {
    $('object').slideToggle('slow')
  })*/
  $('.iframe').responsiveIframes({ openMessage: "Full screen", closeMessage: "Close full screen" });

});

(function($){
  $.responsiveIframes = function(el, options){
      var self = this;

      // Access to jQuery and DOM versions of element
      self.$el = $(el);
      self.el = el;

      // Add a reverse reference to the DOM object
      self.$el.data("responsiveIframes", self);

      self.init = function () {
          self.options = $.extend({}, $.responsiveIframes.defaultOptions, options);

          // wrap iframe
          var iframeSrc = self.$el.find('iframe').wrap('<div class="iframe-content" />').attr('src');

          //generate header
          var header = '<div class="iframe-header">' +
                            '<a href="'+ iframeSrc +'" class="iframe-trigger">'+ self.options.openMessage +'</a>' +
                        '</div>';

          var trigger = self.$el.prepend(header).find('.iframe-trigger');

          // click event
          $(trigger).click(function (e) {
              e.preventDefault();

              var $this = $(this),
                  $html = $('html'),
                  isFullScreen = $html.hasClass("iframe-full-screen"),
                  message = isFullScreen ? self.options.openMessage : self.options.closeMessage;

              $this.text(message);

              if (isFullScreen) {
        self.$el.removeClass("iframe-active");
                  $html.removeClass("iframe-full-screen");
                  setTimeout(function () {
                      $(window).scrollTop($this.data('iframe-scroll-position'));
                  }, 1);
              } else {
                  $this.data('iframe-scroll-position', $(window).scrollTop());
        self.$el.addClass("iframe-active");
                  $html.addClass("iframe-full-screen");
              }

          });
      };

      // Run initializer
      self.init();
  };

  $.responsiveIframes.defaultOptions = {
      openMessage: "Full screen",
      closeMessage: "Close"
  };

  $.fn.responsiveIframes = function(options){
      return this.each(function(){
          (new $.responsiveIframes(this, options));
      });
  };

})(jQuery);
