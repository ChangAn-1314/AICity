<template>
  <div class="flex flex-col items-center justify-center h-screen bg-gray-950 text-white relative overflow-hidden">
    <!-- Cyberpunk background elements -->
    <div class="absolute inset-0 bg-[url('/noise.png')] opacity-5"></div>
    <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
    
    <h1 class="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-cyan-400 to-blue-600 tracking-tighter glitch-text" data-text="404">
      404
    </h1>
    
    <div class="mt-8 text-2xl font-mono text-cyan-300 tracking-widest uppercase">
      System Error: Page Not Found
    </div>
    
    <p class="mt-4 text-gray-400 max-w-md text-center">
      The requested coordinates do not exist in the neural network. 
      Please recalibrate your navigation.
    </p>
    
    <router-link 
      to="/" 
      class="mt-12 px-8 py-3 bg-cyan-900/30 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300 transition-all duration-300 font-mono uppercase tracking-wider relative group"
    >
      <span class="absolute inset-0 w-full h-full bg-cyan-500/5 blur-md group-hover:bg-cyan-500/10 transition-all"></span>
      Return to Grid
    </router-link>
  </div>
</template>

<style scoped>
.glitch-text {
  position: relative;
  animation: glitch 3s infinite;
}

.glitch-text::before,
.glitch-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #0a0f1a; /* Match bg color */
}

.glitch-text::before {
  left: 2px;
  text-shadow: -1px 0 #ff00c1;
  clip: rect(44px, 450px, 56px, 0);
  animation: glitch-anim 5s infinite linear alternate-reverse;
}

.glitch-text::after {
  left: -2px;
  text-shadow: -1px 0 #00fff9;
  clip: rect(44px, 450px, 56px, 0);
  animation: glitch-anim2 5s infinite linear alternate-reverse;
}

@keyframes glitch-anim {
  0% { clip: rect(14px, 9999px, 12px, 0); }
  5% { clip: rect(84px, 9999px, 34px, 0); }
  10% { clip: rect(36px, 9999px, 73px, 0); }
  15% { clip: rect(11px, 9999px, 93px, 0); }
  20% { clip: rect(59px, 9999px, 17px, 0); }
  25% { clip: rect(94px, 9999px, 39px, 0); }
  30% { clip: rect(26px, 9999px, 82px, 0); }
  35% { clip: rect(63px, 9999px, 2px, 0); }
  40% { clip: rect(12px, 9999px, 55px, 0); }
  45% { clip: rect(56px, 9999px, 21px, 0); }
  50% { clip: rect(88px, 9999px, 64px, 0); }
  55% { clip: rect(3px, 9999px, 19px, 0); }
  60% { clip: rect(31px, 9999px, 96px, 0); }
  65% { clip: rect(79px, 9999px, 4px, 0); }
  70% { clip: rect(23px, 9999px, 71px, 0); }
  75% { clip: rect(67px, 9999px, 33px, 0); }
  80% { clip: rect(45px, 9999px, 91px, 0); }
  85% { clip: rect(8px, 9999px, 28px, 0); }
  90% { clip: rect(92px, 9999px, 50px, 0); }
  95% { clip: rect(15px, 9999px, 76px, 0); }
  100% { clip: rect(49px, 9999px, 62px, 0); }
}

@keyframes glitch-anim2 {
  0% { clip: rect(65px, 9999px, 100px, 0); }
  5% { clip: rect(52px, 9999px, 74px, 0); }
  10% { clip: rect(79px, 9999px, 85px, 0); }
  15% { clip: rect(13px, 9999px, 18px, 0); }
  20% { clip: rect(37px, 9999px, 34px, 0); }
  25% { clip: rect(86px, 9999px, 6px, 0); }
  30% { clip: rect(28px, 9999px, 59px, 0); }
  35% { clip: rect(71px, 9999px, 25px, 0); }
  40% { clip: rect(42px, 9999px, 97px, 0); }
  45% { clip: rect(93px, 9999px, 44px, 0); }
  50% { clip: rect(5px, 9999px, 66px, 0); }
  55% { clip: rect(58px, 9999px, 16px, 0); }
  60% { clip: rect(21px, 9999px, 89px, 0); }
  65% { clip: rect(62px, 9999px, 37px, 0); }
  70% { clip: rect(39px, 9999px, 53px, 0); }
  75% { clip: rect(91px, 9999px, 8px, 0); }
  80% { clip: rect(16px, 9999px, 69px, 0); }
  85% { clip: rect(76px, 9999px, 48px, 0); }
  90% { clip: rect(47px, 9999px, 92px, 0); }
  95% { clip: rect(82px, 9999px, 23px, 0); }
  100% { clip: rect(33px, 9999px, 61px, 0); }
}
</style>
