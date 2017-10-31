var game={
    RN:20,CN:10,//总行数，列数
    //pg属性保存游戏主界面div
    pg:document.getElementsByClassName("playground")[0],
    //保存格子大小和内边距偏移量
    CSIZE:26, OFFSET:15,
    shape:null,//保存主角图形
    nextShape:null,//保存备胎图形
    interval:500,//下落的时间间隔
    timer:null,//保存定时器序号
    //保存所有停止下落的方块的二维数组墙
    wall:null,
    score:0,//保存游戏的得分
    SCORES:[0,10,30,60,100],
    // 0  1  2  3  4
    lines:0,//保存总行数
    status:1,//保存游戏状态
    GAMEOVER:0,RUNNING:1,PAUSE:2,
    //启动游戏
    start(){
        //将游戏置为RUNNING状态
        this.status=this.RUNNING;
        //将分数和行数都归0
        this.score=0;
        this.lines=0;
        //创建空数组保存在wall中
        this.wall=[];
        //在wall中生成10*20的二维数组
        for(var r=0;r<this.RN;r++){
            //向wall中压入一个10个空元素的子数组
            this.wall.push(
                new Array(this.CN));
        }
        //随机生成主角和备胎图形
        this.shape=this.randomShape();
        this.nextShape=this.randomShape();
        this.paint();//重绘一切
        //启动周期性定时器
        this.timer=setInterval(
            //this.moveDown.bind(this)
            ()=>this.moveDown()
            ,
            this.interval
        );
        //为页面添加键盘按下事件
        document.onkeydown=function(e){
            switch(e.keyCode){
                case 37: //左
                    if(this.status==this.RUNNING)
                        this.moveLeft();
                    break;
                case 39: //右
                    if(this.status==this.RUNNING)
                        this.moveRight();
                    break;
                case 40: //下
                    if(this.status==this.RUNNING)
                        this.moveDown();
                    break;
                case 32: //hardDrop
                    if(this.status==this.RUNNING)
                        this.hardDrop();
                    break;
                case 38: //上:顺时针旋转
                    if(this.status==this.RUNNING)
                        this.rotateR();
                    break;
                case 90: //Z:逆时针旋转
                    if(this.status==this.RUNNING)
                        this.rotateL();
                    break;
                case 83: //S:重启游戏
                    if(this.status==this.GAMEOVER)
                        this.start();
                    break;
                case 80: //P:暂停
                    if(this.status==this.RUNNING)
                        this.pause();
                    break;
                case 67: //C:继续
                    if(this.status==this.PAUSE)
                        this.myContinue();
                    break;
                case 81: //Q:放弃
                    if(this.status!=this.GAMEOVER)
                        this.gameover();
            }
        }.bind(this);//用start中正确的this代替事件处理函数中不想要的this
    },
    gameover(){
        //修改游戏状态为GAMEOVER
        this.status=this.GAMEOVER;
        //停止定时器
        clearInterval(this.timer);
        this.timer=null;
        //重绘一切
        this.paint();
    },
    myContinue(){
        //修改游戏状态为RUNNING
        this.status=this.RUNNING;
        //启动定时器
        this.timer=setInterval(
            this.moveDown.bind(this),
            this.interval
        );
        //重绘一切
        this.paint();
    },
    pause(){
        //修改游戏状态为暂停
        this.status=this.PAUSE;
        //停止定时器
        clearInterval(this.timer);
        this.timer=null;
        //重绘一切
        this.paint();
    },
    //随机生成一种图形
    randomShape(){
        //在0~6之间生成一个随机整数
        var r=parseInt(Math.random()*7);
        switch(r){
            case 0: return new O();
            case 1: return new I();
            case 2: return new T();
            case 3: return new S();
            case 4: return new Z();
            case 5: return new L();
            case 6: return new J();

        }
    },
    //判断能否旋转
    canRotate(){
        //遍历主角shape的cells中每个cell
        for(var cell of this.shape.cells){
            //如果cell的c<0,或cell的c>=CN,或cell的r<0,或cell的r>=RN
            if(cell.c<0||cell.c>=this.CN
                ||cell.r<0||cell.r>=this.RN)
                return false;//返回false
            //否则，如果wall中cell相同位置有格
            else if(this.wall[cell.r][cell.c]
                !==undefined)
                return false;//返回false
        }//(遍历结束)
        return true;//返回true
    },
    rotateR(){
        //让主角shape顺时针旋转
        this.shape.rotateR();
        if(this.canRotate())
        //重绘一切
            this.paint();
        else
            this.shape.rotateL();
    },
    rotateL(){
        this.shape.rotateL();
        if(this.canRotate())
            this.paint();
        else
            this.shape.rotateR();
    },
    //一落到底
    hardDrop(){
        //只要可以下落，就反复调用moveDown()
        while(this.canDown())
            this.moveDown();
    },
    //判断能否左移
    canLeft(){
        //遍历shape中cells中每个cell
        for(var cell of this.shape.cells){
            //如果cell的c等于0
            if(cell.c==0)
                return false;//返回false
            //否则，如果wall中cell左侧不是空
            else if(
                this.wall[cell.r][cell.c-1]
                !=undefined)
                return false;//返回false
        }//(遍历结束)
        return true;//返回true
    },
    //左移
    moveLeft(){
        //如果可以左移
        if(this.canLeft()){
            //让shape左移一次
            this.shape.moveLeft();
            //重绘一切
            this.paint();
        }
    },
    //判断能否右移
    canRight(){
        for(var cell of this.shape.cells) {
            if (cell.c == this.CN - 1)
                return false;
            else if (
                this.wall[cell.r][cell.c + 1]
                != undefined)
                return false;
        }
        return true;
    },
    //右移
    moveRight(){
        if(this.canRight()){
            //让shape右移一次
            this.shape.moveRight();
            //重绘一切
            this.paint();
        }
    },
    //判断主角能否下落
    canDown(){
        //遍历主角的cells中每个cell
        for(var cell of this.shape.cells){
            //只要当前cell的r==RN-1
            if(cell.r==this.RN-1)
                return false;//就返回false
            //否则,如果wall中，当前cell的下方有格
            else if(
                this.wall[cell.r+1][cell.c]
                !==undefined)
                return false;//也返回false
        }//(遍历结束)
        return true;//就返回true
    },
    //将停止下落的图形中的每个格放入wall中
    landIntoWall(){
        //遍历shape的cells中每个cell
        for(var cell of this.shape.cells)
            //将当前cell，放入wall中相同位置
            this.wall[cell.r][cell.c]=cell;
    },
    //下落
    moveDown(){
        if(this.canDown()){
            //让主角图形下落
            this.shape.moveDown();
        }else{
            //将当前shape的四个格，放入墙中
            this.landIntoWall();
            //删除所有满格行
            var ln=this.deleteRows();
            //将ln累加到lines上
            this.lines+=ln;
            //获得ln对应的得分，累加到score上
            this.score+=this.SCORES[ln];
            //如果游戏没有结束
            if(!this.isGameOver()){
                //备胎转正
                this.shape=this.nextShape;
                //再生成新的备胎
                this.nextShape=
                    this.randomShape();
            }else{//否则
                //修改游戏状态为GAMEOVER
                this.status=this.GAMEOVER;
                //停止定时器
                clearInterval(this.timer);
                this.timer=null;
            }
        }
        //重绘一切
        this.paint();
    },
    //判断游戏是否结束
    isGameOver(){
        //遍历nextShape的cells中每个cell
        for(var cell of this.nextShape.cells){
            //如果wall中cell相同位置有格
            if(this.wall[cell.r][cell.c]
                !==undefined)
                return true;//返回true
        }//(遍历结束)
        return false;//返回false
    },
    //检查并删除所有满格行
    deleteRows(){
        //自底向上遍历wall中每一行
        for(var r=this.RN-1,ln=0;r>=0;r--){
            //如果当前行是空行
            if(this.wall[r].join("")==="")
                break;//退出循环
            //否则，如果是满格行
            else if(this.isFullRow(r)){
                //删除当前行
                this.deleteRow(r);
                r++;//r留在原地
                //如果已经删除了4行，则不必再向上检查
                if(++ln==4) break;
            }
        }
        return ln;
    },
    //判断第r行是否满格
    isFullRow(r){
        //为wall中第r行拍照
        var str=String(this.wall[r]);
        //定义正则查找开头的,或,,或结尾的,
        var reg=/^,|,,|,$/g;
        //如果没找到，就返回true
        if(str.search(reg)==-1)
            return true;
        else//否则返回false
            return false;
    },
    //删除第r行
    deleteRow(r){
        //从r行开始，反向遍历wall中每一行
        for(;r>0;r--){
            //将wall中r-1行赋值给r行
            this.wall[r]=this.wall[r-1];
            //将wall中r-1行暂时置为空行
            this.wall[r-1]=new Array(this.CN);
            //遍历wall中r行每个格
            for(var cell of this.wall[r]){
                //如果当前格不为空
                if(cell!==undefined)
                    cell.r++;//将当前格的r+1
            }//(遍历结束)
            //如果r-2行为空行
            if(this.wall[r-2].join("")==="")
                break;//退出循环
        }
    },
    //根据游戏状态绘制对应图片
    paintStatus(){
        if(this.status==this.GAMEOVER){
            var img=new Image();
            img.src="img/game-over.png";
            this.pg.appendChild(img);
        }else if(this.status==this.PAUSE){
            var img=new Image();
            img.src="img/pause.png";
            this.pg.appendChild(img);
        }

    },
    //重绘一切
    paint(){
        //删除pg中所有img
        this.pg.innerHTML=
            this.pg.innerHTML.replace(
                /<img .*>/g,""
            );
        //绘制主角图形
        this.paintShape();
        //绘制墙
        this.paintWall();
        //重绘备胎
        this.paintNext();
        //重绘分数
        this.paintScore();
        //重绘状态
        this.paintStatus();
    },
    //绘制分数
    paintScore(){
        //在pg下找所有span
        var spans=this.pg.querySelectorAll(
            "span"
        );
        //设置第1个span的内容为score
        spans[0].innerHTML=this.score;
        //设置第2个span的内容为lines
        spans[1].innerHTML=this.lines;
    },
    //重绘墙
    paintWall(){
        //创建frag
        var frag=document.createDocumentFragment();
        //自底向上遍历wall中每一行
        for(var r=this.RN-1;r>=0;r--) {
            //如果当前行不是空行
            if(this.wall[r].join("")!==""){
                //遍历当前行中每个格
                for(var cell of this.wall[r]){
                    //如果当前格不是空
                    if(cell!==undefined){
                        //创建img
                        var img=new Image();
                        //设置img的style的cssText
                        img.style.cssText=
                            `width:${this.CSIZE}px;
                             top:${this.CSIZE*cell.r+this.OFFSET}px;
                             left:${this.CSIZE*cell.c+this.OFFSET}px`;
                        //设置img的src
                        img.src=cell.src;
                        //将img加入frag
                        frag.appendChild(img);
                    }
                }
            }else break;//否则 退出循环
        }//(遍历结束)
        //将frag加入pg
        this.pg.appendChild(frag);
    },
    //绘制主角图形
    paintShape(){
        //创建文档片段
        var frag=document.createDocumentFragment();
        //遍历主角图形的cells数组中每个cell
        for(var cell of this.shape.cells){
            //创建一个img元素
            var img=new Image();
            //设置img的width,top,left,src
            img.style.cssText=
                `width:${this.CSIZE}px;
         top:${
                this.CSIZE*cell.r+this.OFFSET
                    }px;
         left:${
                this.CSIZE*cell.c+this.OFFSET
                    }px`;
            img.src=cell.src;
            frag.appendChild(img);
        }
        //将frag追加到pg中
        this.pg.appendChild(frag);
    },
    //绘制备胎
    paintNext(){
        //创建文档片段
        var frag=document.createDocumentFragment();
        //遍历主角图形的cells数组中每个cell
        for(var cell of this.nextShape.cells){
            //创建一个img元素
            var img=new Image();
            //设置img的width,top,left,src
            img.style.cssText=
                `width:${this.CSIZE}px;
         top:${
                this.CSIZE*(cell.r+1)
                +this.OFFSET
                    }px;
         left:${
                this.CSIZE*(cell.c+10)
                +this.OFFSET
                    }px`;
            img.src=cell.src;
            frag.appendChild(img);
        }
        //将frag追加到pg中
        this.pg.appendChild(frag);
    }
};
game.start();
