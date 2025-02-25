window.addEventListener('load', function () {
    const c = this.document.getElementById('my-canvas');
    const cPicker = this.document.getElementById('color-picker')
    let ctx = c.getContext('2d');
    let curColor = "#000000";
    let objs = [];
    cPicker.addEventListener('change', function() {
        curColor = cPicker.value;
    });

    // Change color
    c.addEventListener('click',function(e){
        // Convert hex color (#RRGGBB) to rgb string
        
        const rect = c.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const bigint = parseInt(curColor.slice(1), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        
        ctx.fillRect(x, y, 50,50);
    })

});