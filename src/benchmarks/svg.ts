import { Case } from './core/Case'


let svgNS = 'http://www.w3.org/2000/svg'

export class SVGCase extends Case {

    declare app: HTMLElement

    override async create() {
        const { view, width, height } = this
        const svg = document.createElementNS(svgNS, 'svg') as HTMLElement
        svg.setAttribute("style", `width:${width}px;height:${height}px;`)
        view.appendChild(svg)

        const app = document.createElementNS(svgNS, 'g') as HTMLElement
        svg.appendChild(app)
        app.style.transformOrigin = '0% 0%'

        // must
        this.app = app
        this.canvas = app
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
        element.style.transform = `scale(${scale})`
        if (x !== undefined && y !== undefined) this.setElementPosition(element, x, y)
    }

    override setElementPosition(element: HTMLElement, x: number, y: number): void {
        element.setAttribute('x', x as any as string)
        element.setAttribute('y', y as any as string)
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

        for (var i = 0; i < tenThousand; i++) {
            this.createBlock(view, x + size * (i % column), y + size * Math.floor(i / column), this.getRotationColor(i * 3), i === tenThousand - 1 ? thousand : 0)
        }
    }

    protected createBlock(group: Element, startX: number, startY: number, hsl: string, thousand: number): void {
        let y, rect, yCount = thousand ? thousand * 10 : 100
        for (let i = 0; i < 100; i++) { // ten thousand
            if (i % 10 === 0) startX += 10
            y = startY
            for (var j = 0; j < yCount; j++) {
                if (j % 10 === 0) y += 10
                rect = document.createElementNS(svgNS, 'rect')
                rect.setAttribute('x', startX as any as string)
                rect.setAttribute('y', y as any as string)
                rect.setAttribute('width', 10 as any as string)
                rect.setAttribute('height', 10 as any as string)
                rect.setAttribute('fill', hsl)
                group.appendChild(rect)
                y += 12
            }
            startX += 12
        }
    }

    override async createLargeImage() {
        await new Promise((resolve) => {

            const view = this.app
            const image = document.createElementNS(svgNS, "image") as HTMLElement
            image.setAttribute("href", this.imageConfig.largeImageUrl)

            image.onload = () => {
                view.appendChild(image)
                resolve(true)
            }

        })
    }

}