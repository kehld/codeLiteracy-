var capture;
var buffer;
var result;
var previousPixels;
var flow;
var w = 640,
    h = 480;
var step = 8;

var uMotionGraph, vMotionGraph;

function setup() {
    createCanvas(w, h);
    capture = createCapture(VIDEO);
    capture.hide();
    buffer = new jsfeat.matrix_t(w, h, jsfeat.U8C1_t);
    flow = new FlowCalculator(step);
    uMotionGraph = new Graph(100, -step / 1, +step / 1);
    vMotionGraph = new Graph(100, -step / 1, +step / 1);

}

function draw() {
    // image(capture, 0, 0, 640, 480);
    capture.loadPixels();
    // if (capture.pixels.length > 0) { // don't forget this!        
    //     var blurSize = select('#blurSize').elt.value;
    //     var lowThreshold = select('#lowThreshold').elt.value;
    //     var highThreshold = select('#highThreshold').elt.value;
        
    //     blurSize = map(blurSize, 0, 100, 1, 12);
    //     lowThreshold = map(lowThreshold, 0, 100, 0, 255);
    //     highThreshold = map(highThreshold, 0, 100, 0, 255);
        
    //     jsfeat.imgproc.grayscale(capture.pixels, w, h, buffer);
    //     jsfeat.imgproc.gaussian_blur(buffer, buffer, blurSize, 0);
    //     jsfeat.imgproc.canny(buffer, buffer, lowThreshold, highThreshold);
    //     var n = buffer.rows * buffer.cols;
        
    //     result = jsfeatToP5(buffer, result);
    //     image(result, 0, 0, 640, 480);



    //
    capture.loadPixels();
    if (capture.pixels.length > 0) {

        // var blurSize = select('#blurSize').elt.value;
        // var lowThreshold = select('#lowThreshold').elt.value;
        // var highThreshold = select('#highThreshold').elt.value;
        
        // blurSize = map(blurSize, 0, 100, 1, 12);
        // lowThreshold = map(lowThreshold, 0, 100, 0, 255);
        // highThreshold = map(highThreshold, 0, 100, 0, 255);
        
        // jsfeat.imgproc.grayscale(capture.pixels, w, h, buffer);
        // jsfeat.imgproc.gaussian_blur(buffer, buffer, blurSize, 0);
        // jsfeat.imgproc.canny(buffer, buffer, lowThreshold, highThreshold);
        // var n = buffer.rows * buffer.cols;
        
        // result = jsfeatToP5(buffer, result);
        // image(result, 0, 0, 640, 480);


        if (previousPixels) {

            // cheap way to ignore duplicate frames
            if (same(previousPixels, capture.pixels, 4, width)) {
                return;
            }

            flow.calculate(previousPixels, capture.pixels, capture.width, capture.height);
        }
        previousPixels = copyImage(capture.pixels, previousPixels);
        image(capture, 0, 0, w, h);

        if (flow.flow && flow.flow.u != 0 && flow.flow.v != 0) {
            uMotionGraph.addSample(flow.flow.u);
            vMotionGraph.addSample(flow.flow.v);

            strokeWeight(6);
            flow.flow.zones.forEach(function (zone) {
                stroke(map(zone.u, -step, +step, 188, 255),
                       map(zone.v, -step, +step, 0, 133), 100, map(zone.u, -step, +step, -40, 255));
                line(zone.x, zone.y, zone.x + zone.u, zone.y + zone.v);
                fill(100);
                rect(zone.x, zone.y, 100 + 100);
            })
        }

        noFill();
        strokeWeight(1);
        stroke(255, 100);

        // draw left-right motion
        uMotionGraph.draw(width, height / 4);
        line(0, 60, width, 60);

        // draw up-down motion
        translate(0, height / 2);
        vMotionGraph.draw(width, height / 1.35);
        line(0, 177, width, 177);
    }
}
