// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container
const app = new PIXI.Application({
    width:1024,
    height:512,
    transparent:false,
    antialias:true,
});
PIXI.settings.ANISOTROPIC_LEVEL = 4;


//Global variables
var stepChance = .7;
const isoSlope = .45;
const tileRad = 64; // radius of tiles
const maxPop = 25;
const minPop = 10;

const edgeTiles = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,32,48,64,80,96,112,128,144,160,176,192,208,224,240,31,47,63,79,95,111,127,143,159,175,191,207,223,239,255,241,242,243,244,245,246,247,248,249,250,251,252,253,254];

var movingCharacters = [];

var synth = window.speechSynthesis;
var voice = new SpeechSynthesisUtterance();
var voices;

var colorPalette = {// for buildings. Shouldn't be global
    buildings:{
        primary:[
            {pc:0x9A868E,lc:0xA8949D,dc:0x867E82},
        ],
        h1:[
            {pc:0x423E37},
            {pc:0x503543}
        ],
        h2:[
            {pc:0x9A1860,dc:0x82114F},
            {pc:0x375EBF,dc:0x3253A4}
        ]
    },
    trees:{
        summer:[{pc:0x71A6AE,dc:0x3253A4},{pc:0x5C82C1,dc:0x3253A4},{pc:0xDD8B88,dc:0x3253A4}],
        spring:[{pc:0x98C48F,dc:0x3253A4},{pc:0x98C48F,dc:0x3253A4},{pc:0xEFD2DF,dc:0x3253A4},{pc:0xFBF4F7,dc:0x3253A4}],
        fall:[{pc:0xDD8B88,dc:0x3253A4},{pc:0xDDA188,dc:0x3253A4},{pc:0xD3B973,dc:0x3253A4}]
    },
    primary:[
        //{pc:0x4F4F7D,dc:0x2F2F4B,lc:0x6F6FA5},
        {pc:0xB6BBC2,dc:0xA3A7AE,lc:0xCACFD6},
        {pc:0x6C6C82,dc:0x606074,lc:0x7F7F98},
        {pc:0xC45F5F,dc:0xAB3F3F,lc:0xC25B5B},
        {pc:0xA5A194,dc:0x989588,lc:0xB2AEA2}
    ],//dark color 0x181826
    accent:[
        {pc:0x9494A4,dc:0x75758A,lc:0x9494A4}
    ]
};




var hud = new PIXI.Container();
var scene = new PIXI.Container();
var chunkContainer = new PIXI.Container()
scene.sortableChildren = true;
chunkContainer.sortableChildren = true;

var dialogueBox = new PIXI.Graphics();

//Temporary text object
var gameText;
var dialogueText;
var speakerText;

var chunks = [];
var savedChunk = [0,0]

//Player variable
var player;

app.renderer.backgroundColor = 0xFFFDED;
// The application will create a canvas element for you that you
// can then insert into the DOM
document.body.appendChild(app.view);

colors = [[0xBDD0C4,0xA0BBAA], [0x9AB7D3, 0x83A7C9], [0xF5D2D3, 0xEEB4B6], [0xF7E1D3, 0xF3D3BE], [0xDFCCF1, 0xD7BFED]];
shadows = {
    pc:0x000000,
    dc:0x000000,
    lc:0x000000
}

var dialogueOptions = ['smalltalk','favor'];

function renderFace(paths,location) { //for dialogue
    //'base'+paths.base+'.png';
    //paths.
}


function setup(argument) {
    document.getElementById('main').innerHTML = '';

    app.stage.addChild(scene);
    app.stage.addChild(hud);
    scene.addChild(chunkContainer);

    //Set the game state
    state = play;

    //Start the game loop 
    app.ticker.add(delta => gameLoop(delta));

    scene.x = app.renderer.width/2;
    scene.y = app.renderer.height/2;

    for (var x = -1; x < 2; x++) {
        for (var y = -1; y < 2; y++) {
            let chunkY = isoSlope*tileRad*16*x+isoSlope*tileRad*16*y;
            let chunkX = tileRad*16*x-tileRad*16*y;
            chunks.push(new Chunk([savedChunk[0]+x,savedChunk[1]+y],chunkX,chunkY,chunks.length-1));
        }
    }



    player = new Player(savedChunk);

    

    //Keyboard controls
    var upArrow = keyboard('ArrowUp');
    upArrow.press = () => {
        player.vy -= player.speed*(1-isoSlope);
    };
    upArrow.release = () => {
      player.vy += player.speed*(1-isoSlope);
    };
    var dwnArrow = keyboard('ArrowDown');
    dwnArrow.press = () => {
        player.vy += player.speed*(1-isoSlope);
    };
    dwnArrow.release = () => {
      player.vy -= player.speed*(1-isoSlope);
    };
    var lftArrow = keyboard('ArrowLeft');
    lftArrow.press = () => {
        player.vx -= player.speed;
    };
    lftArrow.release = () => {
      player.vx += player.speed;
    };
    var rghtArrow = keyboard('ArrowRight');
    rghtArrow.press = () => {
        player.vx += player.speed;
    };
    rghtArrow.release = () => {
      player.vx -= player.speed;
    };

    var actionKey = keyboard('e');
    actionKey.press = () => {
        if (state == play && chunks[player.chunkIndex].city) {
            for (var i = 0; i < chunks[player.chunkIndex].population; i++) {
                if (Math.abs(player.graphic.x - chunks[player.chunkIndex].inhabitants[i].graphic.x) < 30 && Math.abs(player.graphic.y - chunks[player.chunkIndex].inhabitants[i].graphic.y) < 30) {
                    state = talking;
                    dialogueBox.visible = true;
                    speakerText.text = chunks[player.chunkIndex].inhabitants[i].name+':';
                    chunks[player.chunkIndex].inhabitants[i].speak();
                    player.speakingTo = i;
                    break
                }
            }
        } else if (state == talking && chunks[player.chunkIndex].inhabitants[player.speakingTo].speak != chunks[player.chunkIndex].inhabitants[player.speakingTo].talk) {
            synth.cancel();
            chunks[player.chunkIndex].inhabitants[player.speakingTo].speak();
        }
    };

    var escKey = keyboard('Escape');
    escKey.press = () => {
        if (state == talking) {
            state = play;
            dialogueBox.visible = false;
            dialogueText.text = '';
            speakerText.text = '';
            synth.cancel();
            chunks[player.chunkIndex].inhabitants[player.speakingTo].speak = chunks[player.chunkIndex].inhabitants[player.speakingTo].introduction;
            chunks[player.chunkIndex].inhabitants[player.speakingTo].memory.lastInteraction = new Date();

            player.speakingTo = undefined;
        } 
    };

    var oneKey = keyboard('1');
    oneKey.press = () => {
        if (state == talking && chunks[player.chunkIndex].inhabitants[player.speakingTo].speak == chunks[player.chunkIndex].inhabitants[player.speakingTo].talk) {
            synth.cancel();
            chunks[player.chunkIndex].inhabitants[player.speakingTo].speak(1);
        }
    };
    var twoKey = keyboard('2');
    twoKey.press = () => {
        if (state == talking && chunks[player.chunkIndex].inhabitants[player.speakingTo].speak == chunks[player.chunkIndex].inhabitants[player.speakingTo].talk) {
            synth.cancel();
            chunks[player.chunkIndex].inhabitants[player.speakingTo].speak(2);
        }
    };
    var threeKey = keyboard('3');
    threeKey.press = () => {
        if (state == talking && chunks[player.chunkIndex].inhabitants[player.speakingTo].speak == chunks[player.chunkIndex].inhabitants[player.speakingTo].talk) {
            synth.cancel();
            chunks[player.chunkIndex].inhabitants[player.speakingTo].speak(3);
        }
    };
    var fourKey = keyboard('4');
    fourKey.press = () => {
        if (state == talking && chunks[player.chunkIndex].inhabitants[player.speakingTo].speak == chunks[player.chunkIndex].inhabitants[player.speakingTo].talk) {
            synth.cancel();
            chunks[player.chunkIndex].inhabitants[player.speakingTo].speak(4);
        }
    };
    

    //add HUD elements
    dialogueBox.beginFill(0xFFFDED,.7);
    dialogueBox.drawRect(app.renderer.width/5,app.renderer.height*.8,app.renderer.width*.6,app.renderer.width/8);
    dialogueBox.endFill();
    dialogueBox.cacheAsBitmap = true;
    dialogueBox.visible = false;
    //dialogueBox.zIndex = 0;

    gameText = new PIXI.Text(player.tile,{fontFamily: 'Arial', fontWeight: 'bold', fontSize: 16, fill: 0x181826, align: 'left'});
    gameText.x = 64;
    gameText.y = 448;
    //gameText.zIndex = 1;

    speakerText = new PIXI.Text(player.tile,{fontFamily: 'Arial', fontWeight: 'bold', fontSize: 15, fill: 0x181826, align: 'left'});
    speakerText.text = '';
    speakerText.x = app.renderer.width*.21;
    speakerText.y = app.renderer.height*.81;
    //speakerText.zIndex = 1;

    dialogueText = new PIXI.Text(player.tile,{fontFamily: 'Arial', fontWeight: 'normal', fontSize: 14, fill: 0x181826, align: 'left', wordWrapWidth: app.renderer.width*.58, wordWrap: true});
    dialogueText.text = '';
    dialogueText.x = app.renderer.width*.21;
    dialogueText.y = app.renderer.height*.85;
    //dialogueText.zIndex = 1;

    hud.addChild(dialogueBox);
    hud.addChild(gameText);
    hud.addChild(speakerText);
    hud.addChild(dialogueText);
}

class Player {
    constructor(chunk=[0,0]) {
        this.name = 'Drew';
        this.graphic = new PIXI.Graphics();
        this.graphic.zIndex = 1;
        this.width = 10;
        this.height = 10;
        this.vx = 0;
        this.vy = 0;
        this.speed = 4;
        this.tile = Math.floor((this.graphic.y+this.graphic.x*isoSlope)/(tileRad*isoSlope*2))*16 + Math.floor((this.graphic.y-this.graphic.x*isoSlope)/(tileRad*isoSlope*2)); // player location. Not sure why .8 is the correct number, but it worked
        this.chunk = chunk;
        this.chunkIndex = 4;
        this.draw();
    }
    draw(posX=0,posY=0) {
        this.graphic.moveTo(0,0);
        this.graphic.beginFill(0x2D6EAE);
        this.graphic.drawRect(-this.width/2,-this.height,this.width,this.height);
        this.graphic.beginFill(0x0a2e20);
        this.graphic.drawCircle(0,-this.width*1.5,this.width/2);
        this.graphic.endFill();
        this.graphic.x = posX;
        this.graphic.y = posY;
        this.graphic.zIndex = 1;
        chunks[this.chunkIndex].overlay.addChild(this.graphic);
    }
    update(delta) {
        let moveX = this.vx*delta;
        let moveY = this.vy*delta;

        for (var i = 0; i < chunks.length; i++) {
            chunks[i].move(moveX,moveY)

        }
        this.graphic.x += moveX;
        this.graphic.y += moveY;

        //this.graphic.zIndex = -chunks[this.chunkIndex].graphic.y+this.graphic.height;
        this.graphic.zIndex = this.graphic.y;

        //determine current chunk
        let prevChunk = this.chunk;
        this.chunk = [this.chunk[0]+Math.floor((-chunks[this.chunkIndex].graphic.y-chunks[this.chunkIndex].graphic.x*isoSlope)/(tileRad*isoSlope*32)), this.chunk[1]+Math.floor((-chunks[this.chunkIndex].graphic.y+chunks[this.chunkIndex].graphic.x*isoSlope)/(tileRad*isoSlope*32))];

        
        gameText.text = this.chunk+' '+this.tile;

        //if current chunk has changed
        if ((this.chunk[0] != prevChunk[0] || this.chunk[1] != prevChunk[1])) {
            chunks[this.chunkIndex].overlay.removeChild(this.graphic);

            let offsetX = chunks[this.chunkIndex].graphic.x;
            let offsetY = chunks[this.chunkIndex].graphic.y;

            for (var i = 0; i < chunks.length; i++) {
                if (this.chunk[0] == chunks[i].id[0] && this.chunk[1] == chunks[i].id[1]) {
                    this.chunkIndex = i;
                    console.log(chunks[this.chunkIndex].city);
                    chunks[this.chunkIndex].overlay.addChild(this.graphic);
                    this.graphic.y = -chunks[this.chunkIndex].graphic.y;
                    this.graphic.x = -chunks[this.chunkIndex].graphic.x;
                } else if (Math.abs(this.chunk[0]-chunks[i].id[0]) > 1 || Math.abs(this.chunk[1]-chunks[i].id[1]) > 1) {
                    
                    let cX = this.chunk[0]-chunks[i].id[0]+prevChunk[0];
                    let cY = this.chunk[1]-chunks[i].id[1]+prevChunk[1];;

                    let chunkY = offsetY+isoSlope*tileRad*16*(cX-prevChunk[0])+isoSlope*tileRad*16*(cY-prevChunk[1]);
                    let chunkX = offsetX+tileRad*16*(cX-prevChunk[0])-tileRad*16*(cY-prevChunk[1]);

                    chunks[i].rebuild([cX,cY],chunkX,chunkY,i);
                }  
            }
        }

        //assign correct tile #
        this.tile = Math.floor((-chunks[this.chunkIndex].graphic.y-chunks[this.chunkIndex].graphic.x*isoSlope)/(tileRad*isoSlope*2))*16 + Math.floor((-chunks[this.chunkIndex].graphic.y+chunks[this.chunkIndex].graphic.x*isoSlope)/(tileRad*isoSlope*2));

        if (chunks[this.chunkIndex].tiles[this.tile].occupied) {
            for (var i = 0; i < chunks.length; i++) {
                chunks[i].move(-moveX,-moveY);
            }
            this.graphic.x -= moveX;
            this.graphic.y -= moveY;
        }
    }
}

class Chunk {
    constructor(id=[0,0],posX=0,posY=0,index) {
        this.graphic = new PIXI.Graphics();
        this.overlay = new PIXI.Container();
        this.overlay.sortableChildren = true;

        this.rebuild(id,posX,posY,index);        

        chunkContainer.addChild(this.graphic);
        chunkContainer.addChild(this.overlay);
    }
    rebuild(id=[0,0],posX=0,posY=0,index) {
        this.id = id;
        this.index = index;

        this.overlay.zIndex = id[0]+id[1]+1;
        this.graphic.zIndex = id[0]+id[1];

        if (Math.random() > .6) {
            this.city = true;
            this.inhabitants = [];
            this.homeTiles = [];
        } else {
            this.city = false;
        }

        //!  reset this.tiles variable before adding new tiles
        this.tiles = [];
        this.draw(posX,posY);
    }
    draw(posX,posY) {
        let tileY = 0;
        let tileX = 0;
        let tileId = 0;

        this.graphic.clear();
        this.overlay.removeChildren();

        // draw ground tiles
        for (var n = 0; n < 16; n++) {
            let x = tileX + n*tileRad;
            let y = tileY + n*(tileRad*isoSlope);
            for (var i = 0; i < 16; i++) {
                let tile = new Tile(tileId,x,y,this.index);
                tile.draw(x,y,this.graphic,this.overlay);
                this.tiles.push(tile)

                y += tileRad*isoSlope;
                x -= tileRad;
                tileId += 1;            
            }
        }

        // draw buildings
        for (var i = 0; i < this.tiles.length; i++) {
            if (this.city && !(i in edgeTiles) && Math.random() > .95) { // skip edge tiles
                this.tiles[i].isHome = true;
                this.tiles[i].occupied = true;
                let home = new PIXI.Graphics(); //do we want this stored in the tile, or in a seperate house array?
                drawHouse(home,this.tiles[i].x,this.tiles[i].y+isoSlope*2*tileRad);
                this.overlay.addChild(home);
                this.tiles[i].contents.push(home);
                this.homeTiles.push(i);
            }
        }

        // draw people
        this.population = 0;
        if (this.city) {
            let occupied = [];
            for (let i = 0; i < this.homeTiles.length; i++) {
                for (let n = 0; n < Math.floor(Math.random()*4+2); n++) {
                    this.population++;
                    let x = Math.floor(Math.random() * 16);
                    let y = Math.floor(Math.random() * 16);
                    while(this.tiles[x*16+y].occupied || x*16+y in occupied) {
                        x = Math.floor(Math.random() * 16);
                        y = Math.floor(Math.random() * 16);
                    }
                    occupied.push([x*16+y]);

                    let locX = x * tileRad - tileRad * y;
                    let locY = x * (tileRad * isoSlope) + tileRad*isoSlope*y
                    let citizen = new NPC(locX,locY,this.overlay);
                    citizen.home = i;
                    citizen.tile = x*16+y;
                    //citizen.name +=' of house  '+i;
                    this.inhabitants.push(citizen);
                }
            }
        }

        this.graphic.x = posX;
        this.graphic.y = posY;
        this.overlay.x = posX;
        this.overlay.y = posY;
    }
    move(vx,vy) {
        this.graphic.x -= vx;
        this.graphic.y -= vy;
        this.overlay.x -= vx;
        this.overlay.y -= vy;
    }
    update() {

    }
}

class Tile {
    constructor(id,posX,posY,index) {
        this.id = id;
        this.parent = index;
        this.occupied = false;
        this.x = posX;
        this.y = posY;
        this.center = (posX,posY-tileRad*isoSlope);
        this.home = false;
        this.contents = [];
    }
    draw(tileX,tileY,drawer,overlay) {
        let tileCol = 0xCBDBAE;//0xC5D3AB//!move this outside of here. No need to instantiate so many times
        //let drawer = chunks[this.parent].graphic;
        drawer.beginFill(tileCol);
        drawer.drawPolygon([tileX,tileY,tileX-tileRad,tileY+tileRad*isoSlope,tileX,tileY+tileRad*2*isoSlope,tileX+tileRad,tileY+tileRad*isoSlope]);
        drawer.endFill();
        if (Math.random()>0.9 && this.id-1) {
                //Draw flowers
                for (var x = 0; x < Math.random()*6+4; x++) {
                    drawer.beginFill(0xFFFFFF);
                    let posY = Math.random()*25+10;
                    let posX = Math.random()*60-30;
                    let width = 4;
                    let position = 12;
                    drawer.drawPolygon([
                        tileX+posX,tileY+posY,
                        tileX+posX-width,tileY+posY+width*isoSlope,
                        tileX+posX,tileY+posY+width*2*isoSlope,
                        tileX+posX+width,tileY+posY+width*isoSlope,
                        ]);
                    drawer.endFill();
                }

        } else if (Math.random()>0.85) { //draw buildings
            drawTree(tileX, tileY, overlay, random_item(colorPalette.trees.summer));

        }        
    }
}


class NPC {
    constructor(posX,posY,container,sex=Math.floor(Math.random()+.5)) {
        this.graphic = new PIXI.Graphics();
        this.sex = sex;
        this.name = random_item(names[this.sex.toString()]);
        this.width = 10;
        this.height = 10;
        this.draw(posX,posY,container);
        this.voice = {pitch:Math.random()*2, lang:'en', voice:undefined, speed:Math.random()+.5};
        this.relations = {};
        this.home;
        this.memory = {lastInteraction:undefined,familiarity:0,favor:0,expectations:0,deeds:{},outstandingQuest:undefined};
        this.speak = this.introduction;

        if (Math.random()>.5) {
            this.hasQuest = true;
        } else {
            this.hasQuest = false;
        }
        //high familiarity, low favor means they actively dislike you, and have little chance to change their mind. low familiarity, low favor means they think you're crap, but you can still win them over.
        //expectations determines how much they'll weight good and bad things you do. Low expectations, and you'll have to do a lot more good. High expectations, and you can get away with a little bad. Might be a little redundant. Test without.
    }
    draw(posX=0,posY=0,container) {
        this.graphic.moveTo(0,0);
        this.graphic.beginFill(randomHex());//
        this.graphic.drawRect(-this.width/2,-this.height,this.width,this.height);
        this.graphic.beginFill(0x0a2e20);
        this.graphic.drawCircle(0,-this.width*1.5,this.width/2);
        this.graphic.endFill();
        this.graphic.x = posX;
        this.graphic.y = posY+isoSlope*tileRad;
        this.graphic.zIndex = posY+isoSlope*tileRad;
        container.addChild(this.graphic);
    }
    moveTo(chunkIndex) {
        //eventually set speed for each species
        //move 20px any direction;
        let speed = 40;
        let moveCoeff = Math.random();
        this.goalX = this.graphic.x+moveCoeff*40*posNeg(); //chunks[chunkIndex].tiles[goal].x;
        this.goalY = this.graphic.y+(moveCoeff-1)*40*posNeg(); //chunks[chunkIndex].tiles[goal].y + isoSlope*tileRad;
        this.vx = (this.goalX-this.graphic.x)/15;
        this.vy = (this.goalY - this.graphic.y)/15;
    }
    update(delta,index) {
        let distX = Math.abs(this.graphic.x - this.goalX);
        let distY = Math.abs(this.graphic.y - this.goalY);
        if (distX < Math.abs(this.vx*delta)) {
            this.graphic.x = this.goalX;
        } else {
            this.graphic.x += this.vx*delta;
        }
        if (distY < Math.abs(this.vy * delta)) {
            this.graphic.y = this.goalY
        } else {
            this.graphic.y += this.vy*delta;
        }
        if (this.graphic.y == this.goalY && this.graphic.x == this.goalX) {
            movingCharacters.splice(index,1);
            this.goalX = undefined;
            this.goalY = undefined;
            this.vx = undefined;
            this.vy = undefined;
        }
        this.graphic.zIndex = this.graphic.y;
        
        /*hop
        if (distX+distY > 20) {
            this.graphic.y -= 2*delta;
        } else {
            this.graphic.y += 2*delta;
        }*/
    }
    conversation(dialogue='') {

        dialogue = dialogue.replace(/%NAME%/g,this.name);
        dialogue = dialogue.replace(/%PLAYERNAME%/g,player.name);

        dialogueText.text = dialogue;

        voice.text = dialogue;
        voice.pitch = this.voice.pitch;
        voice.rate = this.voice.speed;
        //voice.lang = 'en-US';//this.voice.lang;
        voice.voice = synth.getVoices()[this.voice.voice];
        synth.speak(voice);
    }
    introduction() {
        if (!this.voice.voice) {
            this.voice.voice = Math.floor(Math.random()*window.speechSynthesis.getVoices().length);
        }
        let now = this.memory.lastInteraction;
        let dialogue;
        /*
        FLOW
        if 
            new - introduce "Hi I'm..."
        else if 
            new news good/bad - "hey I heard x happened. That's good/bad to hear"
        else if
            unfullfilled desire/request - "Any news on the x I asked you about"
        else
            generic remark based on relationship score

        if 
            hasQuest - add comment of need to set up for 
        */
        if (this.memory.familiarity == 0) {
            dialogue = random_item(conversation.greetings);
            this.memory.familiarity += .05;
        } else if (now.setTime(now.getTime()+6000) > new Date()){
            dialogue = random_item(conversation.recent);
        } else {
            dialogue = random_item(conversation.followup);
            if (this.familiarity < 1) {
                this.familiarity += .05;
            }
        }
        this.conversation(dialogue);
        this.speak = this.listen;
    }
    talk(option) {
        let choice = dialogueOptions[option-1]
        dialogue = random_item(responses[choice][Math.round(this.memory.familiarity).toString()]);
        if (choice == 'smalltalk') {
            this.memory.familiarity += .05;
        }
        speakerText.text = this.name+':';
        this.speak = this.listen;

        this.conversation(dialogue);
    }
    listen() {
        let i = 1;
        let dialogue = '';

        dialogue += `${i}. Small talk\n`;
        i++;

        dialogue += `${i}. Ask favor\n`;
        i++;

        if (this.memory.outstandingQuest) {
            dialogue += `${i}. ${this.memory.outstandingQuest.title}\n`;
            i++;
        } else if (this.hasQuest) {
            dialogue += `${i}. Offer to help\n`;//`${i}. ${random_item(responseOptions.quest)}?\n`;
            i++;
        }

        if (Math.random()<.01) {
            dialogue += `${i}. ${random_item(responseOptions.bonus)}?\n`;
            i++;
        }
        speakerText.text = player.name+':';
        dialogueText.text = dialogue;
        this.speak = this.talk;
    }
}



//Functions
//older buildings have smaller windows //no because that means you have to use years
//Building variables
function drawHouse(drawer,posX,posY) {
    let cp = random_item(colorPalette.buildings.primary);
    let h1 = random_item(colorPalette.buildings.h1);
    let h2 = random_item(colorPalette.buildings.h2);
    
    let size = tileRad * .8;

    //draw building shape
    drawCube(drawer,tileRad,size,size,cp);
    
    //draw roop accent
    drawer.beginFill(h2.pc);
    drawer.drawPolygon(topPoints(tileRad+4,size-8));
    drawer.beginFill(h2.dc);
    
    if (Math.random()>.5) {
        var xOffset = 10; 
    } else {
        var xOffset = -10;
    }
    
    let shadowPoints = topPoints(tileRad+10,size-20)
    for (var i = 0; i < 8; i+=2) {
        shadowPoints[i]+=xOffset;
    }
    drawer.drawPolygon(shadowPoints);


    //draw rooftop lattice
    drawer.beginFill(h1.pc);
    let latticePoints = topPoints(tileRad+35,size-20);
    drawer.lineStyle(3,h1.pc,1);
    for (var i = 0; i < 8; i+=2) {
        latticePoints[i]+=xOffset;
        drawer.drawPolygon(
            [latticePoints[i]*.95,latticePoints[i+1],latticePoints[i]*.95,latticePoints[i+1]+25]
        );
    }
    drawer.lineStyle(0,h1.pc,0);
    drawer.drawPolygon(latticePoints);

    //draw door & window
    let winWidth = size/4;
    let winHeight = size/Math.floor((Math.random() * 2+2));

    let doorLeft = false;

    if (Math.random()>.5) {
        var door = leftPoints(tileRad/2,size/3,-size/3,-(size/3*isoSlope));
        var windowPoints = rightPoints(winWidth,winHeight,size/winWidth,-(size*isoSlope)-size/(15-winWidth));
        doorLeft = true;
    } else {
        var door = rightPoints(tileRad/2,size/3,size/3,-(size/3*isoSlope));
        var windowPoints = leftPoints(winWidth,winHeight,-size/winWidth,-(size*isoSlope)-size/(15-winWidth));
    }

    //Windows & decorations
    if (Math.random()>.5) {
        for (let i = 0; i < 4; i++) {
            beams = rightPoints(size/8,size/9,+size/10+i*size/4.5,-size-i*size/4.5*isoSlope);
            drawer.drawPolygon(beams);
        }
    } 
    if (Math.random()>.5) {
            for (let i = 0; i < 4; i++) {//square decorations
                let beams = leftPoints(size/8,size/9,-size/10-i*size/4.5,-size-i*size/4.5*isoSlope);
                drawer.drawPolygon(beams);
            }
    }
    if(Math.random()>.5) {
        let doorWin = rightPoints(size/4,size/8,size*.75,-size*.55-size*.75*isoSlope);
        drawer.drawPolygon(doorWin);
        doorWin = rightPoints(size/4,size/8,size*.25-size/8,-size*.55-size*.25*isoSlope);
        drawer.drawPolygon(doorWin);
    } else if (doorLeft && Math.random()>.4) {
        let win = rightPoints(size/3,size/3,size*.33,-size*.35-size*.33*isoSlope);
        drawer.drawPolygon(win);
    }
    if(Math.random()>.5) {
        let doorWin = leftPoints(size/4,size/8,-size*.75,-size*.55-size*.75*isoSlope);
        drawer.drawPolygon(doorWin);
        doorWin = leftPoints(size/4,size/8,-size*.25+size/8,-size*.55-size*.25*isoSlope);
        drawer.drawPolygon(doorWin);
    } else if (!doorLeft && Math.random()>.4) {
        let win = leftPoints(size/3,size/3,-size*.33,-size*.35-size*.33*isoSlope);
        drawer.drawPolygon(win);
    }


    drawer.drawPolygon(door);
    //drawer.drawPolygon(windowPoints);

    //draw decorations

    drawer.endFill();

    drawer.x = posX;
    drawer.y = posY-5;
    drawer.zIndex = posY-5-size*isoSlope;
}

function drawTree(posX,posY,drawer,cp) {
    //let drawer = new PIXI.Graphics()
    var rad = tileRad/2;
    var size = Math.random()+1; //1 is tiniest, 2 is biggest
    var partHeight = size*rad;
    const lineWidth = 2;

    let treeGen = new PIXI.Graphics();
    //treeGen.cacheAsBitmap = true;
    treeGen.zIndex = posY;

    treeGen.clear();

    treeGen.beginFill(cp.pc);
    treeGen.drawEllipse(posX,posY-partHeight*.85,partHeight/3,partHeight/2);

    treeGen.beginFill(cp.dc);
    treeGen.drawRect(posX-1,posY-partHeight,lineWidth*size,partHeight);
    for (var i = 0; i < 3; i++) {
        let points = [
            posX,posY-partHeight*.5-i*5*size,
            posX-partHeight/5,posY-partHeight*.6-i*5*size,
            posX-partHeight/5,posY-partHeight*.6-i*5*size-lineWidth*size,
            posX,posY-partHeight*.5-i*5*size-lineWidth*size
        ]; 
        treeGen.drawPolygon(points);
        points = [
            posX,posY-partHeight*.5-i*5*size,
            posX+partHeight/5,posY-partHeight*.6-i*5*size,
            posX+partHeight/5,posY-partHeight*.6-i*5*size-lineWidth*size,
            posX,posY-partHeight*.5-i*5*size-lineWidth*size
        ]; 
        treeGen.drawPolygon(points);
    }

    treeGen.endFill();

    drawer.addChild(treeGen);
    //container.addChild(drawer);
}

function randomEllipsePoint(x,y,xRad,yRad,normalize=false,minXRad=0,minYRad=0) {
    // normalize true: even distribution, false: clustered
    // minRad 0: any point within the circle, rad: only around the edge
    let xRadius = Math.random()*(xRad-minXRad)+minXRad;
    let yRadius = Math.random()*(yRad-minYRad)+minYRad;
    let angle = Math.random()*Math.PI*2; 
    
    let posX = Math.cos(angle);
    let posY = Math.sin(angle);

    if (normalize) {
        posX *= Math.sqrt(xRadius);
        posY *= Math.sqrt(yRadius);
    } else {
        posX *= xRadius + x;
        posY *= yRadius + y;
    }
    
    return [posX,posY]; 
}

function leftPoints(height,depth,x=0,y=0,slope=isoSlope) {
    let points = [x,y,
    -depth+x,-depth*slope+y,
    -depth+x,-height-depth*slope+y,
    x,-height+y];
    return points
}

function rightPoints(height,width,x=0,y=0,slope=isoSlope) {
    let points = [x,y,
    width+x,-width*slope+y,
    width+x,-height-width*slope+y,
    x,-height+y];
    return points
}

function topPoints(height,width,depth=width,slope=isoSlope) {
    let points = [0,-height,
    width,-height-width*slope,
    width-depth,-height-(depth+width)*slope,
    -depth,-height-depth*slope];
    return points
}

function drawCube(graphics,height,width,depth=width,cp,x=0,y=0,isBox=false,slope=isoSlope) {//isBox determines if a top quad should be generated
    graphics.lineStyle(0, cp.dc, 1);
    graphics.beginFill(cp.dc);
    graphics.drawPolygon(leftPoints(height,depth,x,y));
    graphics.endFill();
    graphics.beginFill(cp.pc);
    graphics.drawPolygon(rightPoints(height,width,x,y));
    graphics.endFill();
    //draw top of cube
    if (!isBox) {
        let topQuad = topPoints(height,width,depth);
        graphics.beginFill(cp.lc);
        graphics.drawPolygon(topQuad);
        graphics.endFill();
    }  
}

function isInChunk(x,y) {
    
}

//returns random -1 or 1
function posNeg() {
    if (Math.random()>=.5) {
        return -1;
    } else {
        return 1;
    }
}

function gameLoop(delta) {
    //Update the current game state:
    state(delta);
}

function play(delta) {
    if (player.vy != 0 || player.vx != 0) {
        player.update(delta);
    }

    //choose a random NPC to move
    if (chunks[player.chunkIndex].city && Math.random()>.90) {
        let mover = Math.floor(Math.random()*chunks[player.chunkIndex].inhabitants.length);
        if (chunks[player.chunkIndex].inhabitants[player.speakingTo] != mover && !(mover in movingCharacters)) {
            //set NPC goal location and add to Array of moving NPCs
            chunks[player.chunkIndex].inhabitants[mover].moveTo(player.chunkIndex);
            movingCharacters.push([player.chunkIndex,mover]);
        }
    }

    //continue moving characters that are moving
    for (var i = 0; i < movingCharacters.length; i++) {
        chunks[movingCharacters[i][0]].inhabitants[movingCharacters[i][1]].update(delta,i);
    }
}

function talking(delta) {
    // body...
}




//Random use functions. Move to other files
function randomHex(seed=Math.random()) {
    return '0x'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
}



//setup();




