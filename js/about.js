// Start Footer
	const getyear = $('#getyear');
	const getfullyear = new Date().getFullYear();
	getyear.text(getfullyear);
// End Footer




$(document).ready(function(){
    $(".btn-backtotops").hide();
	$(window).scroll(function(){
		var getscrolltop = $(this).scrollTop();
		// console.log(getscrolltop);

		if(getscrolltop >= 370){
			$(".btn-backtotops").fadeIn(1000);
		}else{
			$(".btn-backtotops").fadeOut(1000);
		}
	});
    	// Start Nav Bar
    $(window).scroll(function(){
        

        let position = $(this).scrollTop();

        // console.log(position);

        if(position >= 200){
            $('.navbars').addClass('navmenus')
        }else{
            $('.navbars').removeClass('navmenus');
        }

	});

    

    


});