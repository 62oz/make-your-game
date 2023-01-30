
class GridSystem {
    constructor(matrix) {
        this.matrix = matrix;
    }

   /*  What is HTML Canvas?

The HTML <canvas> element is used to draw graphics, on the fly, via JavaScript.

The <canvas> element is only a container for graphics. You must use JavaScript to actually draw the graphics.

Canvas has several methods for drawing paths, boxes, circles, text, and adding images. */

    //Draw area is used to make canvases that we will have many on top of each other
    // if I understood right
    //Those with = means default value
    //Flag for transparent or not
    drawArea(w, h, color = "#111", flag = false) {
        this.canvas = document.createElement("canvas")
        this.context = this.canvas.getContext("2d")
        this.width = this.canvas.width = w;
        this.height = this.canvas.height = h;
        this.canvas.style.position = "aboslute"
        this.canvas.style.background = color;
    }
}

const matrix = [
    [1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1]
];