/* =====================================================
   OSP BIAŁOGRĄDY
   PREMIUM WEBSITE SCRIPT
===================================================== */



/* =========================
   GSAP START
========================= */


gsap.registerPlugin(ScrollTrigger);





/* =========================
   NAVBAR
========================= */


const navbar = document.querySelector("#navbar");


window.addEventListener("scroll",()=>{


    if(window.scrollY > 50){

        navbar.classList.add("scrolled");

    }else{

        navbar.classList.remove("scrolled");

    }


});







/* =========================
   MOBILE MENU
========================= */


const mobileButton =
document.querySelector(".mobile-menu");


const navLinks =
document.querySelector(".nav-links");



if(mobileButton){


mobileButton.addEventListener("click",()=>{


    navLinks.classList.toggle("open");


});


}








/* =========================
   HERO ANIMATION
========================= */


const heroTimeline =
gsap.timeline();



heroTimeline
.from(".hero-label",{

    opacity:0,
    y:30,
    duration:1

})

.from(".hero h1",{

    opacity:0,
    y:50,
    duration:1

},"-=0.5")


.from(".hero-content p",{

    opacity:0,
    y:40,
    duration:1

},"-=0.5")


.from(".hero-buttons",{

    opacity:0,
    y:30,
    duration:1

},"-=0.5")


.from(".hero-info div",{

    opacity:0,
    y:30,
    stagger:.2,
    duration:.8

},"-=0.5");








/* =========================
   SCROLL ANIMATIONS
========================= */


const revealElements =
document.querySelectorAll(
".mission-card, .why-item, .operation-box, .intro-card, .number-card, .gallery-item"
);



revealElements.forEach((element)=>{


gsap.from(element,{

    scrollTrigger:{

        trigger:element,

        start:"top 85%",

    },


    opacity:0,

    y:50,

    duration:1,

    ease:"power3.out"


});


});







/* =========================
   COUNTERS
========================= */


const counters =
document.querySelectorAll(
"[data-number]"
);



counters.forEach(counter=>{


let value =
counter.getAttribute("data-number");



gsap.fromTo(counter,{

    innerHTML:0

},{

    innerHTML:value,

    duration:2,

    scrollTrigger:{

        trigger:counter,

        start:"top 85%"

    },


    snap:{
        innerHTML:1
    },


    onUpdate:function(){


        counter.innerHTML =
        Math.floor(counter.innerHTML)
        .toLocaleString("pl-PL");


    }


});



});















/* =========================
   SMOOTH LINKS
========================= */


document.querySelectorAll(
'a[href^="#"]'
)
.forEach(anchor=>{


anchor.addEventListener(
"click",
function(e){


let target =
document.querySelector(
this.getAttribute("href")
);



if(target){


e.preventDefault();



target.scrollIntoView({

    behavior:"smooth"

});


}


});


});








/* =========================
   VIDEO PARALLAX
========================= */


const video =
document.querySelector(".hero-video");



if(video){


window.addEventListener(
"scroll",
()=>{


video.style.transform =
`translateY(${window.scrollY * 0.15}px)`;


});


}







/* =========================
   GALLERY EFFECT
========================= */


const gallery =
document.querySelectorAll(
".gallery-item"
);



gallery.forEach(item=>{


item.addEventListener(
"mousemove",
(e)=>{


const rect =
item.getBoundingClientRect();



const x =
e.clientX - rect.left;


const y =
e.clientY - rect.top;



item.style.setProperty(
"--x",
`${x}px`
);


item.style.setProperty(
"--y",
`${y}px`
);


});


});







/* =========================
   LOAD EFFECT
========================= */


window.addEventListener(
"load",
()=>{


document.body.classList.add(
"loaded"
);


});
/* =========================
   AUTOMATYCZNY KALKULATOR PASKU ZBIÓRKI
========================= */
document.addEventListener("DOMContentLoaded", () => {
    const targetBottles = 100000; // Docelowa liczba butelek
    const currentElement = document.getElementById("current-bottles");
    const progressLine = document.getElementById("dynamic-progress-line");
    const percentageText = document.getElementById("progress-percentage");
    const statusPercentageText = document.getElementById("status-percentage"); // Nowy element obok tekstu

    if (currentElement && progressLine) {
        const currentBottles = parseInt(currentElement.innerText.replace(/\s/g, "")) || 0;
        
        let percentage = (currentBottles / targetBottles) * 100;
        
        if (percentage > 100) percentage = 100;
        
        const formattedPercentage = percentage < 1 && percentage > 0 ? percentage.toFixed(2) : percentage.toFixed(1);

        // Ustawiamy szerokość paska
        progressLine.style.setProperty("width", percentage + "%", "important");
        
        // Aktualizujemy procent w dymku/pasku
        if (percentageText) {
            percentageText.innerText = formattedPercentage + "%";
        }

        // Aktualizujemy procent przy napisie "Stan aktualny zbiórki"
        if (statusPercentageText) {
            statusPercentageText.innerText = `(${formattedPercentage}%)`;
        }
    }
});