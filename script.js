document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("bubbleCanvas");
    const ctx = canvas.getContext("2d");
    const resetButton = document.getElementById("resetButton");

    // Define circles and arrows
    const circles = [
        { x: 70, y: 60, radius: 30, color: "red", hitColor: "brown", arrow: null },
        { x: 70, y: 160, radius: 30, color: "blue", hitColor: "yellow", arrow: null },
        { x: 70, y: 260, radius: 30, color: "green", hitColor: "violet", arrow: null },
        { x: 70, y: 360, radius: 30, color: "orange", hitColor: "purple", arrow: null }
    ];

    // Function to draw everything
    function drawScene() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        circles.forEach(circle => {
            drawCircle(circle);
            drawArrow(circle);
        });
    }

    // Draw a circle
    function drawCircle(circle) {
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.fillStyle = circle.color;
        ctx.fill();
        ctx.closePath();
    }

    // Draw a **bold** left-facing arrow
    function drawArrow(circle) {
        const arrow = circle.arrow || { x: 250, y: circle.y };
        ctx.beginPath();
        ctx.moveTo(arrow.x, arrow.y);
        ctx.lineTo(arrow.x - 40, arrow.y); // Arrow shaft
        ctx.moveTo(arrow.x - 40, arrow.y);
        ctx.lineTo(arrow.x - 30, arrow.y - 10); // Left arrowhead
        ctx.moveTo(arrow.x - 40, arrow.y);
        ctx.lineTo(arrow.x - 30, arrow.y + 10);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 4; // **Bold arrow**
        ctx.stroke();
        ctx.closePath();
    }

    // Move the entire arrow **from right to left** & stop at circle boundary
    function animateArrow(circle) {
        if (circle.arrow === null) {
            circle.arrow = { x: 250, y: circle.y, speed: 5 };
        }

        function moveArrow() {
            const stopX = circle.x + circle.radius + 43; // **Stop at circle boundary**
            if (circle.arrow.x > stopX) {
                circle.arrow.x -= circle.arrow.speed; // Move left
                drawScene();
                requestAnimationFrame(moveArrow);
            } else {
                // Change color when arrow reaches boundary
                circle.color = circle.hitColor;
                drawScene();
            }
        }
        moveArrow();
    }

    // Detect click on circles
    canvas.addEventListener("click", function (event) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        circles.forEach(circle => {
            const dx = mouseX - circle.x;
            const dy = mouseY - circle.y;
            if (Math.sqrt(dx * dx + dy * dy) < circle.radius) {
                animateArrow(circle);
            }
        });
    });

    // Reset the application
    resetButton.addEventListener("click", function () {
        circles.forEach(circle => {
            circle.color = circle.hitColor === "brown" ? "red" :
                           circle.hitColor === "yellow" ? "blue" :
                           circle.hitColor === "violet" ? "green" : "orange";
            circle.arrow = null;
        });
        drawScene();
    });

    drawScene();
});
