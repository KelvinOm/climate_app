import "./styles.scss";
import Tabs from "./tabs/";
import Select from "./slider/";

export default class Controls {
    constructor() {

        this._render();
    }

    _render() {
        let tmp = document.createElement("div");
        tmp.classList.add("controls-container");

        let tabs = this.tabs = new Tabs();
        tmp.appendChild(tabs.getElem());

        let select = this.select = new Select();
        tmp.appendChild(select.getElem());

        this._elem = tmp;
    }

    getElem() {
        return this._elem;
    }

}
