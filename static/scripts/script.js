window.addEventListener('load', function () {
    const c = document.getElementById('my-canvas');
    const cPicker = document.getElementById('color-picker');
    let ctx = c.getContext('2d');
    let curColor = cPicker.value;
    let ps = [];
    let objs = [];
    let mode = 'none';
    let isDrawing = false;
    let startX, startY, previewX, previewY;

    class Rectangle {
        constructor(x = 0, y = 0, width = 50, height = 50, color = curColor) {
            this.x = x;
            this.y = y;
            this.width = width
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
        constructor(ps, color = curColor) { // ps is a list of lists of (x,y) coordinates
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
    class Circle {
        constructor(x = 10, y = 10, radiusX = 10, radiusY = 10, color = curColor) {
            this.radiusX = radiusX;
            this.radiusY = radiusY;
            this.x = x;
            this.y = y;
            this.color = color;
        }
        draw() {
            this.bigint = parseInt(this.color.slice(1), 16);
            this.r = (this.bigint >> 16) & 255;
            this.g = (this.bigint >> 8) & 255;
            this.b = this.bigint & 255;
            ctx.fillStyle = `rgb(${this.r}, ${this.g}, ${this.b})`;
            ctx.beginPath();
            ctx.ellipse(this.x, this.y, this.radiusX, this.radiusY, 0, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    function loadIn() {
        let storedD = localStorage.getItem('shapes-drawn');
        let parsedObjs = storedD ? JSON.parse(storedD) : [];

        // Convert plain objects back to class instances
        objs = parsedObjs.map(obj => {
            if (obj.hasOwnProperty('ps')) {
                // It's a Triangle
                return new Triangle(obj.ps, obj.color);
            } else if (obj.hasOwnProperty('radiusX')) {
                // It's a Circle
                return new Circle(obj.x, obj.y, obj.radiusX, obj.radiusY, obj.color);
            } else {
                // It's a Rectangle
                return new Rectangle(obj.x, obj.y, obj.width, obj.height, obj.color);
            }
        });
        console.log(objs);

        // Draw the loaded objects
        objs.forEach(element => {
            element.draw();
        });
    }
    loadIn();

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
                ctx.clearRect(0, 0, c.width, c.height); // clear outline of preview
                objs.forEach(element => {
                    element.draw();
                });
                startX = e.offsetX;
                startY = e.offsetY;
                ps.push([startX, startY]);
                let curTri = new Triangle(ps, curColor);
                curTri.draw();
                objs.push(curTri);
                ps = [];
            }

        } else if (mode === 'circ') {
            if (!isDrawing) {
                isDrawing = true;
                startX = e.offsetX;
                startY = e.offsetY;
            }
            else {
                isDrawing = false;
                let rX = (startX - previewX) > 0 ? startX - previewX : -(startX - previewX)
                let rY = (startY - previewY) > 0 ? startY - previewY : -(startY - previewY)
                let curCirc = new Circle(startX + rX, startY, rX, rY, curColor);
                curCirc.draw();
                objs.push(curCirc);
            }

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
                previewX = e.offsetX;
                previewY = e.offsetY;
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
                for (let i = 0; i < ps.length; i++) {
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
            if (isDrawing) {
                previewX = e.offsetX;
                previewY = e.offsetY;
                let rX = (startX - previewX) > 0 ? startX - previewX : -(startX - previewX)
                let rY = (startY - previewY) > 0 ? startY - previewY : -(startY - previewY)
                let curCirc = new Circle(startX + rX, startY, rX, rY, curColor);
                ctx.clearRect(0, 0, c.width, c.height);
                objs.forEach(element => {
                    element.draw();
                });
                curCirc.draw();
            }
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
    window.addEventListener('beforeunload', function () {
        localStorage.setItem('shapes-drawn', JSON.stringify(objs));
    });

});

