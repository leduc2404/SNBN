const dom = {
  music: document.getElementById('background-music'),
  leftContainer: document.getElementById('left-container'),
  rightContainer: document.getElementById('right-container'),
  leftImage: document.getElementById('left-image'),
  rightImage: document.getElementById('right-image'),
  leftSticker: document.getElementById('left-sticker'),
  rightSticker: document.getElementById('right-sticker'),
  timer: document.getElementById('timer'),
  name: document.getElementById('name'),
  days: document.getElementById('days'),
  hours: document.getElementById('hours'),
  minutes: document.getElementById('minutes'),
  seconds: document.getElementById('seconds'),
  nextBtn: document.getElementById('nextBtn'),
  slideSatu: document.getElementById('slideSatu'),
  slideDua: document.getElementById('slideDua'),
  slideTiga: document.getElementById('slideTiga'),
  slideEmpat: document.getElementById('slideEmpat'),
  likeTitle: document.getElementById('likeTitle'),
  btnNo: document.getElementById('gak'),
  btnYes: document.getElementById('suka'),
  imageContainer: document.getElementById('image-container'),
  finalImage: document.getElementById('final-image'),
};

// --- TỐI ƯU: Hàm tiện ích để chờ một khoảng thời gian ---
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Khởi động nhạc nền
function playMusic() {
  if (dom.music && dom.music.paused) {
    dom.music.play().catch(() => {});
  }
}

// Thiết lập hình ảnh trang trí
function setupDecorations() {
  if (config.hinhAnhBen) {
    dom.leftImage.src = config.hinhAnhBen.trai;
    dom.leftImage.style.width = config.hinhAnhBen.kichThuoc || '15vw';
    dom.rightImage.src = config.hinhAnhBen.phai;
    dom.rightImage.style.width = config.hinhAnhBen.kichThuoc || '15vw';
    
    const intensity = 'shake-' + (config.hinhAnhBen.cuongDoLac || 'nhe');
    dom.leftContainer.style.animationName = intensity;
    dom.rightContainer.style.animationName = intensity;
    
    const margin = config.hinhAnhBen.canhLeNgang || '2vw';
    dom.leftContainer.style.left = margin;
    dom.rightContainer.style.right = margin;
  }
  
  if (config.hinhDanSticker) {
    dom.leftSticker.src = config.hinhDanSticker.trai;
    dom.leftSticker.style.width = config.hinhDanSticker.kichThuoc || '5vw';
    dom.rightSticker.src = config.hinhDanSticker.phai;
    dom.rightSticker.style.width = config.hinhDanSticker.kichThuoc || '5vw';
  }
}

function showSideImages() {
  dom.leftContainer.style.visibility = 'visible';
  dom.rightContainer.style.visibility = 'visible';
  dom.leftContainer.classList.add('animate__animated', 'animate__bounceInLeft', 'animate__slow');
  dom.rightContainer.classList.add('animate__animated', 'animate__bounceInRight', 'animate__slow');
}

// Đếm ngược
function startCountdown() {
  dom.name.innerText = config.tenNguoiNhan || "";
  const countDownDate = new Date(config.ngaySinhNhat).getTime();
  
  const interval = setInterval(() => {
    const now = new Date().getTime();
    const distance = countDownDate - now;

    if (distance <= 0) {
      clearInterval(interval);
      dom.timer.classList.add('d-none');
      confetti();
      showSideImages();
      mainFlow(); // --- TỐI ƯU: Bắt đầu luồng chính ---
      return;
    }

    const pad = (n) => String(n).padStart(2, '0');
    dom.days.innerText = pad(Math.floor(distance / (1000 * 60 * 60 * 24)));
    dom.hours.innerText = pad(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    dom.minutes.innerText = pad(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
    dom.seconds.innerText = pad(Math.floor((distance % (1000 * 60)) / 1000));
  }, 1000);
}

// --- TỐI ƯU: Các hàm tiện ích cho luồng chính (async/await) ---

// 1. Chờ người dùng nhấn nút "Tiếp tục"
function waitForNextButtonClick() {
  return new Promise(resolve => {
    dom.nextBtn.classList.remove('d-none');
    dom.nextBtn.classList.add('animate__animated','animate__pulse','animate__slow');
    dom.nextBtn.textContent = config.nutTiepTuc || "Tiếp tục";
    
    dom.nextBtn.onclick = () => {
      dom.nextBtn.classList.add('d-none');
      dom.nextBtn.onclick = null; // Xóa event listener
      resolve();
    };
  });
}

// 2. Hàm gõ chữ
function typeMessage(elementId, messages) {
  return new Promise(resolve => {
    new TypeIt(elementId, {
      strings: messages,
      startDelay: 500,
      speed: 75,
      waitUntilVisible: true,
      afterComplete: resolve,
    }).go();
  });
}

// 3. Xử lý phần lựa chọn "Thích/Không"
function handleChoice() {
  return new Promise(resolve => {
    dom.slideEmpat.classList.remove('d-none');
    dom.slideEmpat.classList.add('animate__fadeInDown');
    
    dom.likeTitle.innerText = config.tieuDeThichKhong || "Bạn có thích không?";
    dom.btnNo.textContent = config.nutKhong || "Không";
    dom.btnYes.textContent = config.nutThich || "Thích";

    dom.btnNo.onclick = () => {
      const x = Math.floor(Math.random() * (window.innerHeight - 200));
      const y = Math.floor(Math.random() * (window.innerWidth - 400));
      dom.slideEmpat.style.position = 'absolute';
      dom.slideEmpat.style.top = x + 'px';
      dom.slideEmpat.style.left = y + 'px';
    };

    dom.btnYes.onclick = () => {
      dom.slideEmpat.classList.replace('animate__fadeInDown', 'animate__fadeOut');
      dom.slideEmpat.addEventListener('animationend', resolve, { once: true });
    };
  });
}

// 4. Hiển thị ảnh kết thúc
function showFinalImage() {
  let imageConfig = config.hinhAnhKetThuc.desktop;
  if (window.innerWidth <= 768 && config.hinhAnhKetThuc.mobile) {
    imageConfig = config.hinhAnhKetThuc.mobile;
  }
  
  if (imageConfig) {
    dom.finalImage.src = imageConfig.duongDan || '';
    dom.finalImage.style.width = imageConfig.kichThuoc || '50vw';
  }
  
  dom.imageContainer.classList.remove('d-none');
  dom.finalImage.classList.add('animate__animated', 'animate__bounceIn');
  dom.finalImage.addEventListener('animationend', () => {
    dom.finalImage.classList.remove('animate__bounceIn');
    dom.finalImage.classList.add('float-animation');
  }, { once: true });
}

// --- TỐI ƯU: Luồng chính của ứng dụng được viết lại bằng async/await ---
const mainFlow = async () => {
  // Slide 1
  dom.slideSatu.classList.remove('d-none');
  await waitForNextButtonClick();
  
  // Chuyển sang Slide 2
  dom.slideSatu.querySelector('img').classList.replace('animate__slideInDown', 'animate__backOutDown');
  await wait(900);
  dom.slideSatu.classList.add('d-none');
  
  dom.slideDua.classList.remove('d-none');
  dom.slideDua.classList.add('animate__zoomInDown');
  await typeMessage("#teks1", config.loiChucMoDau || []);
  await waitForNextButtonClick();
  
  // Chuyển sang Slide 3
  dom.slideDua.classList.replace('animate__zoomInDown', 'animate__fadeOutLeft');
  await wait(800);
  dom.slideDua.classList.add('d-none');
  
  dom.slideTiga.classList.remove('d-none');
  dom.slideTiga.classList.add('animate__fadeInRight');
  await typeMessage("#teks2", config.loiChucTiepTheo || []);
  await waitForNextButtonClick();

  // Chuyển sang Slide 4 (lựa chọn)
  dom.slideTiga.classList.replace('animate__fadeInRight', 'animate__fadeOut');
  await wait(800);
  dom.slideTiga.classList.add('d-none');

  await handleChoice();

  // Hiển thị ảnh cuối cùng
  showFinalImage();
};

// --- Khởi chạy khi trang được tải ---
window.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', playMusic, { once: true });
  setupDecorations();
  startCountdown();
});

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