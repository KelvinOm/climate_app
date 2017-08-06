import "./styles.scss";
import template from "./template.pug";

export default class Chart {
    constructor() {
        this._render();

        this._legendContainer = this._elem.querySelector(".chart__legend");

        this.preloader = this._elem.querySelector("[data-preloader]");

        this._canvas = this._elem.querySelector("[data-chart]");
        this._context = this._canvas.getContext("2d");
        this._width = this._canvas.width;
        this._height = this._canvas.height;
        this._indent = 50;
    }

    drawChart(array, table) {
        this._drawGrid(table, array);
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
                this._context.lineWidth = 0.8;
                this._context.strokeStyle = "#ccc";
                this._context.moveTo(this._indent, i * 80 + 6);
                this._context.lineTo(this._width, i * 80 + 6);
                this._context.stroke();
            }

            this._legendContainer.innerHTML = "";
            let maxLegend = document.createElement("div");
            maxLegend.classList.add("chart__legend--item", "red");
            maxLegend.innerHTML = "максимальная температура";
            this._legendContainer.appendChild(maxLegend);

            let minLegend = document.createElement("div");
            minLegend.classList.add("chart__legend--item", "blue");
            minLegend.innerHTML = "минимальная температура";
            this._legendContainer.appendChild(minLegend);

            this._drawTemperatureChart(array);
        } else {
            for (let i = 0; i <= 4; i++) {
                this._context.textAlign="start";

                if (array.length <= 10) {
                    this._context.fillText(500 - i * 125 + " mm", 0, i * 80 + 10);
                } else {
                    this._context.fillText(240 - i * 60 + " mm", 0, i * 80 + 10);
                }

                if (i === 4) {
                    this._zeroPoint = i * 80 + 6;
                }

                this._context.beginPath();
                this._context.lineWidth = 0.8;
                this._context.strokeStyle = "#ccc";
                this._context.moveTo(this._indent, i * 80 + 6);
                this._context.lineTo(this._width, i * 80 + 6);
                this._context.stroke();
            }

            this._legendContainer.innerHTML = "";

            let meanLegend = document.createElement("div");
            meanLegend.classList.add("chart__legend--item", "blue");
            meanLegend.innerHTML = "среднее количество осадков";
            this._legendContainer.appendChild(meanLegend);

            this._drawPrecipitationChart(array);
        }

        if (array.length <= 10) {
            this._context.fillText("по месяцам", this._width - 56, 318);
        } else {
            this._context.fillText("по годам", this._width - 45, 318);
        }

        this._context.fillText(array[0].year + " год", this._indent, this._height - 8);
        this._context.fillText(array[array.length - 1].year + " год", this._width - 45, this._height - 8);
    }

    _drawTemperatureChart(array) {
        let yearTemperature = [];

        for (let i = 0; i < array.length; i++) {
            let yearTemperatures = [];
            let obj = {
                year: "",
                max: 0,
                min: 0,
                months: []
            };
            for (let key in array[i]) {
                if (array[i].hasOwnProperty(key) && key !== "year") {
                    let monthTemperatures = [];
                    for (let j = 0; j < array[i][key].length; j++) {
                        yearTemperatures.push(array[i][key][j].v);
                        monthTemperatures.push(array[i][key][j].v);
                    }
                    obj.months[key] = {
                        max: Math.max.apply(null, monthTemperatures),
                        min: Math.min.apply(null, monthTemperatures)
                    }
                }
            }
            obj.year = array[i].year;
            obj.max = Math.max.apply(null, yearTemperatures);
            obj.min = Math.min.apply(null, yearTemperatures);
            yearTemperature.push(obj);
        }

        this._context.beginPath();
        this._context.strokeStyle = "#cf000f";
        this._context.lineWidth = 2.5;
        this._context.lineJoin = "round";
        if (yearTemperature.length <= 10) {
            let step = (this._width - this._indent) / (yearTemperature.length * 11);
            let point = 0;
            for (let i = 0; i < yearTemperature.length; i++) {
                for (let key in yearTemperature[i].months) {
                    if (yearTemperature[i].months.hasOwnProperty(key)) {
                        let x = point === 0 ? this._indent : point * step + this._indent;
                        let y = this._zeroPoint - yearTemperature[i].months[key].max * 3.2;
                        this._context.lineTo(x, y);
                        ++point;
                    }
                }
            }
        } else {
            let step = (this._width - this._indent) / (yearTemperature.length - 1);
            for (let i = 0; i < yearTemperature.length; i++) {
                let x = i === 0 ? this._indent : i * step + this._indent;
                let y = this._zeroPoint - yearTemperature[i].max * 3.2;
                this._context.lineTo(x, y);
            }
        }
        this._context.stroke();

        this._context.beginPath();
        this._context.strokeStyle = "#3498db";
        this._context.lineWidth = 2.5;
        this._context.lineJoin = "round";
        if (yearTemperature.length <= 10) {
            let step = (this._width - this._indent) / (yearTemperature.length * 11);
            let point = 0;
            for (let i = 0; i < yearTemperature.length; i++) {
                for (let key in yearTemperature[i].months) {
                    if (yearTemperature[i].months.hasOwnProperty(key)) {
                        let x = point === 0 ? this._indent : point * step + this._indent;
                        let y = this._zeroPoint + yearTemperature[i].months[key].min * -3.2;
                        this._context.lineTo(x, y);
                        ++point;
                    }
                }
            }
        } else {
            let step = (this._width - this._indent) / (yearTemperature.length - 1);
            for (let i = 0; i < yearTemperature.length; i++) {
                let x = i === 0 ? this._indent : i * step + this._indent;
                let y = this._zeroPoint + yearTemperature[i].min * -3.2;
                this._context.lineTo(x, y);
            }
        }
        this._context.stroke();
    }

    _drawPrecipitationChart(array) {
        let yearPrecipitation = [];

        for (let i = 0; i < array.length; i++) {
            let meanPrecipitation = 0;
            let meanPerMonth = [];
            for (let key in array[i]) {
                if (array[i].hasOwnProperty(key) && key !== "year") {
                    let meanMonth = 0;
                    for (let j = 0; j < array[i][key].length; j++) {
                        meanMonth += array[i][key][j].v;
                    }
                    meanMonth = (meanMonth * 100) / array[i][key].length;
                    meanPerMonth.push(meanMonth);
                    meanPrecipitation += meanMonth;
                }
            }
            meanPrecipitation = meanPrecipitation / 12;
            let obj = {
                year: array[i].year,
                months: meanPerMonth,
                precipitation: meanPrecipitation
            }
            yearPrecipitation.push(obj);
        }

        this._context.beginPath();
        this._context.strokeStyle = "#3498db";
        this._context.lineWidth = 2.5;
        this._context.lineJoin = "round";

        if (yearPrecipitation.length <= 10) {
            let step = (this._width - this._indent) / (yearPrecipitation.length * 11);
            let point = 0;
            for (let i = 0; i < yearPrecipitation.length; i++) {
                for (let j = 0; j < yearPrecipitation[i].months.length; j++) {
                    let x = point === 0 ? this._indent : point * step + this._indent;
                    let y = this._zeroPoint - yearPrecipitation[i].months[j] * 0.64;
                    this._context.lineTo(x, y);
                    point++;
                }
            }
        } else {
            let step = (this._width - this._indent) / (yearPrecipitation.length - 1);
            for (let i = 0; i < yearPrecipitation.length; i++) {
                let x = i === 0 ? this._indent : i * step + this._indent;
                let y = this._zeroPoint - yearPrecipitation[i].precipitation * 1.33333333;
                this._context.lineTo(x, y);
            }
        }
        this._context.stroke();
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
