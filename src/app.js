import './css/jquery-ui.css';
import './scss/styles.scss';
import * as PIXI from 'pixi.js';
import $ from 'jquery';
import 'jquery-ui-bundle';
import * as GSAP from 'gsap';
import PixiFps from 'pixi-fps';
const fpsCounter = new PixiFps();
// modules
import utils from './js/modules/myutils.js';
import hittest from './js/modules/hittest.js';
// images
import './images/circle.png';


let type = "WebGL"
if(!PIXI.utils.isWebGLSupported()){
  type = "canvas"
}

let app = new PIXI.Application({
    width: innerWidth,         // default: 800
    height: innerHeight,        // default: 600
    antialias: true,    // default: false
    transparent: false, // default: false
    resolution: 1       // default: 1
  }
);
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoResize = true;

let sprites = [],
    number = 5000;

$( 'body' ).append( app.view );

PIXI.loader
  .add( './images/circle.png' )
  .load( setup );

function setup(){
  create_particles( number );
  animate_random();
  $( '#num-particles-display' ).html(`${ number } particles`);
  // add FPS counter at the end
  app.stage.addChild(fpsCounter);
}

function create_particles( num ){
  for( var i = 0; i < num; i++ ){
    let sprite = new PIXI.Sprite( PIXI.loader.resources[ './images/circle.png' ].texture );
    sprite.position.set( utils.getRandomInt(0,innerWidth), utils.getRandomInt(0,innerHeight) );
    sprite.width = sprite.height = utils.getRandomInt( 0, 10 );
    app.stage.addChild( sprite );
    sprites.push( sprite );
  }
}

function kill_all(){
  dead = true;
  $('#num-particles-display').html('0 particles');
  for(let i = 0; i < sprites.length; i++){
    app.stage.removeChild(sprites[i]);
  }
}

function animate_random(){
  for(var i = 0; i<sprites.length; i++){
    if(sprites[i]){
      animate_random_particle(sprites[i]);
    }
  }
}

function animate_random_particle( p ){
  TweenLite.to(p, utils.random(5, 10), {
    x: utils.random( 0, innerWidth ),
    y: utils.random( 0, innerHeight ),
    scaleX: utils.random( .2, 2 ),
    scaleY: utils.random( .2, 2 ),
    ease: Power1.easeInOut,
    onComplete: animate_random_particle,
    onCompleteParams: [ p ]
  });
}


$( window ).resize( function(){
  app.renderer.resize(innerWidth, innerHeight);
});
