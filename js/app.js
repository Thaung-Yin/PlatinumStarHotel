const getSlideImgContainers = document.querySelectorAll('.slide-img');
const getHeroSect = document.getElementById('hero');
const orderBtn = document.querySelector('.orderBtns')
const closebtn = document.querySelector('.close-btns');
const canclebtn = document.querySelector('.cancle');
const modalBox = document.querySelector('.modalBox');

if (getSlideImgContainers.length > 0 && getHeroSect) {
    let currentIndex = 0;
    const totalSlides = getSlideImgContainers.length;

    function updateActiveSlide(index) {
        getSlideImgContainers.forEach((container, i) => {
            if (i === index) {
                container.classList.add('active');
            } else {
                container.classList.remove('active');
            }
        });
    }

    function showSlide(index) {
        const slideContainer = getSlideImgContainers[index];
        const img = slideContainer.querySelector('img');
        if (!img || !img.src) return;
        getHeroSect.style.backgroundImage = `url('${img.src}')`;
        updateActiveSlide(index);
    }

    showSlide(currentIndex);

    setInterval(function() {
        currentIndex = (currentIndex + 1) % totalSlides;
        showSlide(currentIndex);
    }, 4000);

    getSlideImgContainers.forEach(function(container, idx) {
        container.addEventListener('click', function() {
            const img = container.querySelector('img');
            if (!img || !img.src) return;
            currentIndex = idx;
            showSlide(currentIndex);
        });
    });
}

closebtn.addEventListener('click',function(){
    closemodal()
});
canclebtn.addEventListener('click',function(){
    closemodal()
});

orderBtn.addEventListener('click',function(){
    open();
});

function closemodal(){
    modalBox.style.display = "none";
    document.body.style.overflow = "";
}

function open(){
    modalBox.style.display = "grid";
    document.body.style.overflow = "hidden";
}

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

    /*Start Welcome Section */

    $(window).scroll(function(){
		var getscrolltt = $(this).scrollTop();
		// console.log(getscrolltt);

		if(getscrolltt >= 300){
			$('.welcome-img-grid').addClass('fromlefts');
			$('.content').addClass('fromrights');
		}else{
			$('.welcome-img-grid').removeClass('fromlefts');
			$('.content').removeClass('fromrights');
		}	

	});

    /*End Welcome Section */

    

    


});

