// import React from "react";
// import ReactDOM from "react-dom";
// import { BrowserRouter } from "react-router-dom";
// import App from './App'

// ReactDOM.render(<BrowserRouter><App/></BrowserRouter>),document.getElementById('root')
//引入react核心库
import React from 'react'
//引入ReactDOM
import { createRoot } from 'react-dom/client'
//引入App
import App from './App'
import { BrowserRouter } from "react-router-dom";
import memoryUtils from './util/memoryUtils';
import storageUtils from './util/storageUtils';

//读取local中保存的user，保存到内存中
const user = storageUtils.getUser()
memoryUtils.user = user

const container = document.getElementById('root')
const root = createRoot(container)
root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
)

// ReactDOM.render(
//     <BrowserRouter>
//         <App />
//     </BrowserRouter>,
//     document.getElementById('root')
// )