var database;
var drawing = [];
var currentPath = [];

var isDrawing = false;

var back,clear,remove;
function setup() {
    canvas = createCanvas(1000,530);
    database = firebase.database();
    canvas.mousePressed(startPath);
    canvas.mouseReleased(endPath);

    back = createButton('save');
    back.mousePressed(saveDrawing);
    clear = createButton('clear');
    clear.mousePressed(clearDrawing);
 

    var ref = database.ref('drawings');
    ref.on('value',gotData,errData);
}

function startPath(){
    isDrawing = true;
    currentPath = [];
    drawing.push(currentPath);
}
function endPath(){
   isDrawing = false;
}
function draw() {
    background(255);

    back.position(100,200);
    clear.position(100,150);



    if (isDrawing) {
        var point = {
            x: mouseX,
            y: mouseY
          
        }
       // fill(0);
       currentPath.push(point);
    }
   // console.log(point);
    

        strokeWeight(4);
        stroke(0);
        noFill();

        for (var i = 0; i < drawing.length; i++) {
            var path = drawing[i];
            beginShape();
            for (var j = 0; j < path.length; j++) {
            vertex(path[j].x,path[j].y);
        }
        endShape();
    }
   
    database.ref('position').set({
        point:drawing
    })

}
function saveDrawing(){
    var ref = database.ref('drawings');

    var data = {
        name:'rishabh',
        drawing : drawing
    }
    var result = ref.push(data,dataSent);
    console.log(result.key);

    function dataSent(err,status){
        //console.log(status);
    }
    //ref.push(drawing);
}

function gotData(data){

    drawings = data.val();
    var keys = Object.keys(drawings);
    for(i=0;i<keys.length;i++){
        var key = keys[i];
        //console.log(key);
        var li = createElement('li', '');
        li.class('listing');
        var ris = createA('#', key);
        ris.mousePressed(showDrawing);
        ris.parent(li);
        li.parent('darwinglist');
    var elts = selectAll('.listing');
    
for(var i = 0;i<elts.length;i++){
    elts[i].remove();
}
        
    }
}

function errData(err){
    //console.log(err);
}

function showDrawing(){
    var key = this.html();
    var ref = database.ref('drawings/'+key);
    ref.on('value', oneDrawing, errData);

    function oneDrawing(data){
        var p = data.val();
        drawings = p.drawing;
        //console.log(dbdrawing);
    }
}
function clearDrawing(){
    drawing = [];
}
