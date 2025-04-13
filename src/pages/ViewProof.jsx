import React from "react";
import { useLocation } from "react-router-dom";
import "../styles/ViewProof.css"; // Assuming you have some CSS for styling

const ViewProof = () => {
    const location = useLocation();
    const { imageUrl } = location.state || {};

    if (!imageUrl) {
        return <div className="no-image">No image to display</div>;
    }

    return (
        <div className="proof-container">
            <img 
                src={imageUrl} 
                alt="Proof" 
                className="proof-image"
            />
        </div>
    );
};

export default ViewProof;
