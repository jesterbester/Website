
var SpaceHipster = SpaceHipster || {};
 
SpaceHipster.menu = function(){};

SpaceHipster.menu.prototype = {
  preload: function() {
  	//assets we'll use in the loading screen
    this.load.image('sign', '../img/sign.png');
    
  },
  create: function() {
  	//loading screen will have a white background
    this.game.stage.backgroundColor = '#fff';
 
    this.game.add.image(game.world.centerX, game.world.centerY, 'sign').anchor.set(0.5);
    this.state.start('work');
  }
};