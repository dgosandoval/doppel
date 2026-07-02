// Cápsula producto: splat auto-hospedado del CF-100 (avión memorial, CC BY),
// navegación orbital con CameraControls y encuadre automático según el aabb.
import * as pc from 'playcanvas';
import { CameraControls } from 'playcanvas/scripts/esm/camera-controls.mjs';
import { deviceType } from 'examples/context';

const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('application-canvas'));
window.focus();

const gfxOptions = {
    deviceTypes: [deviceType, 'webgl2'],
    antialias: false
};

const device = await pc.createGraphicsDevice(canvas, gfxOptions);
device.maxPixelRatio = pc.platform.mobile ? 1 : Math.min(window.devicePixelRatio, 1.25);

const createOptions = new pc.AppOptions();
createOptions.graphicsDevice = device;
createOptions.mouse = new pc.Mouse(document.body);
createOptions.touch = new pc.TouchDevice(document.body);

createOptions.componentSystems = [
    pc.RenderComponentSystem,
    pc.CameraComponentSystem,
    pc.LightComponentSystem,
    pc.ScriptComponentSystem,
    pc.GSplatComponentSystem
];
createOptions.resourceHandlers = [pc.TextureHandler, pc.ContainerHandler, pc.ScriptHandler, pc.GSplatHandler];

const app = new pc.AppBase(canvas);
app.init(createOptions);
app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
app.setCanvasResolution(pc.RESOLUTION_AUTO);

const resize = () => app.resizeCanvas();
window.addEventListener('resize', resize);
app.on('destroy', () => {
    window.removeEventListener('resize', resize);
});

const assets = {
    splat: new pc.Asset('cf100', 'gsplat', { url: '/latam360/assets/splats/cf100-lite.sog' })
};

const assetListLoader = new pc.AssetListLoader(Object.values(assets), app.assets);
assetListLoader.load(() => {
    app.start();

    const ent = new pc.Entity('cf100');
    ent.addComponent('gsplat', { asset: assets.splat });
    ent.setLocalEulerAngles(180, 0, 0); // convención SuperSplat (ajustar si sale invertido)
    app.root.addChild(ent);

    const camera = new pc.Entity('camera');
    camera.addComponent('camera', {
        clearColor: new pc.Color(0.05, 0.04, 0.09),
        fov: 65,
        toneMapping: pc.TONEMAP_ACES
    });
    camera.setLocalPosition(10, 3, 10);
    app.root.addChild(camera);
    camera.addComponent('script');
    const cc = /** @type {any} */ (camera.script.create(CameraControls));
    Object.assign(cc, {
        sceneSize: 10,
        enableOrbit: true,
        enablePan: true,
        enableFly: true // habilita WASD (el teclado de CameraControls solo actúa en fly)
    });

    // Encuadre automático: cuando el aabb del splat está listo, posiciona la cámara
    // a distancia proporcional y enfoca el centro.
    let framed = false;
    app.on('update', () => {
        if (framed) return;
        const inst = ent.gsplat && ent.gsplat.instance;
        const box = inst && inst.aabb;
        if (!box || box.halfExtents.length() === 0) return;
        framed = true;
        const c = box.center;
        const r = Math.max(2, box.halfExtents.length());
        camera.setPosition(c.x + r * 0.85, c.y + r * 0.3, c.z + r * 0.85);
        camera.lookAt(c.x, c.y, c.z);
        cc.sceneSize = r;
        cc.focusPoint = new pc.Vec3(c.x, c.y, c.z);
    });
});

// --- LATAM360 teardown hook ---
try { if (typeof window !== "undefined" && window.__l360) window.__l360.register(app); } catch (e) {}
