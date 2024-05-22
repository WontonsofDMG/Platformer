class End extends Phaser.Scene {
    constructor() {
        super("endScene");
    }
    init(data)
{
    this.score = data.score;
}
    preload() {
        this.load.image("ending", "assets/spaceStation_018.png");
    }

    create() {
        this.ending=this.add.image(400, 300, "ending").setScale(1.5);
        this.tweens.add({
            targets: this.ending,
            angle: 360, 
            duration: 40000, 
            repeat: -1, 
            yoyo: false 
        });


        this.sKey = this.input.keyboard.addKey('Y');
        this.winText = this.add.text(160, 130, `You managed to find your way back home!`, { fontSize: '32px', fill: '#fff' });
        
        this.scoreText = this.add.text(160, 160, `Coins collected: ${this.score}`, { fontSize: '32px', fill: '#fff' });
        this.restartText = this.add.text(160, 190, `Restart? (Y)`, { fontSize: '32px', fill: '#fff' });
        
    }


    update() {
        if(Phaser.Input.Keyboard.JustDown(this.sKey)) {
            this.scene.start("platformerScene");
        }
    }
}