$(function(){
  var menuspeed  = 400;
  var open = true;
  var $menu = $('.main-menu-container');
  var $other = $('.main-body-container');

  $('.clicker').on('click', function(e){
    if (open) {
      $menu.animate({"left": "-5px"},menuspeed);
      $other.animate({"left": "235px"},menuspeed);
    }
    else {
      $menu.animate({"left": "-235px"},menuspeed);
      $other.animate({"left": "0px"},menuspeed);
    }
    open = !open;
  });

    $('.main-menu-container').on('click', function(e) {
        e.stopPropagation();
    });

    $(document).on('click', function (e) {
        if (!open) {
          $menu.animate({"left": "-235px"},menuspeed);
          $other.animate({"left": "0px"},menuspeed);
          open = !open;
        }
    });
});