import ShareButton from "../sharebutton/ShareButton";
import React, {useContext, useState} from "react";
import {Context} from "../marketwrapper";
import cn from "classnames";


function MoreOptions(props) {
    const showMenu = props['showMenu'];
    const setShowMenu = props['setShowMenu'];
    const asset = props['asset'];

    const ual = props['ual'] ? props['ual'] : {'activeUser': ''};
    const activeUser = ual['activeUser'];
    const userName = activeUser ? activeUser['accountName'] : null;

    const [ state, dispatch ] = useContext(Context);

    const handleTransfer = props['handleTransfer'];
    const transferred = props['transferred'];
    const listed = props['listed'];
    const setIsLoading = props['setIsLoading'];

    const {sale_id, asset_id} = asset;

    const transfer = async () => {
        setIsLoading(true);
        dispatch({ type: 'SET_ASSET', payload: asset });
        dispatch({ type: 'SET_CALLBACK', payload: (sellInfo) => handleTransfer(sellInfo) });
        dispatch({ type: 'SET_ACTION', payload: 'transfer' });
    };

    const transferrable = !listed && !transferred && asset['owner'] === userName && asset_id;

    return (
        <div
            className={cn(
                'absolute right-0 top-0 w-32 h-auto',
                'p-4 flex-wrap rounded-lg z-20',
                'bg-gradient-to-br from-gray-700 via-gray-800 to-red-900',
                'transition-opacity duration-200',
                {'z-20 opacity-100' : showMenu},
                {'-z-10 opacity-0 hidden' : !showMenu}
            )}
            onMouseLeave={() => setShowMenu(false)}
        >
            <ShareButton type={'asset'} link={'https://nfthive.io' + (sale_id ? `/sale/${sale_id}` : `/asset/${asset_id}`)} />
            {
                transferrable ?
                    <div
                        className={cn(
                            'flex w-24 h-4 py-2 m-auto justify-start items-center',
                            'text-xs text-white font-bold cursor-pointer',
                            'rounded outline-none',
                            'transition-width duration-250',
                        )}
                        onClick={transfer}
                    >
                        <div className="text-center">
                            <img src="/diagonal-arrow-right-up-outline.svg" alt="Transfer" className="w-4 h-4 mr-4" />
                        </div>
                        <div>Transfer</div>
                    </div> : ''
            }
        </div>
    );
}

export default MoreOptions;
