import React, { Component } from 'react'

export class SearchField extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            
             
        }
    }
    
    render() {
        return (
            <div classname="input field">
                <form>
                    <input type="text" id="filter" placeholder="Search for..." ref={input => this.search = input} onChange={this.handleInputChange}/>
                </form>               
            </div>
        )
    }
}

export default SearchField
