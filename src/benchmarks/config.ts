interface IStringObject {
    [name: string]: string
}

const baseDir = '' // 部署的基础目录

export const siteConfig = {
    baseDir,
    largeImageUrl: baseDir + '/image/large.png', // 20000 * 20000px
}

export const enginesData = {
    engineList: [
        'pixi',
        'konva',
        'fabric',
        'svg',
        'html',
        'leafer',
        //'pxgrow'
    ],
    engineSiteMap: {
        pixi: 'https://pixijs.com',
        konva: 'https://konvajs.org',
        fabric: 'https://fabricjs.com',
        svg: 'https://developer.mozilla.org/en-US/docs/Web/SVG',
        html: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
        leafer: 'https://www.leaferjs.com',
        pxgrow: 'https://www.pxgrow.com',
    } as IStringObject,
    engineNameMap: {
        pixi: 'PixiJS',
        konva: 'Konva.js',
        fabric: 'Fabric.js',
        svg: 'SVG',
        html: ' HTML',
        leafer: 'LeaferJS',
        pxgrow: 'PxGrow',
    } as IStringObject,
    engineColorMap: {
        pixi: '#E72264',
        konva: '#0D83CD',
        fabric: '#0d50cdff',
        svg: '#ff7b00ff',
        html: '#f60000ff',
        leafer: '#32cd79',
        pxgrow: '#ff5676',
    } as IStringObject,


    // interactive
    modeList: [
        'pointer',
        'draw',
    ],
    defaultMode: 'pointer',
    modeNameMap: {
        'pointer': 'pointer',
        'draw': 'draw',
    } as IStringObject,

    sceneList: [
        'create',
        'zoom',
        'pan',
        'drag',
        'dynamic',
        // 'image',
        'largeImage',
        // 'svg',
        // 'largeSvg',
    ],
    defaultScene: 'create',
    sceneNameMap: {
        create: 'create',
        zoom: 'zoom',
        pan: 'pan',
        drag: 'drag',
        dynamic: 'dynamic',
        image: 'image',
        largeImage: '⏳️large-image',
        svg: 'svg-image',
        largeSvg: 'large-svg-image',
    } as IStringObject,

    zoomList: [
        '100',
        'fit',
    ],
    defaultZoom: '100',
    zoomNameMap: {
        '100': '100%',
        'fit': 'fit'
    } as IStringObject,

    // 元素数量
    totalList: [
        1000,
        2000,
        4000,
        8000,
        10000,
        16000,
        32000,
        64000,
        100000,
        128000,
        256000,
        512000,
        1000000,
        1024000,
        2048000
    ],
    defaultTotal: 1000,
    totalNameMap: {
        1000: '1000',
        2000: '2000',
        4000: '4000',
        8000: '8000',
        10000: '❗10000',
        16000: '16000',
        32000: '32000',
        64000: '64000',
        100000: '⚠️100000',
        128000: '128000',
        256000: '256000',
        512000: '512000',
        1000000: '‼️1000000',
        1024000: '1024000',
        2048000: '2048000',
    } as IStringObject,
}


