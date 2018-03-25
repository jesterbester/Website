export default class Preload extends Phaser.State {
	preload() {game.load.image('CB1', 'img/cowboy1.png');
		game.load.image('CB2', 'img/cowboy2.png');
	game.load.image('Bullet', 'img/bullet.png');
	game.load.image('background', 'img/bg1-tiled.png');
game.load.image('rock', 'img/rock1.png');}
create() {
	this.game.state.start('main');
}
}