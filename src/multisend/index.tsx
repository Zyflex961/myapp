// src/MultiSend/index.tsx

import '../global/actions/ui/shared';
import '../util/handleError';
import '../util/bigintPatch';

import React from '../lib/teact/teact';
import TeactDOM from '../lib/teact/teact-dom';
import { getActions } from '../global';
import { DEBUG, STRICTERDOM_ENABLED, THEME_DEFAULT, ANIMATION_LEVEL_DEFAULT } from './config';
import { requestMutation } from '../lib/fasterdom/fasterdom';
import { enableStrict } from '../lib/fasterdom/stricterdom';
import { betterView } from '../util/betterView';
import { forceLoadFonts } from '../util/fonts';
import { logSelfXssWarnings } from '../util/logs';
import switchTheme from '../util/switchTheme';
import { tonConnect } from './utils/tonConnect';

import App from './components/App';

import '../styles/index.scss';
import './index.scss';

if (STRICTERDOM_ENABLED) enableStrict();

(async () => {
  const actions = getActions();
  actions.setAnimationLevel({ level: ANIMATION_LEVEL_DEFAULT });
  actions.setTheme({ theme: THEME_DEFAULT });
  switchTheme(THEME_DEFAULT);

  try {
    // Load available wallets from TonConnect SDK
    const walletInfoList = await tonConnect.getWallets();
    console.log('Available wallets:', walletInfoList);

    // Auto-detect current environment wallet name
    const currentHost = window.location.hostname.toLowerCase();
    const frameName = window.name?.toLowerCase() || '';
    console.log('Current frame/host detected:', currentHost, frameName);

    // Dynamic detection logic
    const dynamicPriority: string[] = [];

    // If running inside DPS Wallet frame or same origin, prioritize DPS Wallet
    if (currentHost.includes('dps') || frameName.includes('dps')) {
      dynamicPriority.push('dpswallet');
    }

    // Always include other popular wallets as fallback
    dynamicPriority.push('mytonwallet', 'tonkeeper', 'tonhub', 'openmask');

    // Find wallet by priority list
    let selectedWalletInfo =
      walletInfoList.find((walletInfo) =>
        dynamicPriority.some((name) =>
          walletInfo.appName?.toLowerCase().includes(name)
        )
      ) || walletInfoList[0];

    console.log('Selected wallet for connection:', selectedWalletInfo?.appName);

    // Render main App
    requestMutation(() => {
      TeactDOM.render(
        <App mtwWalletInfo={selectedWalletInfo} />,
        document.getElementById('root')!,
      );
      forceLoadFonts();
      betterView();
    });

    if (window.top === window) logSelfXssWarnings();
  } catch (err) {
    console.error('Wallet initialization error:', err);
  }
})();