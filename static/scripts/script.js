window.addEventListener('load', function () {
    const c = document.getElementById('my-canvas');
    const cPicker = document.getElementById('color-picker');
    let ctx = c.getContext('2d');
    let curColor = cPicker.value;
    let objs = [];
    let ps = [];
    let mode = 'none';
    let isDrawing = false;
    let startX, startY, previewX, previewY;
    class Rectangle {
        constructor(x = 0, y = 0, width = 50, height = 50, color = curColor) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.color = color;
        }
        draw() {
            this.bigint = parseInt(this.color.slice(1), 16);
            this.r = (this.bigint >> 16) & 255;
            this.g = (this.bigint >> 8) & 255;
            this.b = this.bigint & 255;
            ctx.fillStyle = `rgb(${this.r}, ${this.g}, ${this.b})`;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    class Triangle {
        constructor(ps, color = curColor) { // ps is a list of tuples of (x,y) coordinates
            this.ps = ps;
            this.color = color;
        }
        draw() {
            this.bigint = parseInt(this.color.slice(1), 16);
            this.r = (this.bigint >> 16) & 255;
            this.g = (this.bigint >> 8) & 255;
            this.b = this.bigint & 255;
            ctx.fillStyle = `rgb(${this.r}, ${this.g}, ${this.b})`;
            ctx.beginPath();
            ctx.moveTo(this.ps[0][0], this.ps[0][1]);
            ctx.lineTo(this.ps[1][0], this.ps[1][1]);
            ctx.lineTo(this.ps[2][0], this.ps[2][1]);
            ctx.closePath();
            ctx.fill();
        }
    }
    // class Circle {
    //     constructor(x = 0, y = 0, width = 50, height = 50, color = curColor) {
    //         this.x = x;
    //         this.y = y;
    //         this.width = width;
    //         this.height = height;
    //         this.bigint = parseInt(color.slice(1), 16);
    //         this.r = (this.bigint >> 16) & 255;
    //         this.g = (this.bigint >> 8) & 255;
    //         this.b = this.bigint & 255;
    //         this.color = `rgb(${this.r}, ${this.g}, ${this.b})`;
    //     }
    //     draw() {
    //         ctx.fillStyle = color;
    //         ctx.fillRect(this.x, this.y, this.width, this.height);
    //     }
    //     drawPreview(){
    //         ctx.setLineDash([5, 5]); // Dashed line for preview
    //         ctx.strokeStyle = "black"
    //         ctx.fillRect(this.x, this.y, this.width, this.height)
    //     }
    // }


    cPicker.addEventListener('change', function () {
        curColor = cPicker.value;
    });

    c.addEventListener('mousedown', function (e) {
        if (mode === 'rect') {
            if (!isDrawing) {
                isDrawing = true;
                startX = e.offsetX;
                startY = e.offsetY;

            } else {
                isDrawing = false;
                let curRect = new Rectangle(startX, startY, previewX - startX, previewY - startY, curColor);
                curRect.draw();
                objs.push(curRect);
            }

        } else if (mode === 'tri') {
            if (ps.length < 2) {
                isDrawing = true;
                startX = e.offsetX;
                startY = e.offsetY;
                ps.push([startX, startY]);
                console.log(`adding ${ps}`)
            } else {
                isDrawing = false;
                ctx.clearRect(0, 0, c.width, c.height);
                objs.forEach(element => {
                    element.draw();
                });
                startX = e.offsetX;
                startY = e.offsetY;
                ps.push([startX, startY]);
                console.log(`Done ${ps}`)
                let curTri = new Triangle(ps, curColor);
                curTri.draw();
                objs.push(curTri);
                ps = [];
            }

        } else if (mode === 'circ') {
        } else {

        }
    });

    c.addEventListener('mousemove', function (e) {
        if (mode === 'rect') {
            if (isDrawing) {
                previewX = e.offsetX;
                previewY = e.offsetY;
                let curRect = new Rectangle(startX, startY, previewX - startX, previewY - startY, curColor);
                ctx.clearRect(0, 0, c.width, c.height);
                objs.forEach(element => {
                    element.draw();
                });
                curRect.draw();
            }
        } else if (mode === 'tri') {
            if (isDrawing) {
                let last = ps.length - 1;
                previewX = e.offsetX;
                previewY = e.offsetY;
                // we have last elemnt stored, ps[-1] we make line from there to mouse
                ctx.clearRect(0, 0, c.width, c.height);
                objs.forEach(element => {
                    element.draw();
                });
                ctx.beginPath();
                let bigint = parseInt(curColor.slice(1), 16);
                let r = (bigint >> 16) & 255;
                let g = (bigint >> 8) & 255;
                let b = (bigint & 255);
                ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`;
                for (let i = 0; i <= last; i++) {
                    if (i > 0) {
                        ctx.moveTo(ps[0][0], ps[0][1]);
                        ctx.lineTo(ps[1][0], ps[1][1]);
                    }
                    ctx.moveTo(ps[i][0], ps[i][1]);
                    ctx.lineTo(previewX, previewY);
                    ctx.stroke();
                }


            }
        } else if (mode === 'circ') {
        } else {

        }
    })

    document.getElementById('rectangle-button')
        .addEventListener('click', function () {
            mode = 'rect';
        });
    document.getElementById('triangle-button')
        .addEventListener('click', function () {
            ps = [];
            mode = 'tri';
        });
    document.getElementById('circle-button')
        .addEventListener('click', function () {
            mode = 'circ';
        });

    document.getElementById('undo-button')
        .addEventListener('click', function () {
            ps = [];
            objs.pop();
            ctx.clearRect(0, 0, c.width, c.height);
            objs.forEach(element => {
                element.draw();
            });
        });
    document.getElementById('clear-button')
        .addEventListener('click', function () {
            ctx.clearRect(0, 0, c.width, c.height);
            objs = [];
            mode = 'none';
        });

});