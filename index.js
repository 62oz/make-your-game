
class GridSystem {
    constructor(matrix) {
        this.matrix = matrix;
        this.uiContext = this.drawArea(420, 580, "#111")
        this.outlineContext = this.drawArea(320, 480, "#444")
        this.topContext = this.drawArea(320, 480, "#111", true)
        this.cellSize = 30;
        this.padding = 4;
    }


    getCenter(w, h) {
        return {
            x: window.innerWidth / 2 - w / 2 + "px",
            y: window.innerHeight / 2 - h / 2 + "px"
        }
    }

   /*  What is HTML Canvas?

The HTML <canvas> element is used to draw graphics, on the fly, via JavaScript.

The <canvas> element is only a container for graphics. You must use JavaScript to actually draw the graphics.

Canvas has several methods for drawing paths, boxes, circles, text, and adding images. */

    //Draw area is used to make canvases that we will have many on top of each other
    // if I understood right
    //Those with = means default value
    drawArea(w, h, color = "#111", isTransparent = false) {
        this.canvas = document.createElement("canvas")
        /* What is context? Context is always the value of the this keyword
         which is a reference to the object that “owns” the currently
          executing code or the function where it's looked at. */
        this.context = this.canvas.getContext("2d")
        this.width = this.canvas.width = w;
        this.height = this.canvas.height = h;
        this.canvas.style.position = "absolute";
        this.canvas.style.background = color;

        if (isTransparent) {
            this.canvas.style.backgroundColor = "transparent"; 
        }
        //Let's center this:
        const center = this.getCenter(w, h)
        this.canvas.style.marginLeft = center.x
        this.canvas.style.marginTop = center.y

        document.body.appendChild(this.canvas);

        return this.context;
    }
}

const gridMatrix = [
    [1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1]
];

const gridSystem = new GridSystem(gridMatrix)