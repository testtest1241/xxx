import * as Phaser from 'phaser';

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainMenuScene' });
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Başlık
    const title = this.add.text(width / 2, height / 4, 'Kedi\'nin Aşk Planı', {
      fontFamily: 'monospace',
      fontSize: '32px',
      color: '#ffffff'
    });
    title.setOrigin(0.5);

    // Alt başlık
    const subtitle = this.add.text(width / 2, height / 4 + 40, 'Dişleri Topla, Kalpleri Yakala!', {
      fontFamily: 'monospace',
      fontSize: '20px',
      color: '#ffffff'
    });
    subtitle.setOrigin(0.5);

    // Başlat butonu
    const startButton = this.add.text(width / 2, height / 2, 'Oyunu Başlat', {
      fontFamily: 'monospace',
      fontSize: '24px',
      color: '#ffffff',
      backgroundColor: '#4a4a4a',
      padding: {
        x: 20,
        y: 10
      }
    });
    startButton.setOrigin(0.5);
    startButton.setInteractive();

    // Buton hover efekti
    startButton.on('pointerover', () => {
      startButton.setStyle({ backgroundColor: '#666666' });
    });

    startButton.on('pointerout', () => {
      startButton.setStyle({ backgroundColor: '#4a4a4a' });
    });

    // Oyunu başlat
    startButton.on('pointerdown', () => {
      this.scene.start('GameScene');
    });

    // Karakterleri göster
    // const girl = this.add.sprite(width / 4, height * 0.7, 'girl');
    // girl.play('girl-walk');
    // girl.setScale(2);

    // const boy = this.add.sprite(width * 3/4, height * 0.7, 'boy');
    // boy.play('boy-idle');
    // boy.setScale(2);

    // const cat = this.add.sprite(width / 2, height * 0.7, 'cat');
    // cat.play('cat-idle');
    // cat.setScale(2);

    // Oyun talimatları
    const instructions = this.add.text(width / 2, height - 50, 
      'Kontroller:\n' +
      '• Ok tuşları ile hareket et\n' +
      '• SPACE tuşu ile karakter değiştir\n' +
      '• Dokunmatik ekranda parmağınızı sürükleyin', {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#ffffff',
      align: 'center'
    });
    instructions.setOrigin(0.5);

    // Arka plan müziği
    // this.sound.play('menu-music', { loop: true, volume: 0.5 });
  }
} 