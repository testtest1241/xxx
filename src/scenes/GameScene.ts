import * as Phaser from 'phaser';

export class GameScene extends Phaser.Scene {
  private girl!: Phaser.Physics.Arcade.Sprite;
  private boy!: Phaser.Physics.Arcade.Sprite;
  private cat!: Phaser.Physics.Arcade.Sprite;
  private teeth!: Phaser.Physics.Arcade.Group;
  private hearts!: Phaser.Physics.Arcade.Group;
  private scoreText!: Phaser.GameObjects.Text;
  private collectedTeeth: number = 0;
  private collectedHearts: { girl: number; boy: number } = { girl: 0, boy: 0 };
  private gamePhase: 'teeth' | 'hearts' = 'teeth';
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private isBoyActive: boolean = false;
  private infoText: Phaser.GameObjects.Text | null = null;
  private boyMsg: Phaser.GameObjects.Text | null = null;

  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    // Oyun alanını büyüt
    this.physics.world.setBounds(0, 0, 1600, 1200);
    this.cameras.main.setBounds(0, 0, 1600, 1200);
    this.cameras.main.setZoom(0.5);

    // Arka plan
    this.add.tileSprite(0, 0, 1600, 1200, 'background').setOrigin(0, 0).setDepth(-1000);

    // Kız karakteri
    this.girl = this.physics.add.sprite(200, 600, 'girl');
    this.girl.setCollideWorldBounds(true);
    this.girl.setScale(0.1);

    // Erkek karakteri (başlangıçta görünmez)
    this.boy = this.physics.add.sprite(1200, 600, 'boy');
    this.boy.setVisible(false);
    this.boy.setCollideWorldBounds(true);
    this.boy.setScale(0.1);

    // Kedi karakteri (başlangıçta görünmez)
    this.cat = this.physics.add.sprite(800, 600, 'cat');
    this.cat.setVisible(false);
    this.cat.setCollideWorldBounds(true);
    this.cat.setScale(0.1);
    if (this.cat.body) {
      this.cat.body.enable = false;
    }

    // Diş grubu
    this.teeth = this.physics.add.group({
      key: 'tooth',
      repeat: 49,
      setXY: { x: 0, y: 0, stepX: 0, stepY: 0 }
    });

    // Dişleri rastgele pozisyonla başlat
    this.teeth.getChildren().forEach((tooth: any) => {
      const x = Phaser.Math.Between(100, 1500);
      const y = Phaser.Math.Between(100, 1100);
      tooth.setPosition(x, y);
      tooth.setScale(0.04);
      tooth.setVelocity(
        Phaser.Math.Between(-50, 50),
        Phaser.Math.Between(-50, 50)
      );
      tooth.setBounce(1);
      tooth.setCollideWorldBounds(true);
    });

    // Kalp grubu (başlangıçta görünmez)
    this.hearts = this.physics.add.group({
      key: 'heart',
      repeat: 49,
      setXY: { x: 100, y: 100, stepX: 30, stepY: 30 },
      visible: false,
      active: false
    });

    // Kalpleri küçült
    this.hearts.getChildren().forEach((heart: any) => {
      heart.setScale(0.04);
    });

    // Oyun başlığı
    this.add.text(800, 30, 'Diş ve Aşk', {
      fontSize: '36px',
      color: '#fff',
      backgroundColor: '#000',
      padding: { x: 20, y: 10 },
      align: 'center'
    }).setOrigin(0.5);

    // Skor metni
    this.scoreText = this.add.text(20, 20, 'Toplanan Diş: 0/50', {
      fontSize: '18px',
      color: '#fff',
      backgroundColor: '#000',
      padding: { x: 8, y: 4 }
    }).setOrigin(0, 0);

    // Çarpışma kontrolleri
    this.physics.add.overlap(
      this.girl,
      this.teeth,
      (obj1, obj2) => this.collectTooth(obj1 as Phaser.Physics.Arcade.Sprite, obj2 as Phaser.Physics.Arcade.Sprite),
      undefined,
      this
    );
    this.physics.add.overlap(
      this.girl,
      this.hearts,
      (obj1, obj2) => this.collectHeart(obj1 as Phaser.Physics.Arcade.Sprite, obj2 as Phaser.Physics.Arcade.Sprite),
      undefined,
      this
    );
    this.physics.add.overlap(
      this.boy,
      this.hearts,
      (obj1, obj2) => this.collectHeart(obj1 as Phaser.Physics.Arcade.Sprite, obj2 as Phaser.Physics.Arcade.Sprite),
      undefined,
      this
    );
    this.physics.add.overlap(
      this.girl,
      this.boy,
      () => this.startHeartPhase(),
      undefined,
      this
    );
    this.physics.add.overlap(
      this.girl,
      this.cat,
      () => this.checkFinal(),
      undefined,
      this
    );
    this.physics.add.overlap(
      this.boy,
      this.cat,
      () => this.checkFinal(),
      undefined,
      this
    );

    // Klavye kontrolleri
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
    } else {
      console.warn('Keyboard input is not available');
      // Varsayılan bir cursor keys objesi oluştur
      this.cursors = {
        up: { isDown: false },
        down: { isDown: false },
        left: { isDown: false },
        right: { isDown: false }
      } as Phaser.Types.Input.Keyboard.CursorKeys;
    }

    // Touch kontrolleri için
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (pointer.isDown) {
        if (this.gamePhase === 'teeth' || !this.isBoyActive) {
          this.girl.x = pointer.x;
          this.girl.y = pointer.y;
        } else {
          this.boy.x = pointer.x;
          this.boy.y = pointer.y;
        }
      }
    });

    // Karakter değiştirme tuşu
    this.input.keyboard.on('keydown-SPACE', () => {
      if (this.gamePhase === 'hearts') {
        this.isBoyActive = !this.isBoyActive;
      }
    });

    // Mobil tuşlar için event listener
    window.addEventListener('phaser-move', (e: any) => {
      const dir = e.detail;
      if (this.gamePhase === 'teeth' || !this.isBoyActive) {
        if (this.girl) {
          if (dir === 'left') this.girl.setVelocity(-320, 0);
          if (dir === 'right') this.girl.setVelocity(320, 0);
          if (dir === 'up') this.girl.setVelocity(0, -320);
          if (dir === 'down') this.girl.setVelocity(0, 320);
          if (dir === 'up-left') this.girl.setVelocity(-320, -320);
          if (dir === 'up-right') this.girl.setVelocity(320, -320);
          if (dir === 'down-left') this.girl.setVelocity(-320, 320);
          if (dir === 'down-right') this.girl.setVelocity(320, 320);
        }
      } else {
        if (this.boy) {
          if (dir === 'left') this.boy.setVelocity(-320, 0);
          if (dir === 'right') this.boy.setVelocity(320, 0);
          if (dir === 'up') this.boy.setVelocity(0, -320);
          if (dir === 'down') this.boy.setVelocity(0, 320);
          if (dir === 'up-left') this.boy.setVelocity(-320, -320);
          if (dir === 'up-right') this.boy.setVelocity(320, -320);
          if (dir === 'down-left') this.boy.setVelocity(-320, 320);
          if (dir === 'down-right') this.boy.setVelocity(320, 320);
        }
      }
    });
    window.addEventListener('phaser-stop', () => {
      this.girl.setVelocity(0, 0);
      this.boy.setVelocity(0, 0);
    });
    window.addEventListener('phaser-switch', () => {
      if (this.gamePhase === 'hearts') {
        this.isBoyActive = !this.isBoyActive;
      }
    });
  }

  update() {
    if (this.gamePhase === 'teeth') {
      this.updateGirlMovement();
      this.updateTeethMovement();
    } else {
      if (this.isBoyActive) {
        this.updateBoyMovement();
      } else {
        this.updateGirlMovement();
      }
    }
  }

  private updateTeethMovement() {
    this.teeth.getChildren().forEach((tooth: any) => {
      // Rastgele yön değiştirme
      if (Phaser.Math.Between(0, 100) < 2) {
        tooth.setVelocity(
          Phaser.Math.Between(-50, 50),
          Phaser.Math.Between(-50, 50)
        );
      }
    });
  }

  private updateGirlMovement() {
    if (this.cursors.left.isDown) {
      this.girl.setVelocityX(-320);
      this.girl.flipX = true;
    } else if (this.cursors.right.isDown) {
      this.girl.setVelocityX(320);
      this.girl.flipX = false;
    } else {
      this.girl.setVelocityX(0);
    }

    if (this.cursors.up.isDown) {
      this.girl.setVelocityY(-320);
    } else if (this.cursors.down.isDown) {
      this.girl.setVelocityY(320);
    } else {
      this.girl.setVelocityY(0);
    }
  }

  private updateBoyMovement() {
    if (this.cursors.left.isDown) {
      this.boy.setVelocityX(-320);
      this.boy.flipX = true;
    } else if (this.cursors.right.isDown) {
      this.boy.setVelocityX(320);
      this.boy.flipX = false;
    } else {
      this.boy.setVelocityX(0);
    }

    if (this.cursors.up.isDown) {
      this.boy.setVelocityY(-320);
    } else if (this.cursors.down.isDown) {
      this.boy.setVelocityY(320);
    } else {
      this.boy.setVelocityY(0);
    }
  }

  private collectTooth(girl: Phaser.Physics.Arcade.Sprite, tooth: Phaser.Physics.Arcade.Sprite) {
    if (this.gamePhase === 'teeth' && tooth && girl) {
      tooth.disableBody(true, true);
      this.collectedTeeth++;
      this.scoreText.setText(`Toplanan Diş: ${this.collectedTeeth}/50`);
      if (this.collectedTeeth >= 50 && this.boy) {
        this.boy.setVisible(true);
        // Erkek karakterin üstüne yazı ekle
        if (!this.boy.getData('msg')) {
          const msg = this.add.text(this.boy.x, this.boy.y - 60, 'Haydi dişleri bana getir!', {
            fontSize: '24px',
            color: '#fff',
            backgroundColor: '#222',
            padding: { x: 10, y: 5 },
            align: 'center'
          }).setOrigin(0.5);
          this.boy.setData('msg', msg);
          this.boyMsg = msg;
        }
      }
    }
  }

  private collectHeart(character: Phaser.Physics.Arcade.Sprite, heart: Phaser.Physics.Arcade.Sprite) {
    if (this.gamePhase === 'hearts' && heart && character) {
      if (character === this.girl && this.collectedHearts.girl >= 25) {
        return; // Kız 25 kalp topladıysa daha fazla toplayamaz
      }
      heart.disableBody(true, true);
      if (character === this.girl) {
        this.collectedHearts.girl++;
      } else if (character === this.boy) {
        this.collectedHearts.boy++;
      }
      const total = this.collectedHearts.girl + this.collectedHearts.boy;
      this.scoreText.setText(`Toplanan Kalp: ${total}/50 (Kız: ${this.collectedHearts.girl}, Erkek: ${this.collectedHearts.boy})`);
    }
  }

  private startHeartPhase() {
    if (this.gamePhase === 'teeth' && this.collectedTeeth >= 50) {
      this.gamePhase = 'hearts';
      // Erkek karakterin üstündeki yazıyı kaldır
      if (this.boyMsg) {
        this.boyMsg.destroy();
        this.boyMsg = null;
      }
      // Tepeye bilgi yazısı ekle
      this.showInfo('Kocik de Asrik de eşit sayıda kalp toplamalı!', 10000);
      // Kedi karakterini göster
      this.cat.setVisible(true);
      if (this.cat.body) {
        this.cat.body.enable = true;
      }
      // Kediyle ilgili overlap'ları burada ekle
      this.physics.add.overlap(
        this.girl,
        this.cat,
        () => this.checkFinal(),
        undefined,
        this
      );
      this.physics.add.overlap(
        this.boy,
        this.cat,
        () => this.checkFinal(),
        undefined,
        this
      );
      // Kedi karakterinin üstüne yazı ekle
      if (!this.cat.getData('msg')) {
        const msg = this.add.text(this.cat.x, this.cat.y - 60, "Tüm kalpleri toplayıp bana getirin 'miuw'", {
          fontSize: '24px',
          color: '#fff',
          backgroundColor: '#222',
          padding: { x: 10, y: 5 },
          align: 'center'
        }).setOrigin(0.5);
        this.cat.setData('msg', msg);
      }
      // Kalp patlaması efekti
      this.time.delayedCall(1000, () => {
        // Kalpleri aktif et ve dağıt
        this.hearts.setVisible(true);
        this.hearts.setActive(true);
        this.hearts.getChildren().forEach((heart: any) => {
          const x = Phaser.Math.Between(200, 1400);
          const y = Phaser.Math.Between(200, 1000);
          heart.setPosition(x, y);
          heart.setVelocity(
            Phaser.Math.Between(-50, 50),
            Phaser.Math.Between(-50, 50)
          );
          heart.setBounce(1);
          heart.setCollideWorldBounds(true);
        });
        this.scoreText.setText('Toplanan Kalp: 0/50 (Kız: 0, Erkek: 0)');
      });
    }
  }

  private checkFinal() {
    if (this.gamePhase === 'hearts') {
      const total = this.collectedHearts.girl + this.collectedHearts.boy;
      if (total >= 50) {
        this.showFinalScene();
      }
    }
  }

  private showFinalScene() {
    // Final sahnesi
    this.cameras.main.fade(1000, 0, 0, 0);
    this.time.delayedCall(1000, () => {
      // Ekran karardıktan sonra kalp resmi ve oyun adı
      this.add.image(800, 600, 'heart').setScale(4).setDepth(1000);
      this.add.text(800, 900, 'Diş ve Aşk', {
        fontSize: '48px',
        color: '#fff',
        backgroundColor: '#000',
        padding: { x: 30, y: 15 },
        align: 'center'
      }).setOrigin(0.5).setDepth(1001);
    });
  }

  private showInfo(msg: string, duration: number = 0) {
    if (this.infoText) this.infoText.destroy();
    this.infoText = this.add.text(800, 80, msg, {
      fontSize: '28px',
      color: '#fff',
      backgroundColor: '#000',
      padding: { x: 20, y: 10 },
      align: 'center'
    }).setOrigin(0.5);
    if (duration > 0) {
      this.time.delayedCall(duration, () => {
        if (this.infoText) this.infoText.destroy();
        this.infoText = null;
      });
    }
  }
} 
