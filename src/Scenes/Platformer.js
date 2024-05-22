class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
    }

    init() {
        // variables and settings
        this.ACCELERATION = 300;
        this.DRAG = 500;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 1500;
        this.JUMP_VELOCITY = -475;
        this.PARTICLE_VELOCITY = 70;
        this.SCALE = 3.0;
        this.score = 0;
    }

    preload()
    {
        this.load.image("background", "assets/backgroundEmpty.png");
        this.load.audio("ding", "assets/impactMetal_medium_003.ogg");
        this.load.audio("unlocked", "assets/footstep00.ogg");
        this.physics.world.drawDebug=false;

    }

    create() {
  
        this.map = this.add.tilemap("platformer-level-1", 18, 18, 45, 25);

    
        this.tileset = this.map.addTilesetImage("kenny_tilemap_packed", "tilemap_tiles");


        this.background = this.add.image(400, 300, "background").setScale(1.5);
        this.groundLayer = this.map.createLayer("Ground-n-Platforms", this.tileset, 0, 0);
        this.waterLayer = this.map.createLayer("water", this.tileset, 0, 0);


        this.groundLayer.setCollisionByProperty({
            collides: true
        });

        this.waterLayer.setCollisionByProperty({
            collides: true
        });


        this.coins = this.map.createFromObjects("Objects", {
            name: "coin",
            key: "tilemap_sheet",
            frame: 151
        });
        this.coins.forEach((coin) => {
            coin.anims.play('spin'); 
        });
        this.block = this.map.createFromObjects("Objects", {
            name: "blocker",
            key: "tilemap_sheet",
            frame: 28
        });
        this.keys = this.map.createFromObjects("Objects", {
            name: "key",
            key: "tilemap_sheet",
            frame: 27
        });
        this.flags = this.map.createFromObjects("Objects", {
            name: "flag",
            key: "tilemap_sheet",
            frame: 111
        });

        this.flags.forEach((flag) => {
            flag.anims.play('waveyflag'); 
        });

      
        this.physics.world.enable(this.coins, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.block, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.keys, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.flags, Phaser.Physics.Arcade.STATIC_BODY);

 
        this.coinGroup = this.add.group(this.coins);
        this.keyGroup = this.add.group(this.keys);
        this.blockGroup = this.add.group(this.block);
        this.flagGroup = this.add.group(this.flags);
    
        my.sprite.player = this.physics.add.sprite(30, 345, "platformer_characters", "tile_0000.png");
        my.sprite.player.setCollideWorldBounds(true);

    
        this.physics.add.collider(my.sprite.player, this.groundLayer);
        this.physics.add.collider(my.sprite.player, this.blockGroup);

         this.physics.add.overlap(my.sprite.player, this.coinGroup, (obj1, obj2) => {
            this.score+=1;
            this.sound.play("ding", {
                volume: .25   
            });
            obj2.destroy(); 
        });
        this.physics.add.overlap(my.sprite.player, this.flagGroup, (obj1, obj2) => {
            this.scene.start("endScene",{ score: this.score });
        });
        this.physics.add.collider(my.sprite.player, this.waterLayer, () => {
            
            my.sprite.player.setPosition(this.START_X, this.START_Y);
        });

        this.physics.add.overlap(my.sprite.player, this.keyGroup, (obj1, obj2) => {
            obj2.destroy(); 
            this.sound.play("unlocked", {
                volume: .25   
            });
            this.blockGroup.clear(true, true);
        });

        cursors = this.input.keyboard.createCursorKeys();

        this.rKey = this.input.keyboard.addKey('R');

        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);

      


        my.vfx.walking = this.add.particles(0, 0, "kenny-particles", {
            frame: ['dirt_01.png', 'dirt_02.png','dirt_03.png'],
           
            scale: {start: 0.003, end: 0.05},
            
            maxAliveParticles: 8,
            lifespan: 100,
           
            gravityY: -400,
            alpha: {start: 0.8, end: 0.1}, 
        });

        my.vfx.jumping = this.add.particles(0, 0, "kenny-particles", {
            frame: ['slash_01.png','slash_02.png'],
            
            scale: {start: 0.015, end: 0.1},
            
            maxAliveParticles: 5,
            lifespan: 100,
            
            gravityY: 800,
            alpha: {start: 0.8, end: 0.1}, 
        });

        my.vfx.walking.stop();
        my.vfx.jumping.stop();
        
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); 
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(this.SCALE);

    }

    update() {
        if(cursors.left.isDown) {
            my.sprite.player.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);
            
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);

            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

           

            if (my.sprite.player.body.blocked.down) {

                my.vfx.walking.start();
            }

        } else if(cursors.right.isDown) {
            my.sprite.player.setAccelerationX(this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);
            
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);

            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

            my.vfx.jumping.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);

            my.vfx.jumping.setParticleSpeed(0, this.PARTICLE_VELOCITY);

           

            if (my.sprite.player.body.blocked.down) {

                my.vfx.walking.start();
            }
        } else {
            
            my.sprite.player.setAccelerationX(0);
            my.sprite.player.setDragX(this.DRAG);
            my.sprite.player.anims.play('idle');
            
            my.vfx.walking.stop();
        }

       if(!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play('jump');
        }
        if(my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
                my.vfx.jumping.start();
        }
        else
        {
            my.vfx.jumping.stop();

        }

        if(Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.scene.restart();
        }
    document.getElementById('description').innerHTML = '<h2>Aliens bad day!</h2><br> Controls: Arrow keys // D: Debug // R: Restart'

    }
}