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
            <img src={imageUrl} alt="Proof" className="max-w-full max-h-full" />
        </div>
    );
};

export default ViewProof;
