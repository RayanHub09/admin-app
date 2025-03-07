import React, { FC } from 'react';

interface ShadowWindowImgProps {
    onClose: () => void;
    imageSrc: string | null;
}

const ShadowWindowImg: FC<ShadowWindowImgProps> = ({ onClose, imageSrc }) => {
    return (
        <>
            <div className="overlay" onClick={onClose} />
            <div className="shadow_window_img_container" onClick={onClose}>
                {imageSrc && (
                    <img src={imageSrc} alt="Preview" />
                )}
            </div>
        </>
    );
};

export default ShadowWindowImg;
