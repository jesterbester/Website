
var game = new Phaser.Game(700, 700, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render});


const SPEED = 700;
const DEADZONE_LEFTJS = 0.25;
const DEADZONE_RIGHTJS = 0.1;

const DEBUG_MODE = false;

function preload () {
	//Images
	game.load.image('CB1', 'img/cowboy1.png');
	game.load.image('CB2', 'img/cowboy2.png');
	game.load.image('Bullet', 'img/bullet.png');
	game.load.image('background', 'img/bg1-tiled.png');
	game.load.image('rock', 'img/rock1.png');
	game.load.image('crate2x1', 'img/crate2x1.png');
	game.load.image('crate1x2', 'img/crate1x2.png');

	//Audio
	game.load.audio('foot', 'sfx/foot.wav');
	game.load.audio('foot2', 'sfx/foot2.mp3');
	game.load.audio('bulletspawn', 'sfx/bulletdrop.wav');
	game.load.audio('reload', 'sfx/reload.wav');
	game.load.audio('shoot', 'sfx/gunshot.mp3');
	game.load.audio('dead', 'sfx/wilhelm-scream.wav');
	game.load.audio('thunk', 'sfx/thunk.wav');
}

  var genloc = [{x1:29,x2:332,y1:29,y2:167}, {x1:463,x2:551,y1:29,y2:251}, {x1:293,x2:471,y1:254,y2:471}, 
	{x1:29,x2:313,y1:355,y2:505}, {x1:493,x2:671,y1:393,y2:671}, {x1:230,x2:313,y1:497,y2:671},
	{x1:463,x2:671,y1:213,y2:251}, {x1:29,x2:671,y1:668,y2:671}, {x1:29,x2:671,y1:29,y2:107},
	{x1:29,x2:671,y1:406,y2:471} ];
 // var fireRate = 1000;
  var nextFire = 0;
  var CB1bulletnum = 1;
  var CB2bulletnum = 1;

var bsx;
var bsy;
  var CB1;
  var CB2;
  var CB1bullets;
  var CB2bullets;
  var CB1bullet;
  var CB2bullet;
var ammos;
  var ammo;
	var CB1mag;
	var CB2mag;
  
  var foot;
  var bulletSpawn;
  var reload;
  var shoot;
  var dead;

  var cb1walking = false;
  var cb2walking = false;
  var timer;
  var ResetTimer;
  var bulgentime;
  
function create() {
  timer = game.time.create(false);
  timer.loop(200, walkTimer, this);
  timer.start();

  bulgentime = game.time.create(false);
  bulgentime.loop(5000, bulgenloc, this);
  bulgentime.start();

	cursors = game.input.keyboard.createCursorKeys();
	game.add.tileSprite(0, 0, 700, 700, 'background');
	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.input.gamepad.start();
	game.input.gamepad.pad1.deadZone = 0.01;
	game.input.gamepad.pad2.deadZone = 0.01;
	
	CB1mag = game.add.sprite(0, 0, 'Bullet');
	CB2mag = game.add.sprite(660, 0, 'Bullet');
	
	CB1WinText = game.add.text(380, 350, 'Cowboy Red wins!'); 
	CB1WinText.anchor.set(0.5); CB1WinText.visible = false;
	CB2WinText = game.add.text(380, 350, 'Cowboy Blue wins!'); 
	CB2WinText.anchor.set(0.5); CB2WinText.visible = false;
	
    
	//groups
	scenery = game.add.group();
	scenery.enableBody = true;
	game.physics.enable(scenery, Phaser.Physics.ARCADE);

	rock1 = game.add.sprite(200, 200, 'rock'); scenery.add(rock1);
	rock2 = game.add.sprite(400, 500, 'rock'); scenery.add(rock2);
	rock3 = game.add.sprite(500, 300, 'rock'); scenery.add(rock3);
	rock3 = game.add.sprite(520, 280, 'rock'); scenery.add(rock3);
	rock3 = game.add.sprite(540, 300, 'rock'); scenery.add(rock3);
	rock4a = game.add.sprite(100, 570, 'rock'); scenery.add(rock4a);
	rock4b = game.add.sprite(115, 560, 'rock'); scenery.add(rock4b);
	rock4c = game.add.sprite(137, 575, 'rock'); scenery.add(rock4c);
	//H = horizontal, V = vertical
	crateH1 = game.add.sprite(580, 120, 'crate2x1'); scenery.add(crateH1);
	crateH2 = game.add.sprite(120, 262, 'crate2x1'); scenery.add(crateH2);
	crateV1 = game.add.sprite(342, 500, 'crate1x2'); scenery.add(crateV1);
	crateV2 = game.add.sprite(370, 110, 'crate1x2'); scenery.add(crateV2);

	scenery.forEachExists(function(child){ child.body.immovable = true; }, this);

	ammos = game.add.group();
    ammos.enableBody = true;
	game.physics.arcade.enable(ammos, Phaser.Physics.ARCADE);

    ammos.setAll('checkWorldBounds', true);
    ammos.setAll('outOfBoundsKill', true);

	CB1bullets = game.add.group();
    CB1bullets.enableBody = true;
	game.physics.arcade.enable(CB1bullets, Phaser.Physics.ARCADE);


    CB1bullets.createMultiple(50, 'Bullet');
    CB1bullets.setAll('checkWorldBounds', true);
    CB1bullets.setAll('outOfBoundsKill', true);


	CB2bullets = game.add.group();
    CB2bullets.enableBody = true;
	game.physics.arcade.enable(CB2bullets, Phaser.Physics.ARCADE);


    CB2bullets.createMultiple(50, 'Bullet');
    CB2bullets.setAll('checkWorldBounds', true);
    CB2bullets.setAll('outOfBoundsKill', true);

	//================ Cowboy 1 =====================
	CB1 = game.add.sprite(100, 100, 'CB1');
	CB1.anchor.set(0.5, 0.5);

	game.physics.arcade.enable(CB1, Phaser.Physics.ARCADE);
	CB1Pad = game.input.gamepad.pad1;

	CB1.body.collideWorldBounds = true;

	CB1.body.setSize(58,58,3,3);
	CB1Pad.addCallbacks(this, { onConnect: CB1addButtons });

	//================ Cowboy 2 =====================
	CB2 = game.add.sprite(600, 600, 'CB2');
	CB2.anchor.set(0.5, 0.5);

	game.physics.arcade.enable(CB2, Phaser.Physics.ARCADE);
	CB2Pad = game.input.gamepad.pad2;

	CB2.body.collideWorldBounds = true;


    CB2.body.setSize(58,58,3,3);
	CB2Pad.addCallbacks(this, { onConnect: CB2addButtons });


  // Add sfx
  foot = game.add.audio('foot');
  foot2 = game.add.audio('foot2');
  bulletSpawn = game.add.audio('bulletspawn');
  reload = game.add.audio('reload');
  shoot = game.add.audio('shoot');
  dead = game.add.audio('dead');
  thunk = game.add.audio('thunk');
}

function update() {

	//set Cowboy speed to zero at start of update
    CB1.body.velocity.x = 0; CB1.body.velocity.y = 0;
    CB2.body.velocity.x = 0; CB2.body.velocity.y = 0;

	//temporary movement with keyboard
	// if (cursors.up.isDown) { CB1.body.velocity.y = -150; }
	// else if (cursors.down.isDown) {CB1.body.velocity.y = 150; }
    // else if (cursors.left.isDown) { CB1.body.velocity.x = -150; }
    // else if (cursors.right.isDown) { CB1.body.velocity.x = 150; }
    // else {}

	//Mouse
	//CB1.rotation = fixRotation(game.physics.arcade.angleToPointer(CB1));

//==================== Cowboy 1 Gamepad =======================
	CB1leftStickX = CB1Pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X);
	CB1leftStickY = CB1Pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y);

	if (Math.abs(CB1leftStickX) > DEADZONE_LEFTJS || Math.abs(CB1leftStickY) > DEADZONE_LEFTJS) {
        CB1.body.velocity.x = SPEED * CB1leftStickX;
        CB1.body.velocity.y = SPEED * CB1leftStickY;

        cb1walking = true;
    }else {
      cb1walking = false;
    }
    // if (Math.abs(CB1leftStickY) > DEADZONE) {
    //     CB1.body.velocity.y = SPEED * CB1leftStickY;
    // }

	CB1rightStickX = CB1Pad.axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X);
	CB1rightStickY = CB1Pad.axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_Y);

	if (Math.abs(CB1rightStickX) > DEADZONE_RIGHTJS
		|| Math.abs(CB1rightStickY) > DEADZONE_RIGHTJS){

		CB1.angle =
			fixRotation(Math.atan2(CB1rightStickY, CB1rightStickX)) * (180/Math.PI);
	}

//==================== Cowboy 2 Gamepad =======================
	CB2leftStickX = CB2Pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X);
	CB2leftStickY = CB2Pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y);
	if (Math.abs(CB2leftStickX) > DEADZONE_LEFTJS || Math.abs(CB2leftStickY) > DEADZONE_LEFTJS) {
        CB2.body.velocity.x = SPEED * CB2leftStickX;
        CB2.body.velocity.y = SPEED * CB2leftStickY;

        cb2walking = true;
    }else {
      cb2walking = false;
    }

	CB2rightStickX = CB2Pad.axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X);
	CB2rightStickY = CB2Pad.axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_Y);

	if (Math.abs(CB2rightStickX) > DEADZONE_RIGHTJS
	|| Math.abs(CB2rightStickY) > DEADZONE_RIGHTJS){
		CB2.angle =
			fixRotation(Math.atan2(CB2rightStickY, CB2rightStickX)) * (180/Math.PI);
	}
//======================= Collisions ==========================
ammos.forEach(function(ammo) { ammo.body.angularVelocity = 200;});
	game.physics.arcade.collide(CB1,scenery);
	game.physics.arcade.collide(CB2,scenery);
	game.physics.arcade.overlap(CB1bullets, scenery, function(CB1bullet){ CB1bullet.kill(), thunk.play(); });
	game.physics.arcade.overlap(CB2bullets, scenery, function(CB2bullet){ CB2bullet.kill(), thunk.play(); });
	game.physics.arcade.overlap(CB1bullets, CB2, function(CB1bulletAndCB2){CB1bulletAndCB2.kill(), dead.play(); });
	game.physics.arcade.overlap(CB2bullets, CB1, function(CB2bulletAndCB1){CB2bulletAndCB1.kill(), dead.play(); });
	if(CB2bulletnum == 0 ){
	game.physics.arcade.collide(ammos, CB2, function(CB2, ammo){ammo.kill();  reload.play(); CB2bulletnum++;  });
	CB2mag.visible = false;
	}
	if(CB1bulletnum == 0){
	game.physics.arcade.collide(ammos, CB1, function(CB1, ammo){ammo.kill();  reload.play(); CB1bulletnum++;  });
	CB1mag.visible = false;
	}
	if(CB1bulletnum == 1){
		CB1mag.visible = true;
	}
	if(CB2bulletnum == 1){
		CB2mag.visible = true;
	}
	//================== Reset ==================
	if(!CB1.alive || !CB2.alive){
		
		if(CB1.alive){ CB1WinText.visible = true; }
		else{ CB2WinText.visible = true; }
		CB1.alive = true; CB2.alive = true;
		game.time.events.add(3000, ResetGame, this);
	}
}

function ResetGame() {
	CB1.reset(100,100);
	CB2.reset(600,600);
	CB1bulletnum = 1;
	CB2bulletnum = 1;
	CB1WinText.visible = false;
	CB2WinText.visible = false;
}
	
function walkTimer(){
  if(cb1walking == true && CB1.alive){
    foot.play();
    foot.volume = 0.5;
  }
  if(cb2walking == true && CB2.alive){
    foot2.play();
    foot2.volume = 0.5;
  }
  
}

function CB1addButtons() {

    /*leftTriggerButton = CB1Pad.getButton(Phaser.Gamepad.XBOX360_LEFT_TRIGGER);

    leftTriggerButton.onDown.add(onLeftTrigger);
    leftTriggerButton.onUp.add(onLeftTrigger);
    leftTriggerButton.onFloat.add(onLeftTrigger);*/

    rightTriggerButton = CB1Pad.getButton(Phaser.Gamepad.XBOX360_RIGHT_TRIGGER);
    rightTriggerButton.onDown.add(CB1fire);
}

function CB2addButtons() {

    /*leftTriggerButton = CB1Pad.getButton(Phaser.Gamepad.XBOX360_LEFT_TRIGGER);

    leftTriggerButton.onDown.add(onLeftTrigger);
    leftTriggerButton.onUp.add(onLeftTrigger);
    leftTriggerButton.onFloat.add(onLeftTrigger);*/

    rightTriggerButton = CB2Pad.getButton(Phaser.Gamepad.XBOX360_RIGHT_TRIGGER);
    rightTriggerButton.onDown.add(CB2fire);
}

function fixRotation(rotation) {  return rotation + 1.57079633;}

function CB1fire() {
if(CB1bulletnum > 0 && CB1.alive)
{
    if ( CB1bullets.countDead() > 0 )
    {

        var CB1bullet = CB1bullets.getFirstDead();
		CB1bullet.reset(CB1.x, CB1.y);
		CB1bullet.anchor.set(0.5, 0.5);
		CB1bullet.rotation = CB1.rotation;
		CB1bullet.body.setSize(13, 13, 8, 5);
		CB1bullet.body.setCircle(9);
        game.physics.arcade.velocityFromRotation(CB1.rotation -1.57079633, 2000, CB1bullet.body.velocity);
		CB1bulletnum = CB1bulletnum-1;
		//bulgenloc();

    shoot.play();
    }
}
}

function CB2fire() {
if(CB2bulletnum > 0 && CB2.alive)
{
    if (CB2bullets.countDead() > 0)
    {

		//bulgenloc();
        var CB2bullet = CB2bullets.getFirstDead();
        CB2bullet.reset(CB2.x, CB2.y);
		CB2bullet.anchor.set(0.5, 0.5);
		CB2bullet.rotation = CB2.rotation;
		CB2bullet.body.setSize(13, 13, 8, 5);
		CB2bullet.body.setCircle(9);
        game.physics.arcade.velocityFromRotation(CB2.rotation-1.57079633, 2000, CB2bullet.body.velocity);
		CB2bulletnum = CB2bulletnum-1;

    shoot.play();
    }
}
}

function bulgenloc ()
{
	if(ammos.total > 0){
		ammo.kill();
	}
var zone=genloc[game.rnd.integerInRange(0, 9)];
  bsx=game.rnd.integerInRange(zone.x1, zone.x2);
  bsy=game.rnd.integerInRange(zone.y1, zone.y2);
	ammo = ammos.create(bsx, bsy, 'Bullet');
	ammo.body.setSize(13, 13, 8, 5);
	ammo.body.setCircle(9);
	ammo.anchor.setTo(0.5, 0.5);
	
	bulletSpawn.play();
}

function destroySprite (sprite) {

    sprite.destroy();
}

function render() {

	if(DEBUG_MODE) {

		game.debug.text('Active Bullets: ' + CB1bulletnum, 32, 32);
		game.debug.text('Active Bullets: ' + CB2bulletnum, 300, 32);
		game.debug.text('Bullet Spawn: ' + bsx + '/' + bsy, 32, 48);
		game.debug.text('Reset? ' + !CB2.alive, 32, 64);
		game.debug.spriteInfo(CB1, 32, 450);
		CB1bullets.forEachAlive(renderGroup, this);
		CB2bullets.forEachAlive(renderGroup, this);
		scenery.forEachAlive(renderGroup, this);
		ammos.forEachAlive(renderGroup, this);
		game.debug.body(CB1);
		game.debug.body(CB2);
	}
}

function renderGroup(member) {
	game.debug.body(member);
}