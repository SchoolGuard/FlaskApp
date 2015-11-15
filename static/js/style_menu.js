(function($){
    $(document).ready(function(){
        var menuspeed  = 400;
        var open = true;
        var $menu = $('.main-menu-container');
        var $other = $('.body-container');

        $('.clicker').on('click', function(e){
          if (open) {
            $menu.animate({left: "-5px"}, menuspeed);
          }
          else {
            $menu.animate({left: "-235px"}, menuspeed);
          }
          open = !open;
        });

        $('.main-menu-container').on('click', function(e) {
          e.stopPropagation();
        });

        $(document).on('click', function (e) {
          if (!open) {
            $menu.animate({left: "-235px"}, menuspeed);
            open = !open;
          }
        });

    	$('#cssmenu li.has-sub>a').on('click', function(){
    		$(this).removeAttr('href');
    		var element = $(this).parent('li');
    		if (element.hasClass('open')) {
    			element.removeClass('open');
    			element.find('li').removeClass('open');
    			element.find('ul').slideUp(300);
    		}
    		else {
    			element.addClass('open');
    			element.children('ul').slideDown(300);
    			element.siblings('li').children('ul').slideUp(300);
    			element.siblings('li').removeClass('open');
    			element.siblings('li').find('li').removeClass('open');
    			element.siblings('li').find('ul').slideUp(300);
    		}
    	});
    });
})(jQuery);

