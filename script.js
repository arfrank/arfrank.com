var i=-1,
	gps = {

	'canyonlands': {desc:'Canyonlands National Park', 'link':'https://www.google.com/maps/preview#!data=!1m7!1m3!1d3253!2d-109.8554365!3d38.3779998!2m2!1f270!2f77.49!2m1!1e3&fid=7'},
	'french_atlantic': {desc:'Argenton, France', 'link':'https://www.google.com/maps/preview#!data=!1m6!1m3!1d548!2d-4.7692485!3d48.5171081!2m1!2f78.87!2m1!1e3!4m15!2m14!1m13!1s0x47fb9156a0befe77%3A0x3326f0415f498d61!3m8!1m3!1d3976!2d151.6323639!3d-32.9354469!3m2!1i1149!2i626!4f35!4m2!3d46.586446!4d1.52282&fid=7'},
	'quandary2': {desc:'Quandary Peak','link':'https://www.google.com/maps/preview#!q=quandary+peak&data=!1m7!1m3!1d1169!2d-106.0787833!3d39.394866!2m2!1f270!2f77.28!2m1!1e3!4m18!2m17!1m16!1s0x876af3a695baae01%3A0x1386cde4030b10db!3m11!1m3!1d671!2d-109.8762177!3d38.3789593!2m2!1f270!2f77.08!3m2!1i1149!2i626!4f35!4m2!3d39.3972102!4d-106.1064092&fid=7'},
	'quandary': {desc:'Quandary Peak', 'link':'https://www.google.com/maps/preview#!q=quandary+peak&data=!1m7!1m3!1d2056!2d-106.1144264!3d39.397513!2m2!1f90!2f77.08!2m1!1e3!4m18!2m17!1m16!1s0x876af3a695baae01%3A0x1386cde4030b10db!3m11!1m3!1d3443!2d-105.9769849!3d39.3892375!2m2!1f270!2f76.68!3m2!1i1149!2i626!4f35!4m2!3d39.3972102!4d-106.1064092&fid=7'},
	'jtree': {desc:'Joshua Tree National Park', 'link':'https://www.google.com/maps/preview#!data=!1m7!1m3!1d385!2d-116.1929634!3d34.0407314!2m2!1f270!2f78.15!2m1!1e3!4m39!1m38!4m10!1m3!1d200!2d-4.7692485!3d48.5171081!2m1!2f78.87!3m2!1i1149!2i626!4f35!10b1!19m6!1e1!1e2!1e9!1e10!1e12!4smaps_sv.tactile!20m13!1e1!1e2!1e3!1e4!1e5!1e9!1e10!1e11!1e12!2m2!1i203!2i100!5smaps_sv.tactile!26m4!1e12!1e13!1e3!4smaps_sv.tactile&fid=7'},
	'hoodoo': {desc:'Bryce Canyon National Park', 'link':'https://www.google.com/maps/preview#!q=Bryce+Point&data=!1m6!1m3!1d1494!2d-112.1589414!3d37.5956425!2m1!2f77.52!2m1!1e3!4m15!2m14!1m13!1s0x0%3A0x24190580d4afdb7c!3m8!1m3!1d41228!2d-112.17533!3d37.597051!3m2!1i1149!2i626!4f13.1!4m2!3d37.6038963!4d-112.1564627&fid=7'},
	'hearst': {desc:'Hearst Castle', 'link':'https://www.google.com/maps/preview#!q=Hearst+Castle%2C+San+Simeon%2C+CA&data=!1m7!1m3!1d243!2d-121.1660837!3d35.6853521!2m2!1f270!2f78.7!2m1!1e3!4m17!2m16!1m15!1s0x8092cc9dce68ea8b%3A0xc07bc62555ca2e20!3m10!1m3!1d544!2d-112.1589414!3d37.5956425!2m1!2f77.52!3m2!1i1149!2i626!4f35!4m2!3d35.685208!4d-121.168225&fid=7'},
	'zion': {desc:'Zion National Park', 'link':'https://www.google.com/maps/preview#!q=Angels+Landing%2C+Zion+National+Park%2C+Washington%2C+UT&data=!1m7!1m3!1d2725!2d-112.9486661!3d37.2878057!2m2!1f180!2f77.5!2m1!1e3!4m15!2m14!1m13!1s0x80cac3d63de4e197%3A0xc7cc7a1f137357ee!3m8!1m3!1d120031!2d-113.0457222!3d37.3795885!3m2!1i1149!2i626!4f35!4m2!3d37.2690326!4d-112.9468989&fid=7'},
	'mesa': {desc:'Monument Valley', 'link':'https://www.google.com/maps/preview#!data=!1m7!1m3!1d551!2d-110.1190002!3d36.9832003!2m2!1f90!2f77.76!2m1!1e3&fid=7'},
	'grand_canyon': {desc:'Grand Canyon National Park', 'link':'https://www.google.com/maps/preview#!data=!1m6!1m3!1d3837!2d-111.830947!3d36.0197381!2m1!2f76.32!2m1!1e3!4m35!2m14!1m13!1s0x0%3A0xe90fac0b0ebaf4d7!3m8!1m3!1d84131!2d-111.8477152!3d36.0572166!3m2!1i1149!2i626!4f13.1!4m2!3d36.0440503!4d-111.8259931!5m19!2m18!1m17!1s0x873312ae759b4d15%3A0x1f38a9bec9912029!2sGrand+Canyon+National+Park!3m11!1m3!1d992!2d-112.9486661!3d37.2878057!2m2!1f180!2f77.5!3m2!1i1149!2i626!4f35!4m2!3d36.106965!4d-112.112997&fid=7'},
	'castle_hill': { desc:'Castle Hill, NZ', 'link':'https://www.google.com/maps/preview#!data=!1m6!1m3!1d435!2d171.7164885!3d-43.234584!2m1!2f78.39!2m1!1e3!4m15!2m14!1m13!1s0x6d2e685c3bb6a3d5%3A0x455add578c93ac61!3m8!1m3!1d79686!2d-105.2399775!3d40.0293099!3m2!1i1149!2i626!4f13.1!4m2!3d-43.2166667!4d171.7166667&fid=7'},
	'halfdome':{desc:'Half Dome, Yosemite National Park', 'link':'https://www.google.com/maps/preview#!data=!1m7!1m3!1d3405!2d-119.5947898!3d37.7336275!2m2!1f90!2f77.46!2m1!1e3&fid=7'},
	'whitney':{desc:'Mt. Whitney, Sequoia National Park', 'link':'https://www.google.com/maps/preview#!data=!1m7!1m3!1d2925!2d-118.2768646!3d36.5782127!2m2!1f270!2f77.19!2m1!1e3!4m15!2m14!1m13!1s0x80bf8d3667a6b6c5%3A0x77dad12cf276cbf2!3m8!1m3!1d936!2d-119.0766174!3d37.7773964!3m2!1i1149!2i626!4f35!4m2!3d36.5784451!4d-118.2922437&fid=7'},
	'whitney2':{desc:'Mt. Whitney, Sequoia National Park', 'link':'https://www.google.com/maps/preview#!data=!1m7!1m3!1d2383!2d-118.2847316!3d36.5781201!2m2!1f270!2f76.79!2m1!1e3!4m17!2m16!1m15!1s0x80bf8d3667a6b6c5%3A0x77dad12cf276cbf2!3m10!1m3!1d172!2d-111.4148734!3d36.8972668!2m1!2f77.92!3m2!1i1149!2i626!4f35!4m2!3d36.5784451!4d-118.2922437&fid=7'},
	'lower_antelope':{desc:'Lower Antelope Canyon', 'link':'https://www.google.com/maps/preview#!data=!1m6!1m3!1d553!2d-111.4151071!3d36.899195!2m1!2f77.92!2m1!1e3&fid=7'},
	'iceland_church':{desc:'Hallgrímskirkja, Reykjavík, Iceland', 'link':'https://www.google.com/maps/@64.142208,-21.927385,3a,75y,99.14h,121.73t/data=!3m5!1e1!3m3!1spvYxghnxSkYAAAQIt8t0Xw!2e0!3e11?hl=en'},
	'reykjavik_musichall':{desc:'Harpa Concert Hall, Reykjavík, Iceland', 'link':'https://www.google.com/maps/@64.14956,-21.933708,3a,75y,9.23h,103.04t/data=!3m5!1e1!3m3!1sCPGKeWPtlIsAAAAGOv0llw!2e0!3e11?hl=en'},
}, 
	bg = [
			'canyonlands',
			'french_atlantic',
			'quandary',
			'quandary2',
			'jtree',
			'hoodoo',
			'hearst',
			'zion',
			'mesa',
			'grand_canyon',
			'castle_hill',
			'halfdome',
			'whitney',
			'whitney2',
			'lower_antelope',
			'iceland_church',
			'reykjavik_musichall'
	],
	animates = ['pulse'];
		//['flash', 'shake', 'swing', 'pulse', 'bounce', 'tada', 'wobble'];

$(document).ready(function(){
	id = getParameterByName('bg');
	changeBG(id);
});

// Returns a random integer between min and max
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function changeBG(default_i){
	if (typeof default_i !== 'undefined' && default_i != '' && default_i < bg.length && default_i >= 0) {
		new_i = default_i;
	}else{
		var new_i = getRandomInt(0,(bg.length - 1));
		while(new_i == i){
			new_i = getRandomInt(0,(bg.length - 1));
		}
	}

	i = new_i;

	$('html').css('background-image', 'url(' + bg[i] + '.jpg)');
	$('#info_text').html(gps[bg[i]]['desc']);
	if (gps[bg[i]]['link'] != undefined) {
		$('#info_text').attr('href', gps[bg[i]]['link']);
	}
	$('#info').removeClass();
	setTimeout(function(){
		$('#info').addClass('animated '+animates[getRandomInt(0,(animates.length -1 ))]);
	},1000);
}

$('#change_bg').click(function(){
	changeBG();
})

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? undefined : decodeURIComponent(results[1].replace(/\+/g, " "));
}