import { Leafer, Group, Rect, Image, RenderEvent, ImageEvent } from 'leafer-ui'
import { Case } from '../core/Case'


export class LeaferCase extends Case {

    declare app: Leafer
    declare rootNode: Leafer
    declare canvas: HTMLCanvasElement

    override async createApp() {
        const { view, dynamicMode } = this
        const app = new Leafer({ view, usePartLayout: !dynamicMode, usePartRender: !dynamicMode })

        // must
        this.app = this.rootNode = app
        this.canvas = app.canvas.view
    }

    override defineViewCompleted(): void {
        this.app.once(RenderEvent.END, () => this.firstPaintEnd())
    }

    // set

    override setAppScale(scale: number, x: number, y: number): void {
        this.app.scale = scale
        this.setAppPosition(x, y)
    }

    override setAppPosition(x: number, y: number): void {
        this.app.x = x
        this.app.y = y
    }

    override setNodeScale(element: Rect, scale: number, x?: number, y?: number): void {
        element.scale = scale
        if (x !== undefined && y !== undefined) this.setNodePosition(element, x, y)
    }

    override setNodePosition(element: Rect, x: number, y: number): void {
        element.x = x
        element.y = y
    }

    // get

    override updateNodes(): void {
        this.nodes = this.rootNode.children
    }

    override updateDragNodes(): void {
        const list = this.flatChildren ? this.rootNode.children : this.rootNode.children[0].children as Rect[]
        this.dragNode = list[0]
        for (let i = 0; i < this.maxDragNodes; i++) {
            this.dragNodes.push(list[i])
        }
    }

    // create

    override addGroup(parent: any, x: number, y: number): any {
        const node = new Group()
        node.x = x
        node.y = y
        parent.add(node)
        return node
    }

    override addRect(parent: any, x: number, y: number, width: number, height: number, color: string): any {
        const node = new Rect(null)
        node.x = x
        node.y = y
        node.height = width
        node.width = height
        node.fill = color
        node.draggable = true
        parent.add(node)
        return node
    }

    override async addImage(parent: any, x: number, y: number, width: number, height: number, url: string): Promise<any> {
        await new Promise((resolve) => {
            const node = new Image()
            node.x = x
            node.y = y
            node.width = width
            node.height = height
            node.url = url
            parent.add(node)
            node.once(ImageEvent.LOADED, () => resolve(node))
        })
    }

}