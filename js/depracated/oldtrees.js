//Draws trees as a function of multiple ellipses at different shades, bordered by randomly spaced small circles
//Pass {lc:0x358D5D,pc:0x38743E,dc:0x205829} as cp (color palette)

function drawTree(posX,posY,drawer,cp) {
    //let drawer = new PIXI.Graphics()
    var rad = tileRad/3;

    let treeGen = new PIXI.Graphics();
    //treeGen.cacheAsBitmap = true;

    treeGen.clear()
    treeGen.beginFill(cp.dc);
    treeGen.drawEllipse(posX,posY,rad*.7,rad);

    for (var n = 0; n < Math.random()*5+10; n++) {
            //let dist = Math.random()*.05 + 1;
            let angle = Math.random()*Math.PI*2; 
            let x = Math.cos(angle)*rad*.7;
            let y = Math.sin(angle)*-rad;
            if (posY+y < posY) {
                treeGen.beginFill(cp.lc);
            } else {
                treeGen.beginFill(cp.dc);
            }

            treeGen.drawCircle(x + posX,y + posY,rad*(Math.random()/6+.1));
    }


    
    for (var i = 0; i < 4; i++) {
        let x = posX + Math.random()*tileRad/4 - tileRad/10*i;
        let y = posY + Math.random()*tileRad/4 - tileRad/10*i;

        let width = rad*(Math.random()*.25+.25);
        let height = rad*(Math.random()*.25+.25);

        treeGen.beginFill(cp.pc);
        treeGen.drawEllipse(x-5,y,width,height);
        for (var n = 0; n < Math.random()*5+5; n++) {
            //let dist = Math.random()*.05 + 1;
            let angle = Math.random()*Math.PI*2; 
            let posX = Math.cos(angle)*width;
            let posY = Math.sin(angle)*height;
            if (posY+y < y) {
                treeGen.beginFill(cp.lc);
            } else {
                treeGen.beginFill(cp.pc);
            }
            treeGen.drawCircle(x + posX,y + posY,rad*(Math.random()/6+.1));
        }
    }
    for (var i = 0; i < 6; i++) {
        let x = posX + Math.random()*tileRad/2 - tileRad/4;
        let y = posY + Math.random()*tileRad/3 - tileRad/13*i;

        let width = rad*(Math.random()*.25+.25);
        let height = rad*(Math.random()*.25+.25);

        treeGen.beginFill(cp.pc);
        treeGen.drawEllipse(x-5,y,width,height);
        //drawer.drawEllipse(x-5,y+rad,width,height);

        for (var n = 0; n < Math.random()*5+10; n++) {
            //let dist = Math.random()*.05 + 1;
            let angle = Math.random()*Math.PI*2; 
            let posXY = randomEllipsePoint(0,0,width,height,false,width,height);
            if (posXY[1]+y < y) {
                treeGen.beginFill(cp.lc);
            } else {
                treeGen.beginFill(cp.pc);
            }

            treeGen.drawCircle(x + posXY[0],y + posY[1],rad*(Math.random()/6+.1));
            //drawer.drawCircle(x + posX,y + posY+rad,rad*(Math.random()/6+.1));
        }
    }
    
    treeGen.endFill();

    drawer.addChild(treeGen);
    //container.addChild(drawer);
}



function drawMoss(posX,posY,drawer,cp) {
    //let drawer = new PIXI.Graphics()
    var rad = tileRad/3;

    drawer.beginFill(cp.dc);
    drawer.drawEllipse(posX,posY,rad,rad);

    for (var n = 0; n < Math.random()*20; n++) {
            //let dist = Math.random()*.05 + 1;
            let angle = Math.random()*Math.PI*2; 
            let x = Math.cos(angle)*rad;
            let y = Math.abs(Math.sin(angle))*-rad;
            if (posY+y < y) {
                drawer.beginFill(cp.lc);
            } else {
                drawer.beginFill(cp.pc);
            }

            drawer.drawCircle(x + posX,y + posY,rad*(Math.random()/6+.1));
    }

    for (var i = 0; i < 6; i++) {
        let x = posX + Math.random()*tileRad/4 - tileRad/10;
        let y = posY + Math.random()*tileRad/2 - tileRad/i;

        let width = rad*(Math.random()*.25+.25);
        let height = rad*(Math.random()*.25+.25);

        drawer.beginFill(cp.pc);
        drawer.drawEllipse(x-5,y,width,height);

        for (var n = 0; n < Math.random()*20; n++) {
            //let dist = Math.random()*.05 + 1;
            let angle = Math.random()*Math.PI*2; 
            let posX = Math.cos(angle)*width;
            let posY = Math.sin(angle)*height;
            if (posY+y < y) {
                drawer.beginFill(cp.lc);
            } else {
                drawer.beginFill(cp.pc);
            }

            drawer.drawCircle(x + posX,y + posY,rad*(Math.random()/6+.1));
        }
    }
    drawer.endFill();
    //container.addChild(drawer);
}



