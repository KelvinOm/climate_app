import "./styles.scss";
import template from "./template.pug";

export default class Chart {
    constructor() {
        this._render();

        this.preloader = this._elem.querySelector("[data-preloader]");

        this._canvas = this._elem.querySelector("[data-chart]");
        this._context = this._canvas.getContext("2d");

        this._width = this._canvas.width;
        this._height = this._canvas.height;

        this._indent = 30;
    }

    drawChart(array, table) {

        this._drawGrid(table, array);

        let yearTemperature = [];

        for (let i = 0; i < array.length; i++) {
            let yearTemperatures = [];
            for (let key in array[i]) {
                if (array[i].hasOwnProperty(key) && key !== "year") {
                    for (let j = 0; j < array[i][key].length; j++) {
                        yearTemperatures.push(array[i][key][j].v);
                    }
                }
            }
            let obj = {
                year: array[i].year,
                max: Math.max.apply(null, yearTemperatures),
                min: Math.min.apply(null, yearTemperatures)
            }
            yearTemperature.push(obj);
        }

        let step = (this._width - this._indent) / yearTemperature.length;

        this._context.beginPath();
        this._context.strokeStyle = "#cf000f";
        this._context.lineWidth = 2.5;
        this._context.lineJoin = "round";
        for (let i = 0; i < yearTemperature.length; i++) {
            let x = i === 0 ? this._indent : i * step + this._indent;
            let y = this._zeroPoint - yearTemperature[i].max * 3.2;
            this._context.lineTo(x, y);
        }
        this._context.stroke();

        this._context.beginPath();
        this._context.strokeStyle = "#3498db";
        this._context.lineWidth = 2.5;
        this._context.lineJoin = "round";
        for (let i = 0; i < yearTemperature.length; i++) {
            let x = i === 0 ? this._indent : i * step + this._indent;
            let y = this._zeroPoint + yearTemperature[i].min * -3.2;
            this._context.lineTo(x, y);
        }
        this._context.stroke();

        this._hidePreloader();
    }

    _drawGrid(table, array) {
        if (table === "temperature") {
            this._context.font="11px PT Sans";
            this._context.textAlign="start";

            for (let i = 0; i <= 4; i++) {
                this._context.textAlign="start";
                this._context.fillText(50 - i * 25 + "°", 0, i * 80 + 10);

                if ((50 - i * 25) === 0) {
                    this._zeroPoint = i * 80 + 6;
                }
                
                if (i === 4) {
                    this._lastPoint = i * 80 + 6;
                }

                this._context.beginPath();
                this._context.lineWidth = 0.5;
                this._context.strokeStyle = "#e4e4e4";
                this._context.moveTo(this._indent, i * 80 + 6);
                this._context.lineTo(this._width, i * 80 + 6);
                this._context.stroke();
            }

            this._context.fillText(array[0].year + " год", this._indent, this._height - 5);
            this._context.fillText(array[array.length - 1].year + " год", this._width - 45, this._height - 5);

            let legend = this._elem.querySelector(".chart__legend");
            legend.classList.add("active");
        }
    }

    _clearChart() {
        this._context.clearRect(0, 0, this._width, this._height);
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
