import React, { StrictMode, useEffect, useState } from "react";
import "./accommodation.css";
import navbar from "../assets/images/ChatGPT Image Dec 31, 2025, 03_01_35 PM.png";
function Accommodation(){
    const cards = [{id : 1},{id : 2},{id : 3},{id : 4},{id : 5},{id : 6},{id : 7},{id : 8},{id : 9},{id : 10},{id : 11},{id : 12},{id : 13},{id : 14},{id : 15},{id : 16}];
    return(
        <StrictMode>
        <div className = "main-container">
            <div className="container-1">
                <h1>HEADING</h1>
                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aut amet voluptate maxime quas est hic, sit eos quae nulla consectetur nemo ab facilis veritatis! Ab, tempora! Repellat laudantium quas optio.</p>
                {/*loding cards */}
                <div className="cards-container">
                        {cards.map((index,card)=>{
                        return (
                            <div className = "card" key={card.id}>
                                hi
                            </div>
                        )
                    })}
                </div>
                {/*ends */}
            </div>
            <div className="container-2">
                <img
                src = {navbar} />
            </div>
        </div>
        </StrictMode>
    );
}

export default Accommodation;