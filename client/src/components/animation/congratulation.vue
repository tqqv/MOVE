<template>
    <div class="js-container container2"></div>
  </template>
  
  <script>
  import { onMounted, onBeforeUnmount } from 'vue';
  
  class Confettiful {
    constructor(el) {
      this.el = el;
      this.containerEl = null;
  
      this.confettiFrequency = 3;
      this.confettiColors = ['#EF2964', '#00C09D', '#2D87B0', '#48485E', '#EFFF1D'];
      this.confettiAnimations = ['slow', 'medium', 'fast'];
  
      this._setupElements();
      this._renderConfetti();
    }
  
    _setupElements() {
      const containerEl = document.createElement('div');
      const elPosition = getComputedStyle(this.el).position;
  
      if (!['relative', 'absolute', 'fixed'].includes(elPosition)) {
        this.el.style.position = 'relative';
      }
  
      containerEl.classList.add('confetti-container');
      this.el.appendChild(containerEl);
      this.containerEl = containerEl;
    }
  
    _renderConfetti() {
      this.confettiInterval = setInterval(() => {
        const confettiEl = document.createElement('div');
        const confettiSize = `${Math.floor(Math.random() * 3) + 7}px`;
        const confettiBackground =
          this.confettiColors[Math.floor(Math.random() * this.confettiColors.length)];
        const confettiLeft = `${Math.floor(Math.random() * this.el.offsetWidth)}px`;
        const confettiAnimation =
          this.confettiAnimations[Math.floor(Math.random() * this.confettiAnimations.length)];
  
        confettiEl.classList.add('confetti', `confetti--animation-${confettiAnimation}`);
        confettiEl.style.left = confettiLeft;
        confettiEl.style.width = confettiSize;
        confettiEl.style.height = confettiSize;
        confettiEl.style.backgroundColor = confettiBackground;
  
        confettiEl.removeTimeout = setTimeout(() => {
          if (confettiEl.parentNode) {
            confettiEl.parentNode.removeChild(confettiEl);
          }
        }, 3000);
  
        this.containerEl.appendChild(confettiEl);
      }, 25);
    }
  
    destroy() {
      clearInterval(this.confettiInterval);
      if (this.containerEl && this.containerEl.parentNode) {
        this.containerEl.parentNode.removeChild(this.containerEl);
      }
    }
  }
  
  export default {
    setup() {
      let confettiInstance = null;
  
      onMounted(() => {
        const container = document.querySelector('.js-container');
        if (container) {
          confettiInstance = new Confettiful(container);
        }
      });
  
      onBeforeUnmount(() => {
        if (confettiInstance) {
          confettiInstance.destroy();
        }
      });
    },
  };
  </script>
  
  <style>
  @keyframes confetti-slow {
    0% {
      transform: translate3d(0, 0, 0) rotateX(0) rotateY(0);
    }
    100% {
      transform: translate3d(25px, 105vh, 0) rotateX(360deg) rotateY(180deg);
    }
  }
  
  @keyframes confetti-medium {
    0% {
      transform: translate3d(0, 0, 0) rotateX(0) rotateY(0);
    }
    100% {
      transform: translate3d(100px, 105vh, 0) rotateX(100deg) rotateY(360deg);
    }
  }
  
  @keyframes confetti-fast {
    0% {
      transform: translate3d(0, 0, 0) rotateX(0) rotateY(0);
    }
    100% {
      transform: translate3d(-50px, 105vh, 0) rotateX(10deg) rotateY(250deg);
    }
  }
  
  .container2 {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
  }
  
  .confetti-container {
    perspective: 700px;
    position: absolute;
    overflow: hidden;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
  
  .confetti {
    position: absolute;
    top: -10px;
    border-radius: 0%;
  }
  
  .confetti--animation-slow {
    animation: confetti-slow 2.25s linear 1 forwards;
  }
  
  .confetti--animation-medium {
    animation: confetti-medium 1.75s linear 1 forwards;
  }
  
  .confetti--animation-fast {
    animation: confetti-fast 1.25s linear 1 forwards;
  }
  </style>
  