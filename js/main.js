export default class Main extends Phaser.State {
	
	create() {game.add.tileSprite(0, 0, 512, 512, 'background');
	game.physics.startSystem(Phaser.Physics.ARCADE);
	
	
	bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;

    bullets.createMultiple(50, 'Bullet');
    bullets.setAll('checkWorldBounds', true);
    bullets.setAll('outOfBoundsKill', true);
	//bullets.body.allowRotation = true;
	
	CB1 = game.add.sprite(100, 100, 'CB1');
	CB1.anchor.set(0.5, 0.5);
	//CB1.rotation = 0.5;
	game.physics.arcade.enable(CB1, Phaser.Physics.ARCADE);
	
	CB1.body.collideWorldBounds = true;
	

    CB1.body.allowRotation = true;
	
	CB2 = game.add.sprite(300, 300, 'CB2');
	CB2.anchor.set(0.5, 0.5);
	//CB1.rotation = 0.5;
	game.physics.arcade.enable(CB2, Phaser.Physics.ARCADE);
	
	CB2.body.collideWorldBounds = true;
	

    CB2.body.allowRotation = true;
	}
	update() {
	
	CB1.rotation = fixRotation(game.physics.arcade.angleToPointer(CB1));
	game.physics.arcade.collide(bullets, CB2, collisionHandler, null, this);
    if (game.input.activePointer.isDown && bulletnum > 0)
    {
        fire();
    }
}
function fixRotation(rotation) {  return rotation + 1.57079633;}
function collisionHandler (obj1, obj2) {

    game.stage.backgroundColor = '#992d2d';

}
function fire() {

    if (game.time.now > nextFire && bullets.countDead() > 0)
    {
        nextFire = game.time.now + fireRate;

        var bullet = bullets.getFirstDead();

        bullet.reset(CB1.x, CB1.y);
		bullet.rotation = CB1.rotation;
        game.physics.arcade.moveToPointer(bullet, 1500);
		bulletnum = bulletnum-1;
    }

}
function render() {

    game.debug.text('Active Bullets: ' + bulletnum + ' / ' + bullets.total, 32, 32);
    game.debug.spriteInfo(CB1, 32, 450);

}
	
	
}