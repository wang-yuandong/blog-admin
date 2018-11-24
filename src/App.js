import React, {Component} from 'react';
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import './App.css';


import {Cascader} from 'antd';

const options = [{
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [{
        value: 'hangzhou',
        label: 'Hanzhou',
        children: [{
            value: 'xihu',
            label: 'West Lake',
        }],
    }],
}, {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [{
        value: 'nanjing',
        label: 'Nanjing',
        children: [{
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
        }],
    }],
}];

function onChange(value) {
    console.log(value);
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {text: ''} // You can also pass a Quill Delta here
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(value) {
        this.setState({text: value})
    }

    render() {
        return (
            <div>
                <Cascader style={{width: '300px'}} options={options} onChange={onChange} changeOnSelect/>
                <ReactQuill value={this.state.text} onChange={this.handleChange}/>
            </div>
        );
    }
}

export default App;
