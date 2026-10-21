const r = require("raylib");
const g = require("./geometry");

function setup() {
    const world = {
        windowWidth: 600,
        windowHeight: 500,
        origin: {},
        initialZ: {
            r: 0,
            i: 0,
        },
        scale: 0.01,
        iteration: 100,
    };

    world.origin.x = world.windowWidth / 2;
    world.origin.y = world.windowHeight / 2;

    r.SetTraceLogLevel(r.LOG_NONE);
    r.InitWindow(world.windowWidth, world.windowHeight, "MANDELBROT");
    r.SetTargetFPS(60);

    return world;
}

function isStable(Z) {
    return g.square(Z.r) + g.square(Z.i) < 4;
}

function toComplex(x, y) {
    return {
        r: x,
        i: y,
    };
}

function addComplex(C1, C2) {
    return {
        r: C1.r + C2.r,
        i: C1.i + C2.i,
    };
}

function mulComplex(C1, C2) {
    return {
        r: C1.r * C2.r - C1.i * C2.i,
        i: C1.r * C2.i + C1.i * C2.r,
    };
}

function isMandlebrotPoint(Z, n, C) {
    while (n > 0) {
        if (!isStable(Z)) return false;
        const Zsq = mulComplex(Z, Z);

        Z = addComplex(Zsq, C);
        n--;
    }

    return true;
}


function detectZoom(world) {
    const wheel = r.GetMouseWheelMove();
    if (wheel === 0) return;

    const mouse = {
        x: r.GetMouseX(),
        y: r.GetMouseY(),
    };

    const oldScale = world.scale;
    const zoomFactor = Math.pow(1.1, wheel);
    const newScale = Math.max(0.0000000000001, oldScale / zoomFactor);

    const scaleRatio = oldScale / newScale;

    world.origin = {
        x: mouse.x - (mouse.x - world.origin.x) * scaleRatio,
        y: mouse.y - (mouse.y - world.origin.y) * scaleRatio,
    };

    world.scale = newScale;
}


function isRunning() {
    return !r.WindowShouldClose();
}

function drawMandelbrot(world) {
    for (let y = 0; y < world.windowHeight; y++) {
        for (let x = 0; x < world.windowWidth; x++) {
            const posX = x - world.origin.x;
            const posY = y - world.origin.y;

            const C = toComplex(world.scale * posX, world.scale * posY);

            if (isMandlebrotPoint(world.initialZ, world.iteration, C))
                r.DrawPixel(
                    world.origin.x + posX,
                    world.origin.y + posY,
                    r.WHITE,
                );
        }
    }
}

function draw(world) {
    r.BeginDrawing();
    r.ClearBackground(r.BLACK);

    drawMandelbrot(world);
    detectZoom(world);

    r.EndDrawing();
}

function update(world) {}

function tearDown() {
    r.CloseWindow();
}

module.exports = {
    setup,
    isRunning,
    draw,
    update,
    tearDown,
};
