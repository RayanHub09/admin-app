import React, { FC } from 'react';

interface ShadowWindowImgProps {
    onClose: () => void;
    imageSrc: string | null;
}

const ShadowWindowImg: FC<ShadowWindowImgProps> = ({ onClose, imageSrc }) => {
    return (
        <>
            <div className="overlay" />
            <div className="shadow_window_img_container">
                {imageSrc && (
                    <img src={imageSrc} alt="Preview" />
                )}
                <button
                    className={'default_button'}
                    onClick={onClose}>Закрыть</button>
            </div>
        </>
    );
};

export default ShadowWindowImg;
