import React, { StrictMode, useEffect, useState } from "react";
import "./accommodation.css";
import navbar from "../assets/images/ChatGPT Image Dec 31, 2025, 03_01_35 PM.png";
function Accommodation(){
    const cards = [{id : 1},{id : 2},{id : 3},{id : 4},{id : 5},{id : 6},{id : 7},{id : 8},{id : 9},{id : 10},{id : 11},{id : 12},{id : 13},{id : 14},{id : 15},{id : 16}];
    return(
        <StrictMode>
        <div className = "main-container">
            <div className="container-1">
                <h1 className = "heading"><span>ACCOMMODATIONS</span>
                    <button className="holder" id = "b1"></button>
                    <button className="holder" id = "b2"></button>
                    <button className="holder" id = "b3"></button>
                    <button className="holder" id = "b4"></button>
                </h1>
                <p className= "head-p" >Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aut amet voluptate maxime quas est hic, sit eos quae nulla consectetur nemo ab facilis veritatis! Ab, tempora! Repellat laudantium quas optio.</p>
                {/*loding cards */}
                <div className="cards-container">
                        {cards.map((index,card)=>{
                        return (
                            <div className = "card" key={card.id}>
                                <div className="m-con">
                                    <h1>HEADING</h1>
                                    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Reiciendis veniam repellat labore, ipsa blanditiis reprehenderit aperiam ad praesentium saepe rem consequatur cum soluta nobis necessitatibus esse dignissimos voluptatem ab? Necessitatibus.</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
                {/*ends */}
            </div>
            <div className="container-2">
            <div className="bnt-con">
            <button className="nav-btn" id="n1">
                INFORMATION
            </button>
            <button className="nav-btn" id="n2">
                FAQ
            </button>
            <button className="nav-btn" id="n3">
                RULES
            </button>
            <button className="nav-btn" id="n4">
                MAP
            </button>
            </div>
            </div>
        </div>
        </StrictMode>
    );
}

export default Accommodation;