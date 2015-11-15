$(document).ready(function(){
    $("#about-button").on("click" ,function(){
    	$('html,body').animate({
            scrollTop: $("#about-div").offset().top},
            'slow');
    });

    $("#projects-button").on("click" ,function(){
        //alert("MARK");
    	$('html,body').animate({
            scrollTop: $("#project-div").offset().top},
            'slow');
    });

    $("#contact-button").on("click" ,function(){
        //alert("MARK");
    	$('html,body').animate({
            scrollTop: $("#contact-div").offset().top},
            'slow');
    });

    $("#resume-button").on("click" ,function(){
        //alert("MARK");
    	$('html,body').animate({
            scrollTop: $("#about-div").offset().top},
            'slow');
    });

    $("#extra-button").on("click" ,function(){
        //alert("MARK");
    	$('html,body').animate({
            scrollTop: $("#about-div").offset().top},
            'slow');

    });
});