import { LightningElement, api } from 'lwc';

export default class CpeActionEditor extends LightningElement {

    @api
    inputVariables;

    _query;
    _count;
    _active;

    get query() {
        if(this._query == null) {
            this._query = this._getInput('query',null);
        }
        return this._query;
    }

    get count() {
        if(this._count == null) {
            this._count = this._getInput('count',5);
        }
        return this._count;
    }

    get active() {
        if(this._active == null) {
            this._active = this._getInput('active',true);
        }
        return this._active;
    }

    _getInput(varName, defaultValue) {
        const param = this.inputVariables.find(({ name }) => name === varName);
        if(param == null || param.value == null) {
            return defaultValue;
        } else if(param.valueDataType === 'Boolean') {
            return '$GlobalConstant.True' === param.value;
        } else if(param.valueDataType === 'Number') {
            return Number(param.value);
        } else {
            return param.value;
        }
    }

    handleQueryChanged(evt) {
        this._query = evt.detail.value;
        this._dispatchInputChanged('query',this._query,'String');
    }

    handleCountChanged(evt) {
        this._count = Number(evt.detail.value);
        this._dispatchInputChanged('count',this._count,'Number');
    }

    handleActiveChanged(evt) {
        this._active = evt.detail.checked;
        const inputValue = this._active
            ? '$GlobalConstant.True'
            : '$GlobalConstant.False';
        this._dispatchInputChanged('active',inputValue,'Boolean');
    }

    _dispatchInputChanged(name, newValue, dataType) {
        this.dispatchEvent(new CustomEvent(
            'configuration_editor_input_value_changed',
            {
                bubbles: true,
                cancelable: false,
                composed: true,
                detail: {
                    name: name,
                    newValue: newValue,
                    newValueDataType: dataType,
                },
            }
        ));
    }

    @api
    validate() {
        const validity = [];
        if(this.query == null) {
            validity.push({key:'query',errorString:'Query is missing'});
        }
        if(this.count == null) {
            validity.push({key:'count',errorString:'Missing'});
        } else if(this.count < 1 || this.count > 200) {
            validity.push({key:'count',errorString:'Invalid value'});
        }
        return validity;
    }
}
