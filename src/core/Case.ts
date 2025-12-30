// @ts-ignore
import Stats from 'stats.js'
import { getId, getUrlParam } from './h5'
import { siteConfig, enginesData } from '../config'
import type { ICaseParams, ICaseConfig, IScaleData, IDragPoint } from '../config'


const { defaultScene, defaultMode, defaultZoom, defaultTotal } = enginesData

export class Case {

    public config: ICaseConfig = {
        id: 'view',
        navId: 'nav',
        jsMemory: 'js-memory',
        firstTimeId: 'first-time',
    }

    public params: ICaseParams = {
        total: 1000,
        scene: 'create',
        mode: 'pointer',
        zoom: '100'
    }

    public imageConfig = {
        largeImageUrl: siteConfig.largeImageUrl,
        largeImageWidth: 20000,
        largeImageHeight: 20000,
    }

    public top = 180

    public width = 1000
    public height = 500

    public startX = 0
    public startY = 60

    public nodeWidth = 10
    public nodeHeight = 10

    public maxDragNodes = 10
    public maxScale = 3

    public endFirstPaintAfterCreate?: boolean

    public flatChildren?: boolean
    public dynamicMode?: boolean

    public firstPaintStats: Stats
    public stats: Stats

    public app: any
    public canvas!: HTMLElement
    public view!: HTMLElement
    public rootNode!: any

    public created?: boolean
    public viewCompleted?: boolean

    public fitScale = 1
    public contentBounds = { x: 0, y: 0, width: 0, height: 0 }

    public nodes: any[] = []
    public dynamicPoints: IDragPoint[] = []

    public dragNode: any
    public dragNodes: any[] = []

    public scaleData: IScaleData = { value: 1, mode: 'out' }
    public dragPoint: IDragPoint = { x: 0, y: 0, direction: 'right' }


    constructor(config?: ICaseConfig) {
        Object.assign(this.config, config || {})
        window.addEventListener('load', async () => {
            this.view = this.config.id ? getId(this.config.id) : document.body
            this.updateView()
            requestAnimationFrame(async () => await this.init())
        })
        window.addEventListener('beforeunload', () => {
            this.destroy()
        })
    }


    public async init() {
        this.updateParams()
        this.updateContentBounds()

        this.createFirstPaintStats()
        this.createStats()

        this.firstPaintStart()

        await this.createApp()
        await this.createContent()

        if (this.endFirstPaintAfterCreate) this.firstPaintEnd()

        this.defineViewCompleted()

        this.createAnimate()
    }

    public updateView(): void {
        const nav = getId(this.config.navId!).getBoundingClientRect()
        this.top = Math.ceil(nav.height)
        this.view.style.top = this.top + 'px'

        const { width, height } = this.view.getBoundingClientRect()
        this.width = width
        this.height = height
    }

    public updateParams(): void {
        const { params } = this
        params.scene = getUrlParam('scene') || defaultScene as any
        params.mode = getUrlParam('mode') || defaultMode as any
        params.zoom = getUrlParam('zoom') || defaultZoom as any
        params.total = Number(getUrlParam('total')) || defaultTotal as any

        switch (params.scene) {
            case 'image':
                this.startY = 0
                this.params.total = 1000
                this.nodeWidth = 10
                this.nodeHeight = 6
                this.maxScale = 50
                this.endFirstPaintAfterCreate = true
                break
            case 'largeImage':
                this.params.total = 1
                break
            case 'drag':
                this.startY += 10
                this.dragPoint.y = this.flatChildren ? this.startY - 5 : -5
                break
            case 'dynamic':
                this.flatChildren = true
                this.dynamicMode = true
                break
            case 'move':
                if (params.zoom === 'fit') this.dragPoint.direction = 'wait-right'
                break
        }
    }

    public updateContentBounds(): void {
        const { contentBounds, width, height, params, imageConfig } = this
        switch (params.scene) {
            case 'largeImage':
                contentBounds.width = imageConfig.largeImageWidth
                contentBounds.height = imageConfig.largeImageHeight
                break
            default:
                const { tenThousand, thousand, size, ySize, column } = this.getCreateLayout()
                contentBounds.width = tenThousand < column ? tenThousand * size : column * size
                contentBounds.height = tenThousand < column ? (thousand ? thousand / 10 * ySize : ySize) : Math.ceil(tenThousand / column) * ySize
        }
        this.fitScale = Math.min(width / contentBounds.width, height / contentBounds.height)
    }

    // create elements

    public async createApp() { }

    public async createContent() {
        switch (this.params.scene) {
            case 'image':
                await this.createImages()
                break
            case 'largeImage':
                this.setScaleData(this.fitScale, 0, 0)
                await this.createLargeImage()
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

    public createRects(): void {
        const { rootNode } = this
        const { tenThousand, thousand, size, column, x, y } = this.getCreateLayout()

        let group, startX: number, startY: number, color: string, lastThousand: number

        for (var i = 0; i < tenThousand; i++) {
            startX = x + size * (i % column)
            startY = y + size * Math.floor(i / column)
            color = this.getRotationColor(i * 3)
            lastThousand = i === tenThousand - 1 ? thousand : 0

            if (this.flatChildren) {
                this.createRect(rootNode, startX, startY, color, lastThousand)
            } else {
                group = this.addGroup(rootNode, startX, startY)
                this.createRect(group, 0, 0, color, lastThousand)
            }
        }
    }

    public createRect(parent: any, startX: number, startY: number, hsl: string, thousand: number): void {
        let y, yCount = thousand ? thousand * 10 : 100
        for (let i = 0; i < 100; i++) { // ten thousand
            if (i % 10 === 0) startX += 10
            y = startY
            for (var j = 0; j < yCount; j++) {
                if (j % 10 === 0) y += 10
                this.addRect(parent, startX, y, 10, 10, hsl)
                y += 12
            }
            startX += 12
        }
    }

    public async createImages() {
        const { rootNode } = this
        const { tenThousand, thousand, size, ySize, column, x, y } = this.getCreateLayout()

        let startX: number, startY: number, color: string, lastThousand: number

        for (var i = 0; i < tenThousand; i++) {
            startX = x + size * (i % column)
            startY = y + ySize * Math.floor(i / column)
            color = this.getRotationColor(i * 3)
            lastThousand = i === tenThousand - 1 ? thousand : 0
            await this.createImage(rootNode, i, startX, startY, color, lastThousand)
        }
    }

    public async createImage(parent: any, num: number, startX: number, startY: number, hsl: string, thousand: number) {
        let y, yCount = thousand ? thousand * 10 : 100
        for (let i = 0; i < 100; i++) { // ten thousand
            if (i % 10 === 0) startX += this.nodeWidth
            y = startY
            for (var j = 0; j < yCount; j++) {
                if (j % 10 === 0) y += this.nodeHeight
                const data = await this.createImageUrl(1000, 600, num * 10000 + i * 10 + j + 1, hsl)
                await this.addImage(parent, startX, y, this.nodeWidth, this.nodeHeight, data.url)
                y += this.nodeHeight * 1.2
            }
            startX += this.nodeWidth * 1.2
        }
    }

    // Simulate non-repeating images (each 1000 * 600px)
    public async createImageUrl(width: number, height: number, count: number, color: string): Promise<{ url: string }> {
        return new Promise((resolve) => {
            const canvas = new OffscreenCanvas(width, height)
            const context = canvas.getContext('2d') as any as CanvasRenderingContext2D

            context.fillStyle = color
            context.fillRect(0, 0, width, height)

            for (let i = 0; i < 10; i++) {
                context.fillStyle = `hsl(${Math.round(10 + Math.random() * 100)},70%,50%)`
                context.beginPath()
                context.arc(Math.random() * width, Math.random() * height, 10 + Math.random() * 100, 0, Math.PI * 2)
                context.fill()
            }

            context.fillStyle = 'rgba(255,255,255,0.8)'
            context.font = `bold 150px Arial`
            context.textAlign = 'center'
            context.textBaseline = 'middle'
            context.fillText(count.toString(), width / 2, height / 2)

            canvas.convertToBlob().then(blob => {
                const blobURL = URL.createObjectURL(blob)
                resolve({ url: blobURL })
            }).catch(e => {
                console.error(e)
            })
        })

    }

    public async createLargeImage() {
        await this.addImage(this.rootNode, this.startY, this.startX, 20000, 20000, this.imageConfig.largeImageUrl)
    }

    public async createSvgImages() { }

    public async createLargeSvgImage() { }

    // add

    public addGroup(_parent: any, _x: number, _y: number): any { }

    public addRect(_parent: any, _x: number, _y: number, _width: number, _height: number, _color: string): any { }

    public async addImage(_parent: any, _x: number, _y: number, _width: number, _height: number, _url: string): Promise<any> { }

    // stats

    public createStats(): void {
        const stats = this.stats = new Stats()
        const dom = stats.dom as HTMLDivElement
        dom.style.pointerEvents = 'none'
        dom.style.left = '20px'
        dom.style.top = this.top + 'px'
        dom.style.display = 'flex'
        const children = dom.childNodes as any as HTMLCanvasElement[]
        children.forEach((item) => { item.style.display = 'block' })
        children[1].style.display = 'none'
        document.body.appendChild(stats.dom)

        getId(this.config.jsMemory!).style.top = (this.top + 25) + 'px'
    }

    public createFirstPaintStats(): void {
        const stats = this.firstPaintStats = new Stats()
        stats.showPanel(1)
        const dom = stats.dom as HTMLDivElement
        dom.style.pointerEvents = 'none'
        dom.style.left = '180px'
        dom.style.top = this.top + 'px'
        dom.style.display = 'flex'
        document.body.appendChild(dom)

        getId(this.config.firstTimeId!).style.top = (this.top + 25) + 'px'
    }

    // first paint

    public firstPaintStart(): void {
        this.firstPaintStats.begin()
    }

    public firstPaintEnd(): void {
        requestAnimationFrame(() => {
            this.firstPaintStats.end()
            if (this.params.zoom === 'fit') {
                this.setScaleData(this.fitScale, 0, 0)
                requestAnimationFrame(() => {
                    this.viewCompleted = true
                })
            } else {
                this.viewCompleted = true
            }
        })
    }

    public defineViewCompleted(): void {

    }

    // set

    public setScaleData(scale: number, x: number, y: number): void {
        this.scaleData.value = scale
        this.setAppScale(scale, x, y)
    }

    public setAppScale(_scale: number, _x: number, _y: number): void { }

    public setAppPosition(_x: number, _y: number): void { }

    public setNodeScale(_element: any, _scale: number, _x?: number, _y?: number): void { }

    public setNodePosition(_element: any, _x: number, _y: number): void { }

    // get

    public updateNodes(): void { }

    public updateDragNodes(): void { }

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
            case 'image':
            case 'largeImage':
                this.zoomTest()
                break
            case 'move':
                this.moveTest()
                break
            case 'drag':
                this.dragTest()
                break
            case 'dynamic':
                this.dynamicTest()
                break
        }
        if (mode === 'pointer' && scene !== 'create') this.simulatePointerEvent()
    }

    // scene test

    public zoomTest() {
        const { scaleData } = this

        if (scaleData.value >= this.maxScale) {

            if (!scaleData.mode.includes('out')) {
                scaleData.mode = 'wait-out'
                setTimeout(() => {
                    scaleData.mode = 'out'
                }, 200)
            }

        } else if (scaleData.value <= this.fitScale) {

            if (!scaleData.mode.includes('in')) {
                scaleData.mode = 'wait-in'
                setTimeout(() => {
                    scaleData.mode = 'in'
                }, Math.max(this.params.total / 10000 * 50, 200))
            }

        }

        if (!scaleData.mode.includes('wait')) {
            scaleData.value *= scaleData.mode === 'in' ? 1.05 : 0.95
            this.setAppScale(scaleData.value, 0, 0)
        }
    }

    public moveTest() {
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

    public dragTest() {
        if (!this.dragNode) this.updateDragNodes()
        this.autoDragPoint(this.dragPoint)
        this.setNodePosition(this.dragNode, this.dragPoint.x, this.dragPoint.y)
    }

    public dynamicTest() {
        if (!this.nodes.length) {
            this.updateNodes()
            const { width, height } = this
            for (let i = 0, len = this.nodes.length; i < len; i++) {
                this.dynamicPoints.push({
                    x: Math.ceil(Math.random() * width),
                    y: Math.ceil(Math.random() * height),
                    direction: 'right'
                })
            }
        }

        const { dynamicPoints, nodes } = this
        let point: IDragPoint
        for (let i = 0, len = dynamicPoints.length; i < len; i++) {
            point = dynamicPoints[i]
            this.autoDragPoint(point)
            this.setNodePosition(nodes[i], point.x, point.y)
        }
    }

    // helper

    public getCreateLayout() {
        const { total } = this.params
        const tenThousand: number = Math.ceil(total / 10000)
        const thousand: number = total / 1000 % 10
        const size = this.nodeWidth * 100 * 3 / 2
        const ySize = this.nodeHeight * 100 * 3 / 2
        const column = tenThousand > 25 ? 10 : 5
        return { tenThousand, thousand, size, ySize, column, x: this.startX, y: this.startY }
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

    public generateId() {
        return Date.now().toString(36) + Math.random().toString(36).slice(2)
    }

    public destroy() {
        // @ts-ignore
        this.app = this.rootNode = this.canvas = this.view = this.nodes = this.dragNode = this.dragNodes = null
    }

}