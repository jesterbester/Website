export default class Boot extends Phaser.State {
	
	preload(){
		 this.game.input.gamepad.start();
	}
	
	create(){
		this.game.state.start('preload');
	}
}