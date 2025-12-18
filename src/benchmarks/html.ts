import { Case } from './core/Case'


export class HTMLCase extends Case {

    declare app: HTMLDivElement

    override async create() {
        const { view } = this
        const app = document.createElement('div')
        app.style.transformOrigin = '0% 0%'
        view.appendChild(app)

        // must
        this.app = this.canvas = app
        await this.createContent()
        requestAnimationFrame(() => this.firstPaintEnd())
    }

    // set

    override setAppScale(scale: number, x: number, y: number): void {
        this.app.style.transform = `scale(${scale}) translate(${x}px, ${y}px)`
    }

    override setAppPosition(x: number, y: number): void {
        this.app.style.transform = `translate(${x}px, ${y}px)`
    }

    override setElementScale(element: HTMLElement, scale: number, x?: number, y?: number): void {
        if (x !== undefined && y !== undefined) element.style.transform = `scale(${scale}) translate(${x}px, ${y}px)`
        else element.style.transform = `scale(${scale})`
    }

    override setElementPosition(element: HTMLElement, x: number, y: number): void {
        element.style.left = x + 'px'
        element.style.top = y + 'px'
    }

    // get

    override updateElements(): void {
        this.elements = this.app.childNodes as any
    }

    override updateDragElements(): void {
        const list = this.app.children
        this.dragElement = list[0]
        this.dragPoint.y = this.startY - 5
        for (let i = 0; i < this.maxDragElements; i++) {
            this.dragElements.push(list[i])
        }
    }

    // create

    override createRects(): void {
        const view = this.app
        const { tenThousand, thousand, size, column, x, y } = this.getCreateLayout()

        for (let i = 0; i < tenThousand; i++) {
            this.createBlock(view, x + size * (i % column), y + size * Math.floor(i / column), this.getRotationColor(i * 3), i === tenThousand - 1 ? thousand : 0)
        }
    }

    protected createBlock(group: HTMLElement, startX: number, startY: number, hsl: string, thousand: number): void {
        let y, rect, style, yCount = thousand ? thousand * 10 : 100
        for (let i = 0; i < 100; i++) { // ten thousand
            if (i % 10 === 0) startX += 10
            y = startY
            for (var j = 0; j < yCount; j++) {
                if (j % 10 === 0) y += 10
                rect = document.createElement('div')
                style = rect.style
                style.position = 'absolute'
                style.left = startX + 'px'
                style.top = y + 'px'
                style.width = 10 + 'px'
                style.height = 10 + 'px'
                style.backgroundColor = hsl
                group.appendChild(rect)
                y += 12
            }
            startX += 12
        }
    }

    override async createLargeImage() {
        await new Promise((resolve) => {

            const view = this.app
            const image = new Image()
            image.src = this.imageConfig.largeImageUrl
            image.onload = () => {
                view.appendChild(image)
                resolve(true)
            }

        })
    }

}