import "./styles.scss";
import template from "./template.pug";

/**
 * @export
 * @class Tabs
 */
export default class Tabs {
    constructor() {
        this._render();

        this._tabsCollection = this._elem.querySelectorAll(".tabs__button");

        this._elem.addEventListener("click", event => {
            if (event.target.hasAttribute("data-button")) {
                this._onTabClick(event);
                event.preventDefault();
            }
        });
    }

    /**
     * @param {click} event
     * @memberof Tabs
     */
    _onTabClick(event) {
        event.preventDefault();

        for (let i = 0; i < this._tabsCollection.length; i++) {
            this._tabsCollection[i].classList.remove("active");
        }

        event.target.className += " active";

        let table = event.target.getAttribute("data-button");

        this._elem.dispatchEvent(new CustomEvent("get-data", {
            bubbles: true,
            detail: {
                value: table
            }
        }));
    }

    _render() {
        let tmp = document.createElement("div");
        tmp.classList.add("tabs");
        tmp.innerHTML = template({});
        this._elem = tmp;
    }

    getElem() {
        return this._elem;
    }

}
