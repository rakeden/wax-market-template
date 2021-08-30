import React, {useEffect, useState} from 'react';
import cn from "classnames";
import config from '../../config.json';

const AssetImage = (props) => {

    const [imagePosition, setImagePosition] = useState(0);
    const [videoPlayer, setVideoPlayer] = useState(null);

    const asset = props['asset'];

    const {data, asset_id} = asset;

    const {img, backimg, video} = data;

    const media = [];
    const mediaFormats = [];

    if (video) {
        media.push(video);
        mediaFormats.push('video');
    }

    if (img) {
        media.push(img);
        mediaFormats.push('image');
    }

    if (backimg) {
        media.push(backimg);
        mediaFormats.push('image');
    }

    useEffect(() => {
        if (imagePosition >= media.length) {
            setImagePosition(0);
        }
        if (mediaFormats[imagePosition] === 'video') {
            setVideoPlayer(
                <video width="400" height="400" controls autoPlay={true} muted={false}>
                    <source src={config.ipfs + media[imagePosition]} />
                    Your browser does not support the video tag.
                </video>
            );
        }
    }, [asset_id, imagePosition, img]);

    return (
        <div className="relative flex justify-center asset-img w-full h-auto">
            {
                mediaFormats[imagePosition] === 'video' && videoPlayer ? videoPlayer :
                    <img className="max-w-full max-h-img-asset m-auto" src={config.ipfs + media[imagePosition]} alt="none"/>
            }
            <div className="absolute flex justify-evenly w-full mt-auto t-img-btn">
                {
                    media.map((image, index) =>
                        media.length > 1 ? (<div className="w-7 h-7 text-2xl text-white cursor-pointer bg-transparent outline-none border-none" onClick={
                            () => {setImagePosition(index);}}>
                            <img 
                                className={cn(
                                    'max-w-full m-auto max-h-img-asset',
                                    'w-auto rounded-md',
                                    'relative cursor-pointer'
                                )}
                                src={index === imagePosition ? "/radio-button-on.svg" : "/radio-button-off.svg"}
                            />
                        </div>) : ''
                    )
                }
            </div>
        </div>
    );
};

export default AssetImage;
