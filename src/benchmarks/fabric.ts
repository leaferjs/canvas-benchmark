import { Canvas, Point, Rect, Group, FabricImage } from 'fabric'
import { Case } from '../core/Case'


export class FabricCase extends Case {

    declare app: Canvas
    declare rootNode: Canvas
    declare canvas: HTMLCanvasElement

    override async createApp() {
        const { view, width, height } = this
        const canvas = document.createElement('canvas')
        view.appendChild(canvas)
        const app = new Canvas(canvas, { width, height })
        this.flatChildren = true

        // must
        this.app = this.rootNode = app
        this.canvas = canvas
    }

    override defineViewCompleted(): void {
        this.app.once('after:render', () => this.firstPaintEnd())
    }

    // set

    override setAppScale(scale: number, x: number, y: number): void {
        this.app.setZoom(scale)
        this.setAppPosition(x, y)
    }

    override setAppPosition(x: number, y: number): void {
        this.app.absolutePan(new Point(-x, -y))
    }

    override setNodeScale(element: Rect, scale: number, x?: number, y?: number): void {
        element.set({
            scaleX: scale,
            scaleY: scale
        })
        if (x !== undefined && y !== undefined) this.setNodePosition(element, x, y)
    }

    override setNodePosition(element: Rect, x: number, y: number): void {
        element.set({
            left: x,
            top: y
        })
        this.app.requestRenderAll()
    }

    // get

    override updateNodes(): void {
        this.nodes = this.app.getObjects()
    }

    override updateDragNodes(): void {
        const list = this.app.getObjects()
        this.dragNode = list[0]
        for (let i = 0; i < this.maxDragNodes; i++) {
            this.dragNodes.push(list[i])
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
        const node = new Rect()
        node.left = x
        node.top = y
        node.height = width
        node.width = height
        node.fill = color
        parent.add(node)
        return node
    }

    override async addImage(parent: any, x: number, y: number, width: number, height: number, url: string): Promise<any> {
        await new Promise((resolve) => {
            FabricImage.fromURL(url).then(node => {
                node.left = x
                node.top = y
                node.scaleX = width / node.width
                node.scaleY = height / node.height
                parent.add(node)
                resolve(node)
            })
        })
    }

}