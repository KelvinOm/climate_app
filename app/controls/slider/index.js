import "./styles.scss";
import template from "./template.pug";

/**
 * @export
 * @class Slider
 */
export default class Slider {
    constructor() {
        this.years = [1881, 2006];

        this._render();

        this._creatRangeSlider();

        this.firstTooltip = this._elem.querySelector("[data-first-tolltip]");
        this.lastTooltip = this._elem.querySelector("[data-last-tolltip]");

        this._elem.addEventListener("mouseup", (event) => {
            if (event.target.hasAttribute("data-years")) {
                this._onDragStop();
            }
        });
    }

    /**
     * clone native input range for create multiple regime
     * create two custom property valueLow and valueHigh
     * call setTooltipPosition when update
     * @memberof Slider
     */
    _creatRangeSlider() {
        let descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");

        let input = this._elem.querySelector("[data-years]");

        let value = input.getAttribute("value");
        let values = value === null ? [] : value.split(",");
        let min = input.min || 0;
        let max = input.max || 100;
        let ghost = input.cloneNode();

        ghost.classList.add("ghost");

        input.value = values[0];
        ghost.value = values[1];

        input.parentNode.insertBefore(ghost, input.nextSibling);

        Object.defineProperty(input, "originalValue", descriptor);

        Object.defineProperties(input, {
            valueLow: {
                get: function() {
                    return Math.min(this.originalValue, ghost.value);
                },
                set: function(v) {
                    this.originalValue = v;
                },
                enumerable: true
            },
            valueHigh: {
                get: function() {
                    return Math.max(this.originalValue, ghost.value);
                },
                set: function(v) {
                    ghost.value = v;
                },
                enumerable: true
            }
        });

        let update = function() {
            ghost.style.setProperty("--low", 100 * ((input.valueLow - min) / (max - min)) + 1 + "%");
            ghost.style.setProperty("--high", 100 * ((input.valueHigh - min) / (max - min)) - 1 + "%");
        }

        input.addEventListener("input", event => {
            event.preventDefault();
            this.years[0] = input.valueLow * 1.25 + 1881;
            this.years[1] = input.valueHigh * 1.25 + 1881;
            update();
            this._setTooltipPosition(input.value, ghost.value, "firstTooltip");
        });

        ghost.addEventListener("input", event => {
            event.preventDefault();
            this.years[0] = input.valueLow * 1.25 + 1881;
            this.years[1] = input.valueHigh * 1.25 + 1881;
            update();
            this._setTooltipPosition(input.value, ghost.value, "lastTooltip");
        });

        update();
    }

    /**
     * set of tooltip position when drag thumb of slider
     * @param {number} inputValue
     * @param {number} ghostValue
     * @param {string} type
     * @memberof Slider
     */
    _setTooltipPosition(inputValue, ghostValue, type) {
        if (type === "firstTooltip") {
            let currentPosition = inputValue * 2.5;
            let shift = (currentPosition * 0.065) - 26;
            this.firstTooltip.style.left = currentPosition - shift + "px";
            this.firstTooltip.textContent = inputValue * 1.25 + 1881;
            if (inputValue === "0" || inputValue === "100") {
                this.firstTooltip.classList.remove("active");
            } else {
                this.firstTooltip.classList.add("active");
            }
        } else {
            let currentPosition = ghostValue * 2.5;
            let shift = (currentPosition * 0.065) - 26;
            this.lastTooltip.style.left = currentPosition - shift + "px";
            this.lastTooltip.textContent = ghostValue * 1.25 + 1881;
            if (ghostValue === "0" || ghostValue === "100") {
                this.lastTooltip.classList.remove("active");
            } else {
                this.lastTooltip.classList.add("active");
            }
        }
    }

    /**
     * generate custom event when drag of thumb stop
     * @memberof Slider
     */
    _onDragStop() {
        this._elem.dispatchEvent(new CustomEvent("change-year", {
            bubbles: true,
            detail: {
                firstYear: this.years[0] + "",
                lastYear: this.years[1] + ""
            }
        }));
    }

    _render() {
        let tmp = document.createElement("div");
        tmp.classList.add("slider");
        tmp.innerHTML = template({
            firstYear: this.years[0],
            lastYear: this.years[1]
        });
        this._elem = tmp;
    }

    getElem() {
        return this._elem;
    }

}
