export interface IStringObject {
    [name: string]: string
}

export interface IEngineInfo {
    name: string,
    title: string,
    color: string,
    link: string
}


const baseDir = '' // 部署的基础目录

export const siteConfig = {
    baseDir,
    largeImageUrl: baseDir + '/image/large.png', // 20000 * 20000px
}


const engines: IEngineInfo[] = [
    { name: 'pixi', title: 'PixiJS', color: '#E72264', link: 'https://pixijs.com' },
    { name: 'konva', title: 'Konva.js', color: '#0D83CD', link: 'https://konvajs.org' },
    { name: 'fabric', title: 'Fabric.js', color: '#0d50cdff', link: 'https://fabricjs.com' },
    { name: 'svg', title: 'SVG', color: '#ff7b00ff', link: 'https://developer.mozilla.org/en-US/docs/Web/SVG' },
    { name: 'html', title: 'HTML', color: '#f60000ff', link: 'https://developer.mozilla.org/en-US/docs/Web/HTML' },
    { name: 'leafer', title: 'LeaferJS', color: '#32cd79', link: 'https://www.leaferjs.com' }
]


const engineList: string[] = []
const engineNameMap: IStringObject = {}
const engineColorMap: IStringObject = {}
const engineSiteMap: IStringObject = {}

engines.forEach(item => addEngine(item))

export function addEngine(item: IEngineInfo): void {
    engineList.push(item.name)
    engineNameMap[item.name] = item.title
    engineColorMap[item.name] = item.color
    engineSiteMap[item.name] = item.link
}

export const enginesData = {

    engines,

    engineList,
    engineNameMap,
    engineColorMap,
    engineSiteMap,

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
        'move',
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
        move: 'move',
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