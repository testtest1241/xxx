'use client';

import { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import Joystick from './Joystick';

// Oyun sahneleri
import { BootScene } from '@/scenes/BootScene';
import { MainMenuScene } from '@/scenes/MainMenuScene';
import { GameScene } from '@/scenes/GameScene';

const Game = () => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const [pressed, setPressed] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && !gameRef.current) {
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        parent: 'game-container',
        width: 800,
        height: 600,
        pixelArt: true,
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { y: 0 },
            debug: false
          }
        },
        scene: [BootScene, MainMenuScene, GameScene],
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH
        }
      };

      gameRef.current = new Phaser.Game(config);
    }

    // Mobil tuşlara basılı tutma için interval
    let interval: NodeJS.Timeout | null = null;
    if (pressed) {
      interval = setInterval(() => {
        window.dispatchEvent(new CustomEvent('phaser-move', { detail: pressed }));
      }, 50);
    }
    const move = (dir: string) => {
      window.dispatchEvent(new CustomEvent('phaser-move', { detail: dir }));
    };
    const stop = () => {
      window.dispatchEvent(new CustomEvent('phaser-stop'));
    };
    const switchChar = () => {
      window.dispatchEvent(new CustomEvent('phaser-switch'));
    };
    const upBtn = document.getElementById('up-btn');
    const downBtn = document.getElementById('down-btn');
    const leftBtn = document.getElementById('left-btn');
    const rightBtn = document.getElementById('right-btn');
    const switchBtn = document.getElementById('switch-btn');
    if (upBtn) {
      upBtn.ontouchstart = () => setPressed('up');
      upBtn.ontouchend = () => setPressed(null);
      upBtn.onmousedown = () => setPressed('up');
      upBtn.onmouseup = () => setPressed(null);
      upBtn.onmouseleave = () => setPressed(null);
    }
    if (downBtn) {
      downBtn.ontouchstart = () => setPressed('down');
      downBtn.ontouchend = () => setPressed(null);
      downBtn.onmousedown = () => setPressed('down');
      downBtn.onmouseup = () => setPressed(null);
      downBtn.onmouseleave = () => setPressed(null);
    }
    if (leftBtn) {
      leftBtn.ontouchstart = () => setPressed('left');
      leftBtn.ontouchend = () => setPressed(null);
      leftBtn.onmousedown = () => setPressed('left');
      leftBtn.onmouseup = () => setPressed(null);
      leftBtn.onmouseleave = () => setPressed(null);
    }
    if (rightBtn) {
      rightBtn.ontouchstart = () => setPressed('right');
      rightBtn.ontouchend = () => setPressed(null);
      rightBtn.onmousedown = () => setPressed('right');
      rightBtn.onmouseup = () => setPressed(null);
      rightBtn.onmouseleave = () => setPressed(null);
    }
    if (switchBtn) {
      switchBtn.onclick = switchChar;
      switchBtn.ontouchstart = switchChar;
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
      if (upBtn) upBtn.ontouchstart = upBtn.ontouchend = upBtn.onmousedown = upBtn.onmouseup = upBtn.onmouseleave = null;
      if (downBtn) downBtn.ontouchstart = downBtn.ontouchend = downBtn.onmousedown = downBtn.onmouseup = downBtn.onmouseleave = null;
      if (leftBtn) leftBtn.ontouchstart = leftBtn.ontouchend = leftBtn.onmousedown = leftBtn.onmouseup = leftBtn.onmouseleave = null;
      if (rightBtn) rightBtn.ontouchstart = rightBtn.ontouchend = rightBtn.onmousedown = rightBtn.onmouseup = rightBtn.onmouseleave = null;
      if (switchBtn) switchBtn.onclick = switchBtn.ontouchstart = null;
      if (interval) clearInterval(interval);
    };
  }, [pressed]);

  return (
    <>
      <div id="game-container" className="w-full h-full max-w-[1600px] max-h-[1200px] relative" />
      <Joystick />
      <button id="switch-btn" className="fixed bottom-4 right-4 z-50 w-24 h-12 bg-pink-600 text-white rounded-lg">Karakter Değiştir</button>
    </>
  );
};

export default Game; 