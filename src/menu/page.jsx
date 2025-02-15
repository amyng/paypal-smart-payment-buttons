/* @flow */
/** @jsx h */

import { h, render, Fragment, type Node } from 'preact';

import { getBody } from '../lib';

import { Menu } from './menu';
import { useXProps } from './hooks';

type PageProps = {|
    cspNonce : string
|};

function Page({ cspNonce } : PageProps) : Node {
    const { choices, onChoose, verticalOffset, hide } = useXProps();

    if (!choices) {
        return null;
    }

    const onBlur = () => {
        hide();
    };

    return (
        <Fragment>
            <style nonce={ cspNonce }>
                {`
                    * {
                        box-sizing: border-box;
                    }

                    html, body {
                        margin: 0;
                        padding: 0;
                    }

                    body {
                        padding: 5px 20px;
                        display: inline-block;
                        width: 100%;
                    }
                `}
            </style>

            <Menu choices={ choices } onChoose={ onChoose } onBlur={ onBlur } cspNonce={ cspNonce } verticalOffset={ verticalOffset } />
        </Fragment>
    );
}

type SetupOptions = {|
    cspNonce : string
|};

export function setupMenu({ cspNonce } : SetupOptions) {
    render(<Page cspNonce={ cspNonce } />, getBody());
}
 
