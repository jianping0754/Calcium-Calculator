/* eslint-disable @typescript-eslint/no-redeclare */
/* eslint-disable no-self-assign */
import Point from "./Point";

import List from "../../utils/List";
import { MathFunction } from "../../types";

export default class Render {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private scale: number = 90; // px per unit length
    private spacing: number = 1; // unit length

    private mouseDown: boolean = false;
    private mouseDX: number = 0; // mouse delta x
    private mouseDY: number = 0; // mouse delta y

    private center: Point;
    private mousePoint: Point;

    private functionList: List<MathFunction> = new List();

    public constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.center = new Point(this.canvas.width / 2, this.canvas.height / 2);
        this.mousePoint = this.center;

        this.initListeners();
    }

    private initListeners(): void {
        this.canvas.addEventListener("mousedown", (e: MouseEvent) => {
            this.mouseDown = true;

            this.refreshMousePoint(e);
            this.mouseDX = this.mousePoint.x - this.center.x;
            this.mouseDY = this.mousePoint.y - this.center.y;
        });
        this.canvas.addEventListener("mousemove", (e: MouseEvent) => {
            this.refreshMousePoint(e);

            if(!this.mouseDown) return;

            this.center.x = this.mousePoint.x - this.mouseDX;
            this.center.y = this.mousePoint.y - this.mouseDY;
        });
        this.canvas.addEventListener("mouseup", () => this.stopMoving());
        this.canvas.addEventListener("mouseleave", () => {
            this.stopMoving();
            this.mousePoint = this.center;
        });

        this.canvas.addEventListener("wheel", (e: WheelEvent) => {
            const delta = 7;

            e.deltaY > 0
            ? this.scale -= delta
            : this.scale += delta;

            if(this.scale < 53) this.scale = 53;
        });
    }

    private refreshMousePoint(e: MouseEvent): void {
        var rect = this.canvas.getBoundingClientRect();
        var mousePoint = new Point(e.clientX - rect.left, e.clientY - rect.top);
        this.mousePoint = mousePoint;
    }

    private refreshAxisLine(): void {
        /**
         * X Direction
         */
        // X Axis
        this.drawLine(new Point(0, this.center.y), new Point(this.canvas.width, this.center.y), "#cbd0df", 2);
        // thicker line
        for(
            let i = 1;
            (
                this.center.y - i * this.spacing * this.scale >= 0 ||
                this.center.y + i * this.spacing * this.scale <= this.canvas.height
            );
            i++
        ) {
            var y1 = this.center.y - i * this.spacing * this.scale;
            var y2 = this.center.y + i * this.spacing * this.scale;
            this.drawStraightLine(y1, "#8c949e");
            this.drawStraightLine(y2, "#8c949e");

            // number of the line
            this.drawText((i * this.spacing).toString(), this.center.x + 5, y1 + 5, "#cbd0df", 15);
            this.drawText((-i * this.spacing).toString(), this.center.x + 5, y2 + 5, "#cbd0df", 15);
        }
        // thinner line
        for(
            let j = 1;
            (
                this.center.y - j * (this.spacing / 5) * this.scale >= 0 ||
                this.center.y + j * (this.spacing / 5) * this.scale <= this.canvas.height
            );
            j++
        ) {
            var y1 = this.center.y - j * (this.spacing / 5) * this.scale;
            var y2 = this.center.y + j * (this.spacing / 5) * this.scale;
            this.drawStraightLine(y1, "#8c949e", .3);
            this.drawStraightLine(y2, "#8c949e", .3);
        }

        /**
         * Y Direction
         */
        // Y Axis
        this.drawLine(new Point(this.center.x, 0), new Point(this.center.x, this.canvas.height), "#cbd0df", 2);
        // thicker line
        for(
            let k = 1;
            (
                this.center.x - k * this.spacing * this.scale >= 0 ||
                this.center.x + k * this.spacing * this.scale <= this.canvas.width
            );
            k++
        ) {
            var x1 = this.center.x - k * this.spacing * this.scale;
            var x2 = this.center.x + k * this.spacing * this.scale;
            this.drawVerticalLine(x1, "#8c949e");
            this.drawVerticalLine(x2, "#8c949e");

            // number of the line
            this.drawText((-k * this.spacing).toString(), x1 - 5, this.center.y + 15, "#cbd0df", 15);
            this.drawText((k * this.spacing).toString(), x2 - 5, this.center.y + 15, "#cbd0df", 15);
        }
        // thinner line
        for(
            let l = 1;
            (
                this.center.x - l * (this.spacing / 5) * this.scale >= 0 ||
                this.center.x + l * (this.spacing / 5) * this.scale <= this.canvas.width
            );
            l++
        ) {
            var x1 = this.center.x - l * (this.spacing / 5) * this.scale;
            var x2 = this.center.x + l * (this.spacing / 5) * this.scale;
            this.drawVerticalLine(x1, "#8c949e", .3);
            this.drawVerticalLine(x2, "#8c949e", .3);
        }
    }

    private stopMoving(): void {
        this.mouseDown = false;
        this.mouseDX = 0;
        this.mouseDY = 0;
        // this.mousePoint = this.center;
    }

    private drawLine(begin: Point, end: Point, color: string, width: number = 1): void {
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width;
        this.ctx.moveTo(begin.x, begin.y);
        this.ctx.lineTo(end.x, end.y);
        this.ctx.stroke();
    }

    private drawStraightLine(y: number, color: string, width: number = 1): void {
        this.drawLine(new Point(0, y), new Point(this.canvas.width, y), color, width);
    }

    private drawVerticalLine(x: number, color: string, width: number = 1): void {
        this.drawLine(new Point(x, 0), new Point(x, this.canvas.height), color, width);
    }

    private drawText(text: string, x: number, y: number, color: string, fontSize: number = 20): void {
        this.ctx.font = fontSize +"px Ubuntu-Regular";
        this.ctx.fillStyle = color;
        this.ctx.fillText(text, x, y);
    }

    private clear(): void {
        this.canvas.width = this.canvas.width;
        this.canvas.height = this.canvas.height;
    }

    // Point transforming
    private screenToCoordinates(point: Point): Point {
        return new Point((point.x - this.center.x) / (this.scale * this.spacing), -(point.y - this.center.y) / (this.scale * this.spacing));
    }
    private coordinatesToScreen(point: Point): Point {
        return new Point(this.center.x + (point.x * this.scale * this.spacing), this.center.y - (point.y * this.scale * this.spacing));
    }
    /*****/

    // To render each frame
    public render(): void {
        this.clear();

        this.refreshAxisLine();

        // O point
        this.drawText("O", this.center.x - 20, this.center.y + 20, "#cbd0df", 17);

        // Mouse point & fps
        var mouseCoordinatesPoint = this.screenToCoordinates(this.mousePoint);
        this.drawText("Mouse: "+ mouseCoordinatesPoint.x.toFixed(2) +", "+ mouseCoordinatesPoint.y.toFixed(2), 30, 30, "#cbd0df", 15);

        // Draw function images
        /** @todo */
        // var beginX = -this.center.x / (this.scale * this.spacing);
        // var endX = (this.canvas.width - this.center.x) / (this.scale * this.spacing);
        // for(let x1 = beginX; x1 <= endX; x1 += .01) {
        //     var f = (x: number) => 1 / x; // f(x)
        //     var y1 = f(x1);
        //     var x2 = x1 + .01;
        //     var y2 = f(x2);
        //     var p1 = this.coordinatesToScreen(new Point(x1, y1));
        //     var p2 = this.coordinatesToScreen(new Point(x2, y2));

        //     this.drawLine(p1, p2, "#fff");
        // }
    }

    public registerFunction(f: MathFunction): void {
        this.functionList.add(f);
    }
}
