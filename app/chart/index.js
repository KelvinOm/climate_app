import template from "./template.pug";
import "./styles.scss";

export default class Chart {
    constructor() {
        this._render();

        this.preloader = this._elem.querySelector("[data-preloader]");

        this._width = 800;

        this._canvas = this._elem.querySelector("[data-chart]");
        this._context = this._canvas.getContext("2d");
    }

    drawChart(array) {
        this._width = this._canvas.width = 46020 / 2;

        this._context.beginPath();
        this._context.strokeStyle = "#e4e4e4";
        this._context.moveTo(0, 100);
        this._context.lineTo(this._width, 100);
        this._context.stroke();

        this._context.beginPath();
        this._context.strokeStyle = "#1F75FE";
        this._context.lineWidth = 1;

        for (let i = 0; i < array.length; i++) {
            array[i];
            let x = i;
            let y = 100 - array[i].v;
            this._context.lineTo(x, y);
        }

        this._context.stroke();

        this._hidePreloader();
    }

    _clearChart() {
        this._context.clearRect(0, 0, this._width, 200);
    }

    _showPreloader() {
        this._clearChart();

        this.preloader.style.display = "block";
        this.preloader.classList.remove("hide");
    }

    _hidePreloader() {
        this.preloader.className += " hide";
        setTimeout(() => {
            this.preloader.style.display = "none";
        }, 300);
    }

    _render() {
        let tmp = document.createElement("div");
        tmp.innerHTML = template({});
        this._elem = tmp.firstElementChild;
    }

    getElem() {
        return this._elem;
    }

}
