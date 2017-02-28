require('@risingstack/trace');
import Head from 'next/head'
import React from 'react'
import ReactDOM from 'react-dom'
import {Editor, EditorState, RichUtils, Modifier} from 'draft-js'
import NoSSR from 'react-no-ssr'

class PlainTextEditorExample extends React.Component {
  constructor (props) {
    super(props)
    this.state = {editorState: EditorState.createEmpty()}

    this.focus = () => this.refs.editor.focus()
    this.onChange = (editorState) => this.setState({editorState})
    this.logState = () => console.log(this.state.editorState.toJS())
  }

  handleKeyCommand = (command) =>{
    const newState = RichUtils.handleKeyCommand(this.state.editorState, command);
    if (newState) {
      this.onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }

  onTab = (e) =>{
    e.preventDefault() //prevent tab from dropping focus
    const editorState = this.state.editorState;
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    const ncs = Modifier.insertText(contentState, selection, "\t");
    const es = EditorState.push(editorState, ncs, 'insert-fragment');
    this.setState({editorState: es})
  }

  render () {
    return (
      <div className="stylesRoot">
        <div className="stylesEditor" onClick={this.focus}>
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
            placeholder="Enter some text..."
            handleKeyCommand={this.handleKeyCommand}
            onTab={this.onTab}
            ref="editor"
          />
        </div>
        <input
          onClick={this.logState}
          className="stylesButton"
          type="button"
          value="Log State"
        />
      </div>
    )
  }
}

export default () => (
  <div>
    <Head>
      <meta charSet="utf-8" />
    </Head>
    BEFORE EDITOR
    <NoSSR>
      <PlainTextEditorExample />
    </NoSSR>
    AFTER EDITOR
    <style jsx>{`
      body {
        background: red
      }
    `}</style>
  </div>
)
