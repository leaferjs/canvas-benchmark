// @ts-ignore
import Stats from 'stats.js'
import { getId, getUrlParam } from './h5'
import { siteConfig, enginesData } from '../config'


interface ICaseConfig {
    id: string
    onCreated?: NoParamFunction
}

interface NoParamFunction {
    (): void
}

interface IDragPoint {
    x: number
    y: number
    direction: 'right' | 'left' | 'wait-right'
}

interface IScaleData {
    value: number
    mode: 'in' | 'out' | 'wait-in' | 'wait-out'
}

const { defaultScene, defaultMode, defaultZoom, defaultTotal } = enginesData

export class Case {

    public config: ICaseConfig

    public params = {
        total: 1000,
        scene: 'create',
        mode: 'pointer',
        zoom: '100'
    }

    public imageConfig = {
        largeImageUrl: siteConfig.largeImageUrl
    }

    public flatChildren?: boolean
    public dynamicMode?: boolean

    public firstPaintStats: Stats
    public stats: Stats

    public app: any
    public canvas!: HTMLElement
    public view!: HTMLElement

    public created?: boolean
    public viewCompleted?: boolean

    public width = 1000
    public height = 500
    public startX = 0
    public startY = 60

    public contentBounds = { x: 0, y: 0, width: 0, height: 0 }
    public fitScale = 1

    public elements: any[] = []
    public dynamicPoints: IDragPoint[] = []

    public dragElement: any
    public dragElements: any[] = []
    public maxDragElements = 10

    public scaleData: IScaleData = { value: 1, mode: 'out' }
    public dragPoint: IDragPoint = { x: 0, y: 0, direction: 'right' }


    constructor(config: ICaseConfig) {
        this.config = config || {}
        window.addEventListener('load', async () => {
            this.view = config.id ? getId(config.id) : document.body
            const { width, height } = this.view.getBoundingClientRect()
            this.width = width
            this.height = height

            this.updateParams()
            this.updateContentBounds()

            this.createFirstPaintStats()
            this.createStats()

            this.firstPaintStart()

            await this.create()
            this.createAnimate()
        })
    }

    // create elements

    public async create() { }

    public async createContent() {
        switch (this.params.scene) {
            case 'image':
                await this.createImages()
                break
            case 'largeImage':
                await this.createLargeImage()
                this.params.total = 1
                break
            case 'svg':
                await this.createSvgImages()
                break
            case 'largeSvg':
                await this.createLargeSvgImage()
                break
            default:
                this.createRects()
        }
        this.created = true
    }

    public createRects(): void { }

    public async createImages() { }

    public async createLargeImage() { }

    public async createSvgImages() { }

    public async createLargeSvgImage() { }

    // stats

    public createStats() {
        const stats = this.stats = new Stats()
        const dom = stats.dom as HTMLDivElement
        dom.style.pointerEvents = 'none'
        dom.style.left = '20px'
        dom.style.top = '180px'
        dom.style.display = 'flex'
        const children = dom.childNodes as any as HTMLCanvasElement[]
        children.forEach((item) => { item.style.display = 'block' })
        children[1].style.display = 'none'
        document.body.appendChild(stats.dom)
    }

    public createFirstPaintStats() {
        const stats = this.firstPaintStats = new Stats()
        stats.showPanel(1)
        const dom = stats.dom as HTMLDivElement
        dom.style.pointerEvents = 'none'
        dom.style.left = '180px'
        dom.style.top = '180px'
        dom.style.display = 'flex'
        document.body.appendChild(dom)
    }

    // first paint

    public firstPaintStart() {
        this.firstPaintStats.begin()
    }

    public firstPaintEnd() {
        requestAnimationFrame(() => {
            this.firstPaintStats.end()
            if (this.params.zoom === 'fit') {
                this.setAppScale(this.fitScale, 0, 0)
                requestAnimationFrame(() => {
                    this.viewCompleted = true
                })
            } else {
                this.viewCompleted = true
            }
        })
    }

    // set

    public setAppScale(_scale: number, _x: number, _y: number): void { }

    public setAppPosition(_x: number, _y: number): void { }

    public setElementScale(_element: any, _scale: number, _x?: number, _y?: number): void { }

    public setElementPosition(_element: any, _x: number, _y: number): void { }

    // get

    public updateParams() {
        const { params } = this
        params.scene = getUrlParam('scene') || defaultScene
        params.mode = getUrlParam('mode') || defaultMode
        params.zoom = getUrlParam('zoom') || defaultZoom
        params.total = Number(getUrlParam('total')) || defaultTotal

        switch (params.scene) {
            case 'drag':
                this.startY += 10
                break
            case 'dynamic':
                this.flatChildren = true
                this.dynamicMode = true
                break
            case 'pan':
                if (params.zoom === 'fit') this.dragPoint.direction = 'wait-right'
                break
        }
    }

    public updateDragElements() { }

    public updateElements() { }

    public updateContentBounds() {
        const { contentBounds, width, height, params } = this
        switch (params.scene) {
            case 'largeImage':
                contentBounds.width = 20000
                contentBounds.height = 20000
                break
            default:
                const { tenThousand, thousand, size, column } = this.getCreateLayout()
                contentBounds.width = tenThousand < column ? tenThousand * size : column * size
                contentBounds.height = tenThousand < column ? (thousand ? thousand / 10 * size : size) : Math.ceil(tenThousand / column) * size
        }
        this.fitScale = Math.min(width / contentBounds.width, height / contentBounds.height)
    }

    // animate

    public createAnimate() {
        const animate = () => {
            this.stats.update()
            if (this.viewCompleted) this.animate()
            requestAnimationFrame(animate)
        }
        animate()
    }

    public animate() {
        const { scene, mode } = this.params
        switch (scene) {
            case 'zoom':
            case 'largeImage':
                this.zoomAnimate()
                break
            case 'pan':
                this.panAnimate()
                break
            case 'drag':
                this.dragAnimate()
                break
            case 'dynamic':
                this.dynamicAnimate()
                break
        }
        if (mode === 'pointer' && scene !== 'create') this.simulatePointerEvent()
    }

    // scene

    public zoomAnimate() {
        const { scaleData } = this

        if (scaleData.value >= this.fitScale) {

            if (!scaleData.mode.includes('out')) {
                scaleData.mode = 'wait-out'
                setTimeout(() => {
                    scaleData.mode = 'out'
                }, Math.max(this.params.total / 10000 * 39))
            }

        } else if (scaleData.value < this.fitScale / 2) {

            if (!scaleData.mode.includes('in')) {
                scaleData.mode = 'wait-in'
                setTimeout(() => {
                    scaleData.mode = 'in'
                }, Math.max(this.params.total / 10000 * 39, 200))
            }

        }

        if (!scaleData.mode.includes('wait')) {
            scaleData.value *= scaleData.mode === 'in' ? 1.05 : 0.95
            this.setAppScale(scaleData.value, 0, 0)
        }
    }

    public panAnimate() {
        const { dragPoint } = this
        if (dragPoint.direction === 'wait-right') {
            setTimeout(() => {
                dragPoint.direction = 'right'
            }, 200)
        }

        if (!dragPoint.direction.includes('wait')) {
            this.autoDragPoint(this.dragPoint)
            this.setAppPosition(this.dragPoint.x, this.dragPoint.y)
        }
    }

    public dragAnimate() {
        if (!this.dragElement) this.updateDragElements()
        this.autoDragPoint(this.dragPoint)
        this.setElementPosition(this.dragElement, this.dragPoint.x, this.dragPoint.y)
    }

    public dynamicAnimate() {
        if (!this.elements.length) {
            this.updateElements()
            const { width, height } = this
            for (let i = 0, len = this.elements.length; i < len; i++) {
                this.dynamicPoints.push({
                    x: Math.ceil(Math.random() * width),
                    y: Math.ceil(Math.random() * height),
                    direction: 'right'
                })
            }
        }

        const { dynamicPoints, elements } = this
        let point: IDragPoint
        for (let i = 0, len = dynamicPoints.length; i < len; i++) {
            point = dynamicPoints[i]
            this.autoDragPoint(point)
            this.setElementPosition(elements[i], point.x, point.y)
        }
    }

    // helper

    public getCreateLayout() {
        const { total } = this.params
        const tenThousand: number = Math.ceil(total / 10000)
        const thousand: number = total / 1000 % 10
        const size = 10 * 100 * 1.5
        const column = tenThousand > 25 ? 10 : 5
        return { tenThousand, thousand, size, column, x: this.startX, y: this.startY }
    }

    public getRotationColor(rotation: number): string {
        return 'hsl(' + (rotation + 10) % 360 + ',70%,50%)'
    }

    public autoDragPoint(point: IDragPoint) {
        if (point.x > this.width) {
            point.direction = 'left'
        } else if (point.x < 0) {
            point.direction = 'right'
        }

        const rand = this.params.scene === 'drag' ? 1 : Math.random()
        point.x += Math.ceil(rand * (point.direction === 'right' ? 20 : -20))
    }

    // simulated reality interaction
    public simulatePointerEvent() {
        for (let i = 0; i < 2; i++) {
            const event = new PointerEvent('pointermove', {
                clientX: Math.random() * 1000,
                clientY: Math.random() * 1000,
                bubbles: true,
                cancelable: true,
                view: window
            })
            this.canvas.dispatchEvent(event)
        }
    }

}