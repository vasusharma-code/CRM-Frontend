import React from "react";
import { useLocation } from "react-router-dom";

const ViewProof = () => {
    const location = useLocation();
    const { imageUrl } = location.state || {};

    if (!imageUrl) {
        return <div className="flex justify-center items-center h-screen">No image to display</div>;
    }

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <img 
                src={imageUrl} 
                alt="Proof" 
                className="object-contain" 
                style={{ width: "600px", height: "800px" }} // Fixed dimensions for better visibility
            />
        </div>
    );
};

export default ViewProof;
