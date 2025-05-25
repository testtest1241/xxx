import * as Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // Loading bar oluştur
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Loading bar arka planı
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 4, height / 2 - 30, width / 2, 50);

    // Loading yazısı
    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Yükleniyor...',
      style: {
        font: '20px monospace',
        color: '#ffffff'
      }
    });
    loadingText.setOrigin(0.5, 0.5);

    // Asset'leri yükle
    this.load.on('progress', (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(width / 4 + 10, height / 2 - 20, (width / 2 - 20) * value, 30);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
    });

    // Karakter sprite'larını yükle (artık spritesheet değil, tek resim)
    this.load.image('girl', '/sprites/kiz.png');
    this.load.image('boy', '/sprites/erkek.png');
    this.load.image('cat', '/sprites/Cat.png');
    // Diş ve kalp sprite'larını yükle
    this.load.image('tooth', '/sprites/dis.png');
    this.load.image('heart', '/sprites/kalp.png');

    // Arka plan
    this.load.image('background', '/background.jpg');
  }

  create() {
    // Arka planı tam ekran tileSprite olarak ekle
    this.add.tileSprite(0, 0, 1600, 1200, 'background').setOrigin(0, 0).setDepth(-1000);
    // Ana menüye geç
    this.scene.start('MainMenuScene');
  }
} 