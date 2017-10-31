//创建Cell类型描述每个格子
class Cell{
    constructor(r,c,src){
        this.r=r;
        this.c=c;
        this.src=src;
    }
}
//创建State类型描述图形的每一种旋转状态
class State{
    constructor(r0,c0,r1,c1,r2,c2,r3,c3){
        this.r0=r0; this.c0=c0;
        this.r1=r1; this.c1=c1;
        this.r2=r2; this.c2=c2;
        this.r3=r3; this.c3=c3;
    }
}
//创建公共父类型Shape
class Shape{
    constructor(
        r0,c0,r1,c1,r2,c2,r3,c3,src,
        orgi,states){
        this.cells=[
            new Cell(r0,c0,src),
            new Cell(r1,c1,src),
            new Cell(r2,c2,src),
            new Cell(r3,c3,src),
        ];
        //根据提供的参照格下标获得参照格
        this.orgCell=this.cells[orgi];
        this.states=states;
        //保存图形当前所处的旋转状态,默认是0
        this.statei=0;
    }
    moveDown(){
        //遍历当前图形的cells中每个cell
        for(var cell of this.cells)
            //将当前cell的r+1
            cell.r++;
    }
    moveLeft(){
        for(var cell of this.cells)
            cell.c--;
    }
    moveRight(){
        for(var cell of this.cells)
            cell.c++;
    }
    rotateR(){
        //将statei+1
        //如果statei等于states的length,就改回0
        if(++this.statei==this.states.length)
            this.statei=0;
        this.rotate();//旋转
    }
    rotate(){
        //获得states中statei位置的新状态
        var state=this.states[this.statei];
        //遍历当前图形的cells中每个cell
        for(var i=0;
            i<this.cells.length;
            i++){
            //设置当前cell的r等于orgCell的r+状态中对应的rn
            this.cells[i].r=
                this.orgCell.r+state["r"+i];
            //设置当前cell的c等于orgCell的c+状态中对应的cn
            this.cells[i].c=
                this.orgCell.c+state["c"+i];
        }
    }
    rotateL(){
        //将statei-1
        //如果statei等于-1,就改回states的length-1
        if(--this.statei==-1)
            this.statei=this.states.length-1;
        this.rotate();//旋转
    }
}
//创建T图形类型
class T extends Shape{
    constructor(){
        super(
            0,3,0,4,0,5,1,4,"img/T.png",1,
            [
                new State(0,-1, 0,0, 0,+1, +1,0),
                new State(-1,0, 0,0, +1,0, 0,-1),
                new State(0,+1, 0,0, 0,-1, -1,0),
                new State(+1,0, 0,0, -1,0, 0,+1)
            ]
        );
    }
}
//创建O图形类型
class O extends Shape{
    constructor(){
        super(
            0,4,0,5,1,4,1,5,"img/O.png",1,
            [
                new State(0,-1, 0,0, +1,-1,+1,0)
            ]
        );
    }
}
//创建I图形类型
class I extends Shape{
    constructor(){
        super(
            0,3,0,4,0,5,0,6,"img/I.png",1,
            [
                new State(0,-1, 0,0, 0,+1, 0,+2),
                new State(-1,0, 0,0, +1,0, +2,0)
            ]
        );
    }
}
class S extends Shape{
    constructor(){
        super(
            0,4,0,5,1,3,1,4,"img/S.png",3,
            [
                new State(-1,0, -1,+1, 0,-1, 0,0),
                new State(0,+1, +1,+1, -1,0, 0,0)
            ]
        );
    }
}
class Z extends Shape{
    constructor(){
        super(
            0,3,0,4,1,4,1,5,"img/Z.png",2,
            [
                new State(-1,-1, -1,0, 0,0, 0,+1),
                new State(-1,+1, 0,+1, 0,0, +1,0)
            ]
        );
    }
}
class L extends Shape{
    constructor(){
        super(
            0,3,0,4,0,5,1,3,"img/L.png",1,
            [
                new State(0,-1, 0,0, 0,+1, +1,-1),
                new State(-1,0, 0,0, +1,0, -1,-1),
                new State(0,+1, 0,0, 0,-1, -1,+1),
                new State(+1,0, 0,0, -1,0, +1,+1)
            ]
        );
    }
}
class J extends Shape{
    constructor(){
        super(
            0,3,0,4,0,5,1,5,"img/J.png",1,
            [
                new State(0,-1, 0,0, 0,+1, +1,+1),
                new State(-1,0, 0,0, +1,0, +1,-1),
                new State(0,+1, 0,0, 0,-1, -1,-1),
                new State(+1,0, 0,0, -1,0, -1,+1)
            ]
        );
    }
}