class Birb {
    constructor(posX=Math.floor(Math.random()*app.renderer.width),posY=Math.floor(Math.random()*app.renderer.height)) {
        this.x = posX;
        this.y = posY;
        this.colors = colors[Math.floor(Math.random()*colors.length)];
        this.seed = Math.floor(Math.random() * 1000000000).toString();
        this.seed += Math.floor(Math.random() * 1000000000).toString();
        this.graphic = new PIXI.Graphics();
        this.draw(posX,posY);
        this.moving = false;

        this.graphic.zIndex = (this.graphic.y);
        let bounds = this.graphic.getLocalBounds();

        this.target;
        this.state = this.moveState;

        this.character = new Character();
    }
    draw(posX,posY) {
        let x = 0;
        let y = 0;

        let bc = 0xFFFDED;
        let pc = this.colors[0];
        let dc = this.colors[1];
        //Bird Graphics Container

        //Draw Legs
        this.graphic.lineStyle(3, dc, 1);
        this.graphic.moveTo(x - feet_length, y);
        this.graphic.lineTo(x + feet_length, y);

        this.graphic.moveTo(x - feet_length/3.0, y);
        this.graphic.lineTo(x - feet_length/3.0 - feet_length/2.0, y - feet_length);

        this.graphic.moveTo(x + feet_length/3.0, y);
        this.graphic.lineTo(x + feet_length/3.0 - feet_length/2.0, y - feet_length);

        //Draw Body
        let body_bottom = y - feet_length/2.0;
        let body_one = [parseInt(x - feet_length * 2.0), parseInt(body_bottom)];
        let body_two = [parseInt(x + feet_length*1.5), parseInt(body_bottom)];
        let body_three = [parseInt(x + feet_length*2.1), parseInt(body_bottom - body_height)];
        let body_four = [parseInt(x), parseInt(body_bottom - body_height * 1.3)];

        let left_midpoint = [(body_four[0] + body_one[0]) / 2, (body_four[1] + body_one[1]) / 2];
        let top_midpoint = [(body_four[0] + body_three[0]) / 2, (body_four[1] + body_three[1]) / 2];
        let right_midpoint = [(body_two[0] + body_three[0]) / 2, (body_two[1] + body_three[1]) / 2];
        let bottom_midpoint = [(body_one[0] + body_two[0]) / 2, (body_one[1] + body_two[1]) / 2];

        let true_midpoint = [(left_midpoint[0] + right_midpoint[0]) / 2, (left_midpoint[1] + right_midpoint[1]) / 2];
        let body_points = [ body_one, body_three, body_four, left_midpoint, top_midpoint, bottom_midpoint];

        this.graphic.beginFill(bc);
        this.graphic.drawPolygon([body_one[0],body_one[1],body_two[0],body_two[1],body_three[0],body_three[1],body_four[0],body_four[1]]);
        this.graphic.endFill();

        for (var i = 0; i < Math.floor(this.seed[0]/3.01+2); i++) {// remove the +1 for simpler birds
            let point_one = body_points[Math.floor(this.seed[this.seed[0]]*.6)];
            let point_two = body_points[Math.floor(this.seed[this.seed[1]]*.6)];
            let point_three = body_points[Math.floor(this.seed[this.seed[2]]*.6)];
            let point_four = body_points[Math.floor(this.seed[this.seed[3]]*.6)];
            this.graphic.beginFill(pc);
            this.graphic.drawPolygon([point_one[0], point_one[1], point_two[0], point_two[1], point_three[0], point_three[1], point_four[0], point_four[1]]);
            this.graphic.endFill();

            if (this.seed[1]>=5) {
                this.graphic.drawPolygon([point_one[0], point_one[1], point_two[0], point_two[1], point_three[0], point_three[1]]);
            }
        }

        //Draw Tail
        if (this.seed[2]/10<tail_chance) {
            let var_width = Math.floor(this.seed[3]/9.1*16+15);
            let var_x = Math.floor(this.seed[4]/9.1*-10-15);
            let var_y = Math.floor(this.seed[5]/9.1*-20-30);
            if (this.seed[6]/9.1>=0.3) {
                var_y *= -1;
            }
            this.graphic.beginFill(pc);
            this.graphic.drawPolygon([
                body_one[0],body_one[1],
                body_one[0] + var_width,body_one[1],
                body_one[0] + + var_width + var_x,body_one[1] + var_y,
                body_one[0] + var_x,body_one[1] + var_y
                ]);
            this.graphic.endFill();
        }

        //Draw Beak
        let head_x = x + feet_length;
        let head_y = body_bottom - body_height * 1.1;
        let head_size = 22.5;

        let y_variance = Math.floor(this.seed[7]/9.1*15+5);
        let length_variance = Math.floor(this.seed[8]/9.1*25+25);

        if (this.seed[9]/9.1<body_fill_chance) {
            this.graphic.beginFill(pc);
        } else {
            this.graphic.beginFill(bc);
        }
        this.graphic.drawPolygon([
            head_x, head_y - y_variance, 
            head_x, head_y + y_variance, 
            head_x + length_variance, head_y]);
        this.graphic.endFill();

        //Draw Head
        if (this.seed[10]/9.1 < head_fill_chance) {
            this.graphic.beginFill(pc);
        } else {
            this.graphic.beginFill(bc);
        }
        this.graphic.drawCircle(head_x, head_y, head_size);
        this.graphic.endFill();

        if (this.seed[11]/9.1 < arc_chance) {
            this.graphic.beginFill(pc);
            this.graphic.arc(head_x, head_y, head_size, (this.seed[3]/9.1*.3+.7)*Math.PI, 1.8*Math.PI);
            this.graphic.endFill();
        }

        //Draw Eyes
        let eye_x = head_x + head_size/3.0;
        let eye_y = head_y - head_size/4.0;
        let eye_size = 6.25;

        this.graphic.beginFill(bc);
        this.graphic.drawCircle(eye_x, eye_y, eye_size);
        this.graphic.endFill();

        this.graphic.lineStyle(0, dc, 1);
        this.graphic.beginFill(0x000000);
        this.graphic.drawCircle(eye_x, eye_y, 2.5);
        this.graphic.endFill();

        this.graphic.y = posY;
        this.graphic.x = posX;

        //When you leave the scene, save x & y position?
        app.stage.addChild(this.graphic);
    }
    moveState(delta) {
        // body...
        if (this.moving) {
            if (this.graphic.x * this.target.direction >= (this.target.endpoint)*this.target.direction) {
                this.moving = false;
            } else {
                this.graphic.y += ((this.target.endpoint - this.target.loc)/2-(this.target.endpoint - this.graphic.x))*this.target.direction*delta+1;
            
                this.graphic.x += (this.target.direction*4*delta);
            }
        }
        else if (Math.random() > .97) {
            this.moving = true;
            this.direction = Math.round(Math.random()) * 2 - 1;
            this.target = {direction: this.direction, loc: this.graphic.x, endpoint: this.graphic.x + 30 * this.direction};
            if (this.direction < 0) {
                this.graphic.scale.x =-1;
            } else {
                this.graphic.scale.x = 1;
            }
        }
    }
    talkState(delta) {

    }
    update(delta) {
        this.state(delta);
    }
    remove() {
        this.graphic.destroy(); 
        //save data as json object
        /*
        name
        draw seed
        stack
        connections
        */
    }
}