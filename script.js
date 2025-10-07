// Khởi động nhạc nền
function playMusic() {
  const music = document.getElementById('background-music');
  if (music && music.paused) { music.play().catch(()=>{}); }
}
window.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', playMusic, { once: true });

  if (config.hinhAnhBen) {
    const leftContainer = document.getElementById('left-container');
    const rightContainer = document.getElementById('right-container');
    const leftImg = document.getElementById('left-image');
    const rightImg = document.getElementById('right-image');
    
    if (leftImg && config.hinhAnhBen.trai) {
      leftImg.src = config.hinhAnhBen.trai;
      leftImg.style.width = config.hinhAnhBen.kichThuoc || '15vw';
    }
    if (rightImg && config.hinhAnhBen.phai) {
      rightImg.src = config.hinhAnhBen.phai;
      rightImg.style.width = config.hinhAnhBen.kichThuoc || '15vw';
    }

    const intensity = config.hinhAnhBen.cuongDoLac || 'nhe';
    const animationName = 'shake-' + intensity;
    if(leftContainer) leftContainer.style.animationName = animationName;
    if(rightContainer) rightContainer.style.animationName = animationName;
    
    const margin = config.hinhAnhBen.canhLeNgang || '2vw';
    if (leftContainer) leftContainer.style.left = margin;
    if (rightContainer) rightContainer.style.right = margin;
  }
  
  if (config.hinhDanSticker) {
    const leftSticker = document.getElementById('left-sticker');
    const rightSticker = document.getElementById('right-sticker');
    
    if (leftSticker && config.hinhDanSticker.trai) {
      leftSticker.src = config.hinhDanSticker.trai;
      leftSticker.style.width = config.hinhDanSticker.kichThuoc || '5vw';
    }
    if (rightSticker && config.hinhDanSticker.phai) {
      rightSticker.src = config.hinhDanSticker.phai;
      rightSticker.style.width = config.hinhDanSticker.kichThuoc || '5vw';
    }
  }
});

function showSideImages() {
  const leftContainer = document.getElementById('left-container');
  const rightContainer = document.getElementById('right-container');
  
  if (leftContainer && rightContainer) {
    leftContainer.style.visibility = 'visible';
    rightContainer.style.visibility = 'visible';
    
    leftContainer.classList.add('animate__animated', 'animate__bounceInLeft', 'animate__slow');
    rightContainer.classList.add('animate__animated', 'animate__bounceInRight', 'animate__slow');
  }
}

const content = document.getElementById('content');
const timer = document.getElementById('timer');
const nextBtn = document.getElementById('nextBtn');

const second = 1000, minute = second * 60, hour = minute * 60, day = hour * 24;
const pad = (n) => String(n).padStart(2, '0');

function startCountdown() {
  document.getElementById('name').innerText = config.tenNguoiNhan || "";
  const countDown = new Date(config.ngaySinhNhat).getTime();
  const interval = setInterval(() => {
    const now = new Date().getTime();
    const distance = countDown - now;

    if (distance <= 0) {
      clearInterval(interval);
      timer.classList.add('d-none');
      confetti();
      showSideImages(); 
      _slideSatu();
      return;
    }

    const d = Math.floor(distance / day);
    const h = Math.floor((distance % day) / hour);
    const m = Math.floor((distance % hour) / minute);
    const s = Math.floor((distance % minute) / second);

    document.getElementById('days').innerText = pad(d);
    document.getElementById('hours').innerText = pad(h);
    document.getElementById('minutes').innerText = pad(m);
    document.getElementById('seconds').innerText = pad(s);
  }, 1000);
}

function showNextButton(callback) {
  nextBtn.textContent = config.nutTiepTuc || "Tiếp tục";
  nextBtn.classList.remove('d-none');
  nextBtn.classList.add('animate__animated','animate__pulse','animate__slow');
  const handler = () => {
    nextBtn.classList.add('d-none');
    nextBtn.removeEventListener('click', handler);
    callback && callback();
  };
  nextBtn.addEventListener('click', handler);
}

function _slideSatu() {
  const slideSatu = document.getElementById('slideSatu');
  slideSatu.classList.remove('d-none');
  setTimeout(() => {
    showNextButton(() => _slideDua());
  }, 2000);
}

function _slideDua() {
  const slideSatu = document.getElementById('slideSatu');
  slideSatu.classList.replace('animate__slideInDown', 'animate__backOutDown');
  setTimeout(() => { slideSatu.classList.add('d-none'); }, 900);

  const slideDua = document.getElementById('slideDua');
  slideDua.classList.remove('d-none');

  new TypeIt("#teks1", {
    strings: config.loiChucMoDau || [],
    startDelay: 500,
    speed: 75,
    waitUntilVisible: true,
    afterComplete: () => {
      showNextButton(() => {
        slideDua.classList.replace('animate__zoomInDown','animate__fadeOutLeft');
        setTimeout(() => { slideDua.remove(); _slideTiga(); }, 800);
      });
    }
  }).go();
}

function _slideTiga() {
  const slideTiga = document.getElementById('slideTiga');
  slideTiga.classList.remove('d-none');

  new TypeIt("#teks2", {
    strings: config.loiChucTiepTheo || [],
    startDelay: 500,
    speed: 75,
    waitUntilVisible: true,
    afterComplete: () => {
      showNextButton(() => {
        slideTiga.classList.replace('animate__fadeInRight','animate__fadeOut');
        setTimeout(() => { slideTiga.remove(); _slideEmpat(); }, 800);
      });
    }
  }).go();
}

// --- Logic cuối cùng được xử lý tại đây ---
function _slideEmpat() {
  const slideEmpat = document.getElementById('slideEmpat');
  slideEmpat.classList.remove('d-none');

  document.getElementById('likeTitle').innerText = config.tieuDeThichKhong || "Bạn có thích không?";
  const btnNo = document.getElementById('gak');
  const btnYes = document.getElementById('suka');
  btnNo.textContent = config.nutKhong || "Không";
  btnYes.textContent = config.nutThich || "Thích";

  function getRandomPosition(element) {
    const y = document.body.offsetWidth - element.clientWidth;
    const randomX = Math.floor(Math.random() * 500);
    const randomY = Math.floor(Math.random() * y);
    return [randomX, randomY];
  }

  btnNo.addEventListener('click', function () {
    const xy = getRandomPosition(slideEmpat);
    slideEmpat.style.top = xy[0] + 'px';
  });

  btnYes.addEventListener('click', function () {
    slideEmpat.classList.add('animate__animated', 'animate__fadeOut');

    slideEmpat.addEventListener('animationend', () => {
      slideEmpat.remove();

      const imageContainer = document.getElementById('image-container');
      const finalImage = document.getElementById('final-image');
      
      // --- UPDATED LOGIC: Chọn cấu hình ảnh dựa trên kích thước màn hình ---
      if (config.hinhAnhKetThuc) {
        let imageConfig;
        // Màn hình rộng <= 768px được coi là mobile
        if (window.innerWidth <= 768 && config.hinhAnhKetThuc.mobile) {
            imageConfig = config.hinhAnhKetThuc.mobile;
        } else {
            // Mặc định hoặc màn hình lớn hơn
            imageConfig = config.hinhAnhKetThuc.desktop;
        }

        if(imageConfig) {
            finalImage.src = imageConfig.duongDan || '';
            finalImage.style.width = imageConfig.kichThuoc || '30vw';
        }
      }
      // --- KẾT THÚC LOGIC CẬP NHẬT ---

      imageContainer.classList.remove('d-none');
      finalImage.classList.add('animate__animated', 'animate__bounceIn');

      finalImage.addEventListener('animationend', () => {
          finalImage.classList.remove('animate__bounceIn');
          finalImage.classList.add('float-animation');
      }, { once: true });

    }, { once: true });
  });
}

// Confetti (giữ nguyên)
'use strict';
var onlyOnKonami = false;
function confetti() {
  var $window = $(window), random = Math.random, cos = Math.cos, sin = Math.sin,
      PI = Math.PI, PI2 = PI * 2, timer = undefined, frame = undefined, confetti = [];
  var runFor = 2000, isRunning = true; setTimeout(() => { isRunning = false }, runFor);
  var particles = 150, spread = 20, sizeMin = 5, sizeMax = 12 - sizeMin, eccentricity = 10, deviation = 100,
      dxThetaMin = -.1, dxThetaMax = -dxThetaMin - dxThetaMin, dyMin = .13, dyMax = .18, dThetaMin = .4, dThetaMax = .7 - dThetaMin;
  function color(r,g,b){return 'rgb('+r+','+g+','+b+')';}
  var colorThemes = [function(){return color(200*random()|0,200*random()|0,200*random()|0);},
    function(){var b=200*random()|0; return color(200,b,b);},
    function(){var b=200*random()|0; return color(b,200,b);},
    function(){var b=200*random()|0; return color(b,b,200);},
    function(){return color(200,100,200*random()|0);},
    function(){return color(200*random()|0,200,200);},
    function(){var b=256*random()|0; return color(b,b,b);},
    function(){return colorThemes[random()<.5?1:2]();},
    function(){return colorThemes[random()<.5?3:5]();},
    function(){return colorThemes[random()<.5?2:4]();}];
  function interpolation(a,b,t){return (1-cos(PI*t))/2*(b-a)+a;}
  var radius = 1 / eccentricity, radius2 = radius + radius;
  function createPoisson(){var domain=[radius,1-radius], measure=1-radius2, spline=[0,1];
    while(measure){var dart=measure*random(), i,l,interval,a,b,c,d;
      for(i=0,l=domain.length,measure=0;i<l;i+=2){a=domain[i],b=domain[i+1],interval=b-a; if(dart<measure+interval){spline.push(dart+=a-measure); break;} measure+=interval;}
      c=dart-radius, d=dart+radius;
      for(i=domain.length-1;i>0;i-=2){l=i-1,a=domain[l],b=domain[i];
        if(a>=c && a<d) if(b>d) domain[l]=d; else domain.splice(l,2);
        else if(a<c && b>c) if(b<=d) domain[i]=c; else domain.splice(i,0,c,d);}
      for(i=0,l=domain.length,measure=0;i<l;i+=2) measure+=domain[i+1]-domain[i];}
    return spline.sort();}
  var container=document.createElement('div'); container.style.position='fixed'; container.style.top='0'; container.style.left='0';
  container.style.width='100%'; container.style.height='0'; container.style.overflow='visible'; container.style.zIndex='9999';
  function Confetto(theme){this.frame=0; this.outer=document.createElement('div'); this.inner=document.createElement('div'); this.outer.appendChild(this.inner);
    var outerStyle=this.outer.style, innerStyle=this.inner.style; outerStyle.position='absolute';
    outerStyle.width=(sizeMin+sizeMax*random())+'px'; outerStyle.height=(sizeMin+sizeMax*random())+'px'; innerStyle.width='100%'; innerStyle.height='100%';
    innerStyle.backgroundColor=theme(); outerStyle.perspective='50px'; outerStyle.transform='rotate('+(360*random())+'deg)';
    this.axis='rotate3D('+cos(360*random())+','+cos(360*random())+',0,'; this.theta=360*random(); this.dTheta=dThetaMin+dThetaMax*random(); innerStyle.transform=this.axis+this.theta+'deg)';
    this.x=$(window).width()*random(); this.y=-deviation; this.dx=sin(dxThetaMin+dxThetaMax*random()); this.dy=dyMin+dyMax*random();
    outerStyle.left=this.x+'px'; outerStyle.top=this.y+'px';
    this.splineX=createPoisson(); this.splineY=[]; for(var i=1, l=this.splineX.length-1; i<l; ++i) this.splineY[i]=deviation*random(); this.splineY[0]=this.splineY[l]=deviation*random();
    this.update=function(height, delta){ this.frame+=delta; this.x+=this.dx*delta; this.y+=this.dy*delta; this.theta+=this.dTheta*delta;
      var phi=this.frame%7777/7777, i=0,j=1; while(phi>=this.splineX[j]) i=j++; var rho=interpolation(this.splineY[i], this.splineY[j], (phi-this.splineX[i])/(this.splineX[j]-this.splineX[i]));
      phi*=PI2; outerStyle.left=this.x+rho*cos(phi)+'px'; outerStyle.top=this.y+rho*sin(phi)+'px'; innerStyle.transform=this.axis+this.theta+'deg)'; return this.y>height+deviation;};
  }
  function poof(){ if(!frame){ document.body.appendChild(container);
      var theme=colorThemes[onlyOnKonami? colorThemes.length*random()|0 : 0], count=0;
      (function addConfetto(){ if(onlyOnKonami && ++count>particles) return timer=undefined;
        if(isRunning){ var confetto=new Confetto(theme); confetti.push(confetto); container.appendChild(confetto.outer);
          timer=setTimeout(addConfetto, spread*random()); }})(); var prev=undefined;
      requestAnimationFrame(function loop(timestamp){ var delta=prev ? timestamp-prev : 0; prev=timestamp; var height=$(window).height();
        for(var i=confetti.length-1;i>=0;--i){ if(confetti[i].update(height, delta)){ container.removeChild(confetti[i].outer); confetti.splice(i,1);} }
        if(timer || confetti.length) return frame=requestAnimationFrame(loop); document.body.removeChild(container); frame=undefined; });
  }}
  if(!onlyOnKonami) poof();
}

// Khởi chạy
startCountdown();