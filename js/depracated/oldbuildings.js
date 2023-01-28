function drawBuilding(x=0,y=0) {
    let pc = colorPalette.primary[Math.floor(Math.random()*colorPalette.primary.length)];
    let ac = colorPalette.accent[Math.floor(Math.random()*colorPalette.accent.length)];

    let size = Math.floor(Math.random()*5)+70;
    let width = Math.floor(Math.random()*40)+size/2;
    let depth = Math.floor(Math.random()*40)+size/2;
    let height = Math.floor(Math.random()*140)+size;

    //init graphic container
    let drawer = new PIXI.Graphics();
    drawer.zIndex = y-width*isoSlope;

    drawCube(drawer,height,width,depth,pc);//add it as a function to Graphics, so you can be like: drawer.drawCube();
    
    //draw windows
    let topWin;//highest y coord of highest window
    let winRowsDec = (height-22) / 30;
    let winRows = Math.floor(winRowsDec);
    if (height > 200 && Math.random() < .3) {
        var winHeight = (height-25)/winRows;
        console.log('winHeight: '+winHeight);
        console.log(height);
    } else {
        var winHeight = 15
    }

    var winWidth = Math.floor(Math.random()*5+6);
    let leftDif = depth/15;
    let winCols = Math.floor(leftDif);
    leftDif = (leftDif-winCols)*15;

    drawer.beginFill(0x000000);
    for (var row = 0; row < winRows; row++) {
        for (var col = 0; col < winCols; col++) {
            let winX = -col*15-(15-winWidth)/2 - leftDif/2;
            let winY = -row*30-25+winX*isoSlope;
            let window = leftPoints(winHeight,winWidth,winX,winY);
            drawer.drawPolygon(window);
            topWin = winY
        }
    }
    rightDif = width/15;
    winCols = Math.floor(rightDif);
    rightDif = (rightDif-winCols)*15;
    for (var row = 0; row < winRows; row++) {
        for (var col = 0; col < winCols; col++) {
            let winX = col*15+(15-winWidth)/2 + rightDif/2;
            let winY = -row*30-25-winX*isoSlope;
            let window = rightPoints(winHeight,winWidth,winX,winY);
            drawer.drawPolygon(window);
            topWin = winY
        }
    }
    drawer.endFill();

    //BUILDING SHEATH
    if (Math.random() >.5) {
        drawCube(drawer,20,width,depth,ac,0,0,true);
    }

    //corner column
    let cornerWidth = Math.min(rightDif,leftDif);
    if (cornerWidth > 2) {
        drawer.beginFill(pc.pc);
        drawer.drawPolygon(rightPoints(height,cornerWidth/2,0,2));
        drawer.beginFill(0x000000,.1);
        drawer.drawPolygon(leftPoints(height+2,cornerWidth/2+1,0,2));
        drawer.beginFill(pc.dc);
        drawer.drawPolygon(leftPoints(height,cornerWidth/2,0,2));
        drawer.endFill();

        drawer.beginFill(pc.dc);
        drawer.drawPolygon(leftPoints(height+2,cornerWidth/2,cornerWidth/2-depth,-depth*isoSlope+3));
        drawer.beginFill(pc.pc);
        drawer.drawPolygon(rightPoints(height+2,2,cornerWidth/2-depth,(cornerWidth/2-depth)*isoSlope+2));
        //drawer.drawPolygon(rightPoints(height,cornerWidth/2,0,2));
        //drawer.beginFill(0x000000,.1);
        
        drawer.endFill();
    }
    


    //top crown decoration
    let crownWidth = 2;
    let rimHeight = height + topWin - 10;
    if (height + topWin > 20 || Math.random > .5) {
        if (Math.random() > .5) {
            var crownColor = pc;
        } else {
            var crownColor = ac;
        }

        if (rimHeight > 20) {// set 
            console.log(rimHeight);
        }

        crownWidth = 5;
        drawer.beginFill(0x000000,.3);
        drawer.drawPolygon(leftPoints(rimHeight,depth,0,3-(height-rimHeight)));
        drawer.drawPolygon(rightPoints(rimHeight,width,0,3-(height-rimHeight)));
        drawer.endFill();

        drawCube(drawer,rimHeight,width+crownWidth,depth+crownWidth,crownColor,0,-(height-rimHeight),true);
        drawer.beginFill(crownColor.lc);
        drawer.drawPolygon(topPoints(height,width+crownWidth,depth+crownWidth));
        drawer.endFill();



    }
    //DIFFERENT ROOF COLOR
    if (Math.random() >.5) {
        drawer.beginFill(ac.lc);
        drawer.drawPolygon(topPoints(height+crownWidth/2,width-3,depth-3));
        drawer.endFill();
    }

    //draw decorations .3 the time accent color, .7 the time regular
        //buttresses, 

    //draw details
        //roof AC, fire escape stairs (topquad, diagonal lines), stairs


    //draw steps
    if (Math.random()>stepChance) {
        drawer.moveTo(width/2,-width/2*isoSlope);

    }

    drawer.x = x;
    drawer.y = y;
    scene.addChild(drawer);
}