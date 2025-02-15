/* @flow */

import { ENV, COUNTRY, CURRENCY, INTENT, COMMIT, VAULT, CARD, FUNDING, DEFAULT_COUNTRY, COUNTRY_LANGS } from '@paypal/sdk-constants';

import { HTTP_HEADER } from '../../config';
import type { FundingEligibility } from '../../service';
import type { ExpressRequest, ExpressResponse, LocaleType } from '../../types';

function getNonce(res : ExpressResponse) : string {
    let nonce = res.locals && res.locals.nonce;

    if (!nonce || typeof nonce !== 'string') {
        nonce = '';
    }

    return nonce;
}

type StyleType = {|
    label? : string,
    period? : ?number
|};

type ParamsType = {|
    env : $Values<typeof ENV>,
    clientID : string,
    locale? : LocaleType,
    buyerCountry : ?$Values<typeof COUNTRY>,
    currency : $Values<typeof CURRENCY>,
    intent : $Values<typeof INTENT>,
    commit : $Values<typeof COMMIT>,
    vault : $Values<typeof VAULT>,
    disableFunding : $ReadOnlyArray<?$Values<typeof FUNDING>>,
    disableCard : $ReadOnlyArray<?$Values<typeof CARD>>,
    merchantID? : $ReadOnlyArray<string>,
    buttonSessionID : string,
    clientAccessToken? : string,
    debug? : boolean,
    style : ?StyleType,
    onShippingChange? : boolean
|};

type RequestParams = {|
    env : $Values<typeof ENV>,
    clientID : ?string,
    buyerCountry : $Values<typeof COUNTRY>,
    currency : $Values<typeof CURRENCY>,
    intent : $Values<typeof INTENT>,
    commit : $Values<typeof COMMIT>,
    vault : $Values<typeof VAULT>,
    disableFunding : $ReadOnlyArray<?$Values<typeof FUNDING>>,
    disableCard : $ReadOnlyArray<?$Values<typeof CARD>>,
    merchantID : ?$ReadOnlyArray<string>,
    buttonSessionID : string,
    clientAccessToken : ?string,
    cspNonce : string,
    defaultFundingEligibility : FundingEligibility,
    locale : LocaleType,
    debug : boolean,
    style : {
        label : string,
        period : ?number
    },
    onShippingChange : boolean
|};

function getFundingEligibilityParam(req : ExpressRequest) : FundingEligibility {
    const encodedFundingEligibility = req.query.fundingEligibility;

    if (encodedFundingEligibility && typeof encodedFundingEligibility === 'string') {
        return JSON.parse(
            Buffer.from(encodedFundingEligibility, 'base64').toString('utf8')
        );
    }

    // $FlowFixMe
    return {
        [ FUNDING.PAYPAL ]: {
            eligible: true
        }
    };
}

export function getParams(params : ParamsType, req : ExpressRequest, res : ExpressResponse) : RequestParams {
    const {
        env,
        clientID,
        locale = {},
        buyerCountry = (req.get(HTTP_HEADER.PP_GEO_LOC) || COUNTRY.US),
        currency,
        intent,
        commit,
        vault,
        style: buttonStyle,
        disableFunding,
        disableCard,
        merchantID,
        buttonSessionID,
        clientAccessToken,
        debug = false,
        onShippingChange = false
    } = params;

    const {
        country = DEFAULT_COUNTRY,
        lang = COUNTRY_LANGS[country][0]
    } = locale;

    const cspNonce = getNonce(res);

    const defaultFundingEligibility = getFundingEligibilityParam(req);

    const {
        label = 'paypal',
        period
    } = buttonStyle || {};
    const style = { label, period };

    return {
        env,
        clientID,
        // $FlowFixMe
        buyerCountry,
        currency,
        intent,
        commit,
        vault,
        disableFunding,
        disableCard,
        merchantID,
        buttonSessionID,
        clientAccessToken,
        defaultFundingEligibility,
        cspNonce,
        debug,
        style,
        onShippingChange,
        // $FlowFixMe
        locale: { country, lang }
    };
}
