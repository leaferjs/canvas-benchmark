import { Application, Container, Graphics, Assets, Sprite } from 'pixi.js'
import { Case } from './core/Case'


export class PixiCase extends Case {

    declare app: Application
    declare rootNode: Container

    override async create() {
        const { view, width, height } = this
        const app = new Application()
        const canvas = document.createElement('canvas')
        canvas.style.width = width + 'px'
        canvas.style.height = height + 'px'
        view.appendChild(canvas)
        await app.init({ backgroundColor: '#f2f2f2', canvas, width, height, resolution: devicePixelRatio, resizeTo: view })

        // must
        this.app = app
        this.rootNode = app.stage
        this.canvas = canvas
        await this.createContent()
        app.ticker.addOnce(() => this.firstPaintEnd())
    }

    // set

    override setAppScale(scale: number, x: number, y: number): void {
        this.app.stage.scale = scale
        this.setAppPosition(x, y)
    }

    override setAppPosition(x: number, y: number): void {
        this.app.stage.x = x
        this.app.stage.y = y
    }

    override setElementScale(element: Graphics, scale: number, x?: number, y?: number): void {
        element.scale = scale
        if (x !== undefined && y !== undefined) this.setElementPosition(element, x, y)
    }

    override setElementPosition(element: Graphics, x: number, y: number): void {
        element.x = x
        element.y = y
    }

    // get

    override updateElements(): void {
        this.elements = this.rootNode.children
    }

    override updateDragElements(): void {
        const list = this.flatChildren ? this.rootNode.children : this.rootNode.children[0].children
        this.dragElement = list[0]
        for (let i = 0; i < this.maxDragElements; i++) {
            this.dragElements.push(list[i])
        }
    }

    // create

    override addGroup(parent: any, x: number, y: number): any {
        const node = new Container()
        node.x = x
        node.y = y
        node.eventMode = 'dynamic'
        parent.addChild(node)
        return node
    }

    override addRect(parent: any, x: number, y: number, width: number, height: number, color: string): any {
        const node = new Graphics()
        node.x = x
        node.y = y
        node.rect(0, 0, width, height)
        node.fill(color)
        node.eventMode = 'dynamic'
        parent.addChild(node)
    }

    override addCircle(parent: any, x: number, y: number, width: number, height: number, color: string): any {
        const node = new Graphics()
        node.x = x
        node.y = y
        node.rect(0, 0, width, height)
        node.fill(color)
        node.eventMode = 'dynamic'
        parent.addChild(node)
    }

    override async createLargeImage() {
        const view = this.app.stage
        const texture = await Assets.load(this.imageConfig.largeImageUrl)
        const sprite = new Sprite(texture)
        view.addChild(sprite)
    }

}