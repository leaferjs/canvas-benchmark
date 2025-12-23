import { Canvas, Point, Rect, Group, FabricImage } from 'fabric'
import { Case } from './core/Case'


export class FabricCase extends Case {

    declare app: Canvas
    declare rootNode: Canvas

    override async create() {
        const { view, width, height } = this
        const canvas = document.createElement('canvas')
        view.appendChild(canvas)
        const app = new Canvas(canvas, { width, height })
        this.flatChildren = true

        // must
        this.app = this.rootNode = app
        this.canvas = canvas
        await this.createContent()
        app.once('after:render', () => this.firstPaintEnd())
    }

    // set

    override setAppScale(scale: number, x: number, y: number): void {
        this.app.setZoom(scale)
        this.setAppPosition(x, y)
    }

    override setAppPosition(x: number, y: number): void {
        this.app.absolutePan(new Point(x, y))
    }

    override setElementScale(element: Rect, scale: number, x?: number, y?: number): void {
        element.set({
            scaleX: scale,
            scaleY: scale
        })
        if (x !== undefined && y !== undefined) this.setElementPosition(element, x, y)
    }

    override setElementPosition(element: Rect, x: number, y: number): void {
        element.set({
            left: x,
            top: y
        })
        this.app.requestRenderAll()
    }

    // get

    override updateElements(): void {
        this.elements = this.app.getObjects()
    }

    override updateDragElements(): void {
        const list = this.app.getObjects()
        this.dragElement = list[0]
        for (let i = 0; i < this.maxDragElements; i++) {
            this.dragElements.push(list[i])
        }
    }

    // create
    override addGroup(parent: any, x: number, y: number): any {
        const node = new Group()
        node.left = x
        node.top = y
        parent.add(node)
        return node
    }

    override addRect(parent: any, x: number, y: number, width: number, height: number, color: string): any {
        const rect = new Rect()
        rect.left = x
        rect.top = y
        rect.height = 10
        rect.width = 10
        rect.fill = color
        parent.add(rect)
    }

    override addCircle(parent: any, x: number, y: number, width: number, height: number, color: string): any {
        const rect = new Rect()
        rect.left = x
        rect.top = y
        rect.height = 10
        rect.width = 10
        rect.fill = color
        parent.add(rect)
    }

    override async createLargeImage() {
        await new Promise((resolve) => {

            const view = this.app
            FabricImage.fromURL(this.imageConfig.largeImageUrl).then(image => {
                view.add(image)
                resolve(true)
            })

        })
    }

}