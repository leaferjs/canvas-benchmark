import { Leafer, Group, Rect, Image, RenderEvent, ImageEvent } from 'leafer-ui'
import { Case } from './core/Case'


export class LeaferCase extends Case {

    declare app: Leafer
    declare rootNode: Leafer

    override async create() {
        const { view, dynamicMode } = this
        const app = new Leafer({ view, usePartLayout: !dynamicMode, usePartRender: !dynamicMode })

        // must
        this.app = this.rootNode = app
        this.canvas = app.canvas.view
        await this.createContent()
        app.once(RenderEvent.END, () => this.firstPaintEnd())
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

    override setElementScale(element: Rect, scale: number, x?: number, y?: number): void {
        element.scale = scale
        if (x !== undefined && y !== undefined) this.setElementPosition(element, x, y)
    }

    override setElementPosition(element: Rect, x: number, y: number): void {
        element.x = x
        element.y = y
    }

    // get

    override updateElements(): void {
        this.elements = this.rootNode.children
    }

    override updateDragElements(): void {
        const list = this.flatChildren ? this.rootNode.children : this.rootNode.children[0].children as Rect[]
        this.dragElement = list[0]
        for (let i = 0; i < this.maxDragElements; i++) {
            this.dragElements.push(list[i])
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
    }

    override addCircle(parent: any, x: number, y: number, width: number, height: number, color: string): any {
        const node = new Rect(null)
        node.x = x
        node.y = y
        node.height = width
        node.width = height
        node.fill = color
        node.draggable = true
        parent.add(node)
    }

    override async createLargeImage() {
        await new Promise((resolve) => {

            const view = this.app
            const image = new Image({
                url: this.imageConfig.largeImageUrl,
            })
            view.add(image)

            image.once(ImageEvent.LOADED, () => resolve(true))

        })
    }

}