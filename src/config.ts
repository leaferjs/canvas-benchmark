import { engines } from './engines'
import type { IEngineInfo } from './engines'

interface IStringObject {
    [name: string]: string
}

const baseDir = '' // 部署的基础目录

export const siteConfig = {
    baseDir,
    largeImageUrl: baseDir + '/image/large.png', // 20000 * 20000px
}

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
        'image',
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
        image: 'image.1000*600px',
        largeImage: '⏳️large-image.20000*20000px',
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

export interface ICaseParams {
    total: number
    scene: 'create' | 'zoom' | 'move' | 'drag' | 'dynamic' | 'image' | 'largeImage' | 'svg' | 'largeSvg'
    mode: 'pointer' | 'draw'
    zoom: '100' | 'fit'
}


export interface ICaseConfig {
    id: string
    navId?: string
    firstTimeId?: string
    jsMemory?: string
    onCreated?: NoParamFunction
}

export interface NoParamFunction {
    (): void
}

export interface IDragPoint {
    x: number
    y: number
    direction: 'right' | 'left' | 'wait-right'
}

export interface IScaleData {
    value: number
    mode: 'in' | 'out' | 'wait-in' | 'wait-out'
}