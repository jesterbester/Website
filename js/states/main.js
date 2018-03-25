var SpaceHipster = SpaceHipster || {};
 
var game = new Phaser.Game(700, 700, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render, setDeadZones: setDeadZones });
 
SpaceHipster.game.state.add('mainmenu', SpaceHipster.menu);
//uncomment these as we create them through the tutorial
//SpaceHipster.game.state.add('Preload', SpaceHipster.Preload);
//SpaceHipster.game.state.add('MainMenu', SpaceHipster.MainMenu);
SpaceHipster.game.state.add('work', SpaceHipster.work);
 
SpaceHipster.game.state.start('mainmenu');