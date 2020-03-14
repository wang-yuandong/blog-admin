import React, { PureComponent } from 'react'
import BraftEditor from 'braft-editor'// 引入编辑器组件
import 'braft-editor/dist/index.css'// 引入编辑器样式
import './App.css'
import uuid from './tools/uuid'
import host from './config/host'
import ReactQuill from 'react-quill' // ES6
import 'react-quill/dist/quill.snow.css' // ES6
import { Cascader, Input, Button } from 'antd'
import { queryArticleApi ,queryCategoryApi} from './config/api'

/**
 * 富文本编辑器配置
 * @type {*[]}
 */
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],    // toggled buttons
  ['blockquote', 'code-block'],

  [{ 'header': 1 }, { 'header': 2 }],               // custom button values
  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
  [{ 'script': 'sub' }, { 'script': 'super' }],     // superscript/subscript
  [{ 'indent': '-1' }, { 'indent': '+1' }],         // outdent/indent
  [{ 'direction': 'rtl' }],                       // text direction

  [{ 'size': ['small', false, 'large', 'huge'] }],// custom dropdown
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

  [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
  [{ 'font': [] }],
  [{ 'align': [] }],
  ['image'],

  ['clean']                                     // remove formatting button
]

export default class App extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      // 下拉选数组
      options: [],
      // 添加类目相关
      parentId: '',
      typeName: '',
      // 文章相关
      title: '',
      subTitle: '',
      hoverKeySet: '',
      // 创建一个空的editorState作为初始值
      editorState: BraftEditor.createEditorState(null),
      text: ''
    }// You can also pass a Quill Delta here
  }

  handleChange = (value) => {
    this.setState({ text: value })
  }

  // 添加类型
  addType = () => {
    const parentId = this.state.parentId
    const typeName = this.state.typeName
    fetch(`${host.blogServer}/addType`, {
      method: 'POST',
      body: JSON.stringify({ id: uuid(), name: typeName, parentId: parentId || '-1' }),
      mode: 'cors',
    }).then(res => {
      return res
    }).then(json => {
      alert('类型名添加成功')
      return this.getSelectData()
        .then(value => {
          this.setState({ typeName: '' })
        })
    }).catch(err => {
    })
  }

  /**
   * 根据富文本编辑器的内容
   * @param editorState
   */
  handleEditorChange = (editorState) => {
    this.setState({ editorState })
  }
  /**
   * 添加文章
   */
  submitContent = () => {
    // 在编辑器获得焦点时按下ctrl+s会执行此方法
    // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
    const parentId = this.state.parentId
    if (!parentId || parentId === '-1') {
      alert(`父id为${parentId || '空'}`)
      return
    }
    fetch(`${host.blogServer}/addContent`, {
      method: 'POST',
      body: JSON.stringify({
        id: uuid(),
        title: this.state.title,
        subTitle: '',
        content: this.state.text,
        categoryId: parentId
      }),
      mode: 'cors',
    }).then(json => {
      return json
    }).catch(err => {
    })

  }
  /**
   * 类型名称
   * @param e
   */
  typeNameChange = (e) => {
    this.setState({ typeName: e.target.value })
  }

  /**
   * 文章名称
   * @param e
   */
  titleChange = e => {
    this.setState({ title: e.target.value })
  }
  // 类型改变是获取最低级的类型id
  onTypeChange = (e, selectedOptions) => {
    const id = e[e.length - 1]
    this.setState({ parentId: id })
    if (e.length === 3) {
      return queryArticleApi({ id })
        .then(value => {
          this.setState({
            title: value[0].title,
            text: value[0].content
          })
        })
        .catch(reason => {})
    }
  }

  /**
   * 向后台请求所有类型数据
   * @returns {Promise<any | never>}
   */
  getSelectData () {
    return queryCategoryApi()
      .then(value => {
        if (value.length === 0) {
          alert('数据空')
          return []
        } else {
          return value
        }
      })
      .catch(reason => {
        debugger
        alert('获取下拉选数据失败')
        return []
      })
  }

  renderMenu (arr) {
    const menu = []
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].children) {
        menu.push(
          <li data-key={arr[i].id} key={arr[i].id}>
            {arr[i].name}
            <ul className={this.state.hoverKeySet.has(arr[i].id) ? '' : 'class-hide'}>
              {this.renderMenu(arr[i].children)}
            </ul>
          </li>
        )
      } else {
        menu.push(
          <li data-key={arr[i].id} key={arr[i].id}>
            {arr[i].name}
          </li>
        )
      }
    }
    return menu
  }

  componentWillMount () {
    this.getSelectData()
      .then(value => {
        const coolCreateTreeMap = new Map()
        for (let i = 0; i < value.length; i++) {
          const parentId = value[i].parentId
          if (coolCreateTreeMap.has(parentId)) {
            coolCreateTreeMap.get(parentId).push(value[i])
          } else {
            coolCreateTreeMap.set(parentId, [value[i]])
          }
        }

        function f (arr) {
          for (let i = 0; i < arr.length; i++) {
            if (coolCreateTreeMap.has(arr[i].id)) {
              arr[i]['children'] = coolCreateTreeMap.get(arr[i].id)
              f(coolCreateTreeMap.get(arr[i].id))
            }
          }
          return arr
        }

        this.setState({ options: f(coolCreateTreeMap.get('-1')) })
      })
  }

  render () {
    return (
      <div>
        <ul onClick={this.menuItemClick}>
          {this.renderMenu(this.state.options)}
        </ul>
        类目：
        <Cascader
          style={{ width: '30vw' }}
          options={this.state.options}
          onChange={this.onTypeChange} changeOnSelect
          fieldNames={{ label: 'name', value: 'id', children: 'children' }}
        />
        <Input
          type="text"
          style={{ width: '10vw' }}
          onChange={this.typeNameChange}
          value={this.state.typeName}
        />
        <Button onClick={this.addType}>增加类目</Button>
        <Button onClick={this.addType}>修改类目</Button>
        <Button onClick={this.addType}>删除类目</Button>
        <br/>
        <br/>
        增加内容：
        <Button onClick={this.submitContent}>增加内容</Button>
        <br/>
        博客标题：
        <Input
          type="text"
          onChange={this.titleChange}
          value={this.state.title}
        />
        博客内容：
        <ReactQuill
          value={this.state.text}
          onChange={this.handleChange}
          modules={{ toolbar: toolbarOptions }}
        />
      </div>
    )
  }
}