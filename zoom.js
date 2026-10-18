const r = require("raylib");
const g = require("./geometry");

function setup() {
    const world = {
        windowWidth: 500,
        windowHeight: 400,
        scale: 1,
        origin: {},
        width: 100,
        height: 100,
    };

    world.origin.x = world.windowWidth / 2;
    world.origin.y = world.windowHeight / 2;

    r.SetTraceLogLevel(r.LOG_NONE);
    r.InitWindow(world.windowWidth, world.windowHeight, "ZOOM");
    r.SetTargetFPS(60);

    return world;
}

function isRunning() {
    return !r.WindowShouldClose();
}

function detectZoom(world) {
    // Onew = Mouse - (Mouse - Oold) * (ScaleNew / ScaleOld);

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

function draw(world) {
    r.BeginDrawing();
    r.ClearBackground(r.BLACK);
    detectZoom(world);

    r.DrawRectangle(
        world.origin.x,
        world.origin.y,
        Math.max(world.scale * 50, 50),
        Math.max(world.scale * 50, 50),
        r.RED,
    );

    r.EndDrawing();
}

function update(world) {}

function tearDown() {
    r.CloseWindow();
}

function loop(world) {
    while (isRunning()) {
        draw(world);
        update(world);
    }
}

function main() {
    const world = setup();
    loop(world);
    tearDown();
}

main();
