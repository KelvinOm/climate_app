import template from "./template.pug";
import "./styles.scss";

export default class Controls {
    constructor() {
        this._render();

        this._tabsCollection = this._elem.querySelectorAll(".tablink");

        this._elem.addEventListener("click", event => {
            if (event.target.hasAttribute("data-tablink")) {
                this.onTabClick(event);
                event.preventDefault();
            }
        });
    }

    onTabClick(event) {
        event.preventDefault();

        for (let i = 0; i < this._tabsCollection.length; i++) {
            this._tabsCollection[i].classList.remove("active");
        }

        event.target.className += " active";

        let table = event.target.getAttribute("data-tablink");

        this._elem.dispatchEvent(new CustomEvent("get-data", {
            bubbles: true,
            detail: {
                value: table
            }
        }));
    }

    _render() {
        let tmp = document.createElement("div");
        tmp.innerHTML = template({});
        this._elem = tmp;
    }

    getElem() {
        return this._elem;
    }

}