const r = require("raylib");

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
        iteration: 75,
    };

    world.origin.x = (2 * world.windowWidth) / 3;
    world.origin.y = world.windowHeight / 2;

    r.SetTraceLogLevel(r.LOG_NONE);
    r.InitWindow(world.windowWidth, world.windowHeight, "MANDELBROT");
    r.SetTargetFPS(30);

    return world;
}

function square(x) {
    return x * x;
}

function isStable(Z) {
    return Math.sqrt(square(Z.x) + square(Z.y)) < 2;
}

function drawMandelbrot(world, Z, n, C) {
    // Originally I was thinking I need to draw path of Z, but actually we want to test if C is a point in mandelbrot set.
    while (n > 0) {
        // if mandelbrot is not stable, then return early, the test has failed
        if (!isStable(Z)) return;
        const aSq = square(Z.x);
        const bSq = square(Z.y);
        const ab = 2 * Z.x * Z.y;

        Z = {
            x: aSq - bSq + C.x,
            y: ab + C.y,
        };

        n--;
    }

    // Draw the C pixel only if the iterations have been exhausted. This means the test has passed!!
    r.DrawPixel(
        world.origin.x + world.scale * C.x,
        world.origin.y + world.scale * C.y,
        r.WHITE,
    );
}

function isRunning() {
    return !r.WindowShouldClose();
}

function draw(world) {
    r.BeginDrawing();
    r.ClearBackground(r.BLACK);

    for (let i = -5; i < 5; i += 0.005) {
        for (let j = -5; j < 5; j += 0.005) {
            const C = {
                x: j,
                y: i,
            };

            drawMandelbrot(world, world.initialZ, world.iteration, C);
        }
    }

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
