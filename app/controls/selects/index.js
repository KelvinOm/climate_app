import template from "./template.pug";
import "./styles.scss";

export default class Controls {
    constructor() {
        this._years = [];

        this._creatYearsList();
        this._render();

        this.firstYear = "1881";
        this.lastYear = "2006";

        this._elem.addEventListener("change", event => {
            if (event.target.hasAttribute("data-year")) {
                this.onChangeYear(event);
                event.preventDefault();
            }
        });
    }

    onChangeYear(event) {
        let selectedYear = event.target.value;

        if (selectedYear < this.firstYear) {
            this.firstYear = selectedYear;
        } else {
            this.lastYear = selectedYear;
        }

        this._elem.dispatchEvent(new CustomEvent("change-year", {
            bubbles: true,
            detail: {
                firstYear: this.firstYear,
                lastYear: this.lastYear
            }
        }));
    }

    _creatYearsList() {
        for (let i = 0; i <= 125; i++) {
            this._years.push(1881 + i);
        }
    }

    _render() {
        let tmp = document.createElement("div");
        tmp.innerHTML = template({
            years: this._years
        });
        this._elem = tmp;
        this._elem.querySelector("select[name^='last-year']").value = "2006";
    }

    getElem() {
        return this._elem;
    }
}
