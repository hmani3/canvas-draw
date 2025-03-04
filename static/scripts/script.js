window.addEventListener('load', function () {
    const c = document.getElementById('my-canvas');
    const cPicker = document.getElementById('color-picker');
    let ctx = c.getContext('2d');
    let curColor = cPicker.value;
    let objs = [];

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
    class Circle {
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


    cPicker.addEventListener('change', function () {
        curColor = cPicker.value;
    });

    // Change color
    c.addEventListener('click', function (e) {
        // Convert hex color (#RRGGBB) to rgb string
        const rect = c.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        let square = new Rectangle(x, y, 100, 100, curColor);
        square.draw();
        objs.push(square);
        console.log(objs);
    })
    document.getElementById('undo-button')
    .addEventListener('click', function () {
        objs.pop();
        ctx.clearRect(0, 0, c.width, c.height);
        objs.forEach(element => {
            element.draw();
        });
    })
    document.getElementById('clear-button')
    .addEventListener('click',function(){
        ctx.clearRect(0, 0, c.width, c.height);
        objs=[];
    })

});