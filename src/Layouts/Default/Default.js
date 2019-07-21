import React, { Component } from "react";
import styles from "./Default.scss";
import {Main} from "~/components/Layout/Main";
import {Header} from "~/components/Layout/Header/Header";
import {Footer} from "~/components/Layout/Footer";
class Default extends Component {
    constructor(props) {
    
        super(props);

        this.state = {
        };
    } 
 
    render() {

        return (
            <div>
                <Header className={styles.Header} />
                <body className={styles.Main}>
                    <Main content={this.props.content}/>   
                </body>
                <Footer className={styles.Footer}/>
            </div>
        );
    }
      
}

export {Default};