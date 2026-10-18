const r = require("raylib");
const g = require("./geometry");

function setup() {
    const world = {
        windowWidth: 600,
        windowHeight: 500,
        origin: {},
        initialZ: {
            x: 0,
            y: 0,
        },
        scale: 200,
        iteration: 100,
    };

    world.origin.x = (2 * world.windowWidth) / 3;
    world.origin.y = world.windowHeight / 2;

    r.SetTraceLogLevel(r.LOG_NONE);
    r.InitWindow(world.windowWidth, world.windowHeight, "MANDELBROT");
    r.SetTargetFPS(2);

    return world;
}

function isStable(Z) {
    return Math.sqrt(g.square(Z.x) + g.square(Z.y)) < 2;
}

function drawMandelbrotPoint(world, Z, n, C) {
    while (n > 0) {
        if (!isStable(Z)) return;
        const aSq = g.square(Z.x);
        const bSq = g.square(Z.y);
        const ab = 2 * Z.x * Z.y;

        Z = {
            x: aSq - bSq + C.x,
            y: ab + C.y,
        };

        n--;
    }

    r.DrawCircle(
        world.origin.x + world.scale * C.x,
        world.origin.y + world.scale * C.y,
        1,
        r.WHITE,
    );
}

function isRunning() {
    return !r.WindowShouldClose();
}

function detectZoom(world) {
    const wheel = r.GetMouseWheelMove();
    const mouse = { x: r.GetMouseX(), y: r.GetMouseY() };

    const oldScale = world.scale;
    const newScale = Math.max(1, oldScale * Math.pow(1.1, wheel));

    const scaleRatio = newScale / oldScale;

    const newOrigin = r.Vector2Subtract(
        mouse,
        r.Vector2Scale(r.Vector2Subtract(mouse, world.origin), scaleRatio),
    );

    world.origin = newOrigin;
    world.scale = newScale;
}

function drawMandelbrot(world) {
    for (let i = -1.5; i < 1.5; i += 0.005) {
        for (let j = -2; j < 0.5; j += 0.005) {
            const C = {
                x: j,
                y: i,
            };

            drawMandelbrotPoint(world, world.initialZ, world.iteration, C);
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
