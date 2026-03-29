var t1 = gsap.timeline();

t1.from("#text", { 
    delay:0.5,
    duration: 1.5,
    width: 0, 
    ease: "power1.inOut"
});

t1.to("#text",{
    duration: 1,
    opacity: 0
})

t1.from("#name",{
    opacity:0,
})

t1.from(".one",{
    opacity:0,
    duration: 0.5,
    y: 20,
})

t1.from(".two",{
    opacity:0,
    duration: 0.5,
    y: 20,
})

t1.from(".project, .contact",{
    opacity:0,
    duration: 0.5,
})

t1.from(".right",{
    opacity: 0,
    duration: 2,
    ease: "power1.out",
    x: 500,
},"-=2.5")

t1.from("nav",{
    opacity: 0,
    duration: 1.5,
    y: -25,
},"-=2.5")